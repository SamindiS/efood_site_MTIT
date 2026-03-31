const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

//webhook
//router.post("/webhook",paymentController.handleWebhook);

// Fetch order + user + card data
router.get("/placeorder/:userId", paymentController.getCheckoutInfo);


// stripe pay

router.post("/process", paymentController.createCheckoutSession);



//Fetch session details
router.get('/session/:sessionId', paymentController.getSessionDetails);



module.exports = router;
