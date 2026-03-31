const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

exports.getCheckoutInfo = async (req, res) => {
  const { userId } = req.params;

  const orderDB = req.app.locals.dbs.orderDB;

  const restaurantDB = req.app.locals.dbs.restaurantDB;

  const Order =
    require("../../../order-management-service-sasin/backend/models/Order")(
      orderDB
    );
  const User =
    require("../../../order-management-service-sasin/backend/models/User")(
      orderDB
    );
  const Restaurant =
    require("../../../restaurant-management-service-neranda/backend/models/Restaurant")(
      restaurantDB
    );
  const MenuItem =
    require("../../../restaurant-management-service-neranda/backend/models/MenuItem")(
      restaurantDB
    );

  try {
    const latestOrder = await Order.findOne({ userId }).sort({ createdAt: -1 });
    if (!latestOrder)
      return res.status(404).json({ message: "Order not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    //const savedCards = await Card.find({ userId });

    const itemsWithDetails = await Promise.all(
      latestOrder.items.map(async (item) => {
        console.log(
          `Fetching details for Item: ${item._id}, Restaurant ID: ${item.restaurantId}, MenuItem ID: ${item.menuitemId}`
        );

        // Convert to ObjectId correctly using new keyword
        const restaurant = await Restaurant.findById(
          new mongoose.Types.ObjectId(item.restaurantId)
        );
        const menuItem = await MenuItem.findById(
          new mongoose.Types.ObjectId(item.menuitemId)
        );

        console.log("Fetched Restaurant:", restaurant);
        console.log("Fetched MenuItem:", menuItem);

        return {
          ...item,
          restaurantName: restaurant ? restaurant.name : "Unknown Restaurant",
          menuItemName: menuItem ? menuItem.name : "Unknown Menu Item",
          price: menuItem ? menuItem.price : 0, // Assuming price is part of MenuItem
        };
      })
    );

    res.json({
      order: {
        items: itemsWithDetails,
        totalAmount: latestOrder.totalAmount,
        shippingInfo: latestOrder.shippingInfo,
      },
      customer: {
        firstName: user.firstName,
        lastName: user.lastName,
        contact: user.contact,
        email: user.email,
      },
      // savedCards
    });
  } catch (err) {
    console.error("Checkout fetch error:", err);
    res.status(500).json({ message: "Failed to fetch checkout data" });
  }
};

//Stripe Redirect
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  const { userId, orderId } = req.body;

  try {
    // Fetch order details from your database
    const Order =
      require("../../../order-management-service-sasin/backend/models/Order")(
        req.app.locals.dbs.orderDB
      );
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "E-Foods Order",
            },
            unit_amount: Math.round(order.totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL1}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL2}`,
      metadata: {
        userId: userId.toString(),
        orderId: orderId.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({ error: "Failed to create payment session" });
  }
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// Stripe Webhook Handler
exports.handleWebhook = async (req, res) => {
  const sigHeader = req.headers["stripe-signature"];
  const rawBody = req.body;

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sigHeader, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  // Step 2: Handle the event based on the type
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    const stripeSessionId = session.id;
    const paymentStatus = session.payment_status;

    console.log("Stripe session completed:", stripeSessionId, paymentStatus);

    try {
      // Step 3: Validate the Order ID
      const orderDB = req.app.locals.dbs.orderDB;
      const Order =
        require("../../../order-management-service-sasin/backend/models/Order")(
          orderDB
        );

      // Step 4: Fetch the Order from the Database
      const order = await Order.findById(orderId);
      if (!order) {
        console.warn("Order not found:", orderId);
        return res.status(404).json({ message: "Order not found" });
      }

      // Step 5: Update Order Payment Status
      order.isPaid = true;
      console.log("Updating order to paid", order);
      order.paymentInfo = {
        stripeSessionId,
        status: paymentStatus,
        paidAt: new Date(),
      };

      // Step 6: Log Order Before Saving (for debugging)
      console.log(session.payment_status);
      console.log("Order before saving:", order);

      // Step 7: Save the Order in the Database
      try {
        await order.save();
        console.log("Order updated as paid:", orderId);
      } catch (dbErr) {
        console.error("Error saving order to the database:", dbErr.message);
        return res.status(500).json({ error: "Failed to save order" });
      }

      // Save Payment Info to Payment Model
      try {
        const paymentDB = req.app.locals.dbs.paymentDB; // assume you're using separate DB
        const Payment = require("../models/Payment")(paymentDB); // adjust path if needed

        const paymentRecord = new Payment({
          orderId: order._id,
          stripeSessionId,
          amountTotal: session.amount_total / 100, // convert from cents
          currency: session.currency,
          status: paymentStatus,
          paidAt: new Date(),
        });

        await paymentRecord.save();
        console.log("Payment record saved:", paymentRecord._id);
      } catch (paymentSaveErr) {
        console.error("Error saving payment record:", paymentSaveErr.message);
      }

      

      // Step 8: Send Confirmation Email
      try {
        await sendEmail({
          to: order.user.email,
          subject: "Payment Confirmed - E-Foods",
          text: `Thank you for your payment for Order #${order._id}!`,
        });
        console.log("Confirmation email sent to:", order.user.email);
      } catch (emailErr) {
        console.error("Error sending email:", emailErr.message);
      }
    } catch (err) {
      console.error("Error processing webhook:", err.message);
      return res.status(500).json({ error: "Failed to process webhook" });
    }
  } else {
    console.warn("Unhandled event type:", event.type);
  }

  // Step 9: Respond to Stripe to acknowledge the receipt of the webhook
  res.status(200).json({ received: true });
};

//Get payment session details
exports.getSessionDetails = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      customerName: session.customer_details.name,
      customerEmail: session.customer_details.email,
      amount: session.amount_total,
      status: session.payment_status,
      created: session.created,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Failed to retrieve Stripe session:", error.message);
    res
      .status(500)
      .json({ error: "Failed to retrieve Stripe session details" });
  }
};

// //Redirect user to PayHere for payment
// const crypto = require("crypto");

// exports.processPayment = async (req, res) => {
//   const { userId, orderId, cardId } = req.body;

//   const Order = require("../../../order-management-service-sasin/backend/models/Order")(req.app.locals.dbs.orderDB);
//   const User = require("../../../order-management-service-sasin/backend/models/User")(req.app.locals.dbs.orderDB);
//   const Card = require("../models/Card")(req.app.locals.dbs.paymentDB);

//   try {
//     const order = await Order.findById(orderId);
//     const user = await User.findById(userId);

//     if (!order || !user) {
//       return res.status(404).json({ message: "Order or user not found" });
//     }

//     // Optional: Validate card if selected
//     if (cardId) {
//       const savedCard = await Card.findOne({ _id: cardId, userId });
//       if (!savedCard) {
//         return res.status(404).json({ message: "Saved card not found" });
//       }
//     }

//     // Build payment form
//     const form = {
//       merchant_id: process.env.PAYHERE_MERCHANT_ID,
//       return_url: process.env.PAYHERE_RETURN_URL,
//       cancel_url: process.env.PAYHERE_CANCEL_URL,
//       notify_url: process.env.PAYHERE_NOTIFY_URL,
//       order_id: order._id.toString(),
//       items: "E-Foods Order",
//       amount: order.totalAmount.toFixed(2),
//       currency: "LKR",
//       first_name: user.firstName,
//       last_name: user.lastName,
//       email: user.email,
//       phone: user.contact,
//       address: order.shippingInfo.address,
//       city: order.shippingInfo.city,
//       country: order.shippingInfo.country,
//     };

// // Debug logging
// console.log("Generating hash with these values:");
// console.log({
//   merchant_id: form.merchant_id,
//   order_id: form.order_id,
//   amount: form.amount,
//   currency: form.currency,
//   secret_key: process.env.PAYHERE_SECRET_KEY
// });

// const hash = generatePayHereHash(
//   form.merchant_id,
//   form.order_id,
//   form.amount,
//   form.currency,
//   process.env.PAYHERE_SECRET_KEY
// );

// console.log("Generated hash:", hash);
// form.hash = hash;

//     // Auto-submit HTML form
//     const formHtml = `
//       <html>
//         <body>
//           <form id="payhere-form" method="post" action="https://sandbox.payhere.lk/pay/checkout">
//             ${Object.entries(form)
//               .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}">`)
//               .join("")}
//           </form>
//           <script>document.getElementById('payhere-form').submit();</script>
//         </body>
//       </html>
//     `;

//     res.send(formHtml);
//   } catch (error) {
//     console.error("Error during payment redirect:", error);
//     res.status(500).json({ message: "Failed to process payment" });
//   }
// };

// //Handle PayHere Payment Notification
// exports.notifyPayment = async (req, res) => {
//   try {
//       const { paymentDB, orderDB } = req.app.locals.dbs;
//       const Transaction = require('../models/Payment')(paymentDB); // Your Payment model
//       const Order = require('../../../order-management-service-sasin/backend/models/Order')(orderDB); // Order from order service
//       const User = require('../../../order-management-service-sasin/backend/models/User')(orderDB); // User from order service
//       const FailedLog = require('../models/FailedTransactionLog')(paymentDB);

//       // Destructure required fields from PayHere POST notification
//       const { order_id, status_code, payment_id } = req.body;

//       // Find the transaction by the order_id provided by PayHere
//       const transaction = await Transaction.findOne({ orderId: order_id });

//       if (!transaction) {
//           return res.status(404).json({ message: 'Transaction not found' });
//       }

//       // Update transaction status based on status_code from PayHere
//       transaction.status = status_code === "2" ? "Completed" : "Failed";

//       // Save the PayHere-generated payment ID for future traceability
//       transaction.paymentId = payment_id;

//       // Save the updated transaction in the database
//       await transaction.save();

//       // Optional: Update the related order as paid if status is successful
//       if (status_code === "2") {
//           const order = await Order.findById(transaction.orderId);
//           if (order) {
//               order.isPaid = true;
//               order.paidAt = new Date();
//               await order.save();
//           }

//           // Send confirmation email
//           const user = await User.findById(transaction.userId);
//           if (user) {
//               await sendConfirmationEmail(user.email, user.firstName, transaction);
//           }
//       } else {
//           // Log failed transaction for auditing
//           await FailedLog.create({
//               orderId: transaction.orderId,
//               userId: transaction.userId,
//               paymentId: payment_id,
//               statusCode: status_code,
//               reason: "Payment failed or rejected",
//               receivedAt: new Date()
//           });
//       }

//       // Send success response to PayHere
//       res.status(200).json({ message: 'Payment notification processed successfully' });
//   } catch (error) {
//       console.error("Error in notifyPayment:", error.message);
//       res.status(500).json({ message: "Server error while processing payment notification" });
//   }
// };

// Helper: Send confirmation email
const sendConfirmationEmail = async (toEmail, userName, transaction) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use Mailgun, SendGrid, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "eFoods - Payment Successful",
      html: `
              <h3>Hello ${userName},</h3>
              <p>Thank you for your order. Your payment was successfully processed.</p>
              <p><strong>Order ID:</strong> ${transaction.orderId}</p>
              <p><strong>Payment ID:</strong> ${transaction.paymentId}</p>
              <p>We hope you enjoy your meal!</p>
              <br>
              <p>— eFoods Team</p>
          `,
    };

    await transporter.sendMail(mailOptions);
    console.log(` Confirmation email sent to ${toEmail}`);
  } catch (err) {
    console.error(" Failed to send confirmation email:", err.message);
  }
};
