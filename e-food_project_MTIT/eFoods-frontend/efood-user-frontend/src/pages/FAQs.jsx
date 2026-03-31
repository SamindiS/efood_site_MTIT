import { useState } from 'react';
import logo from '../assets/efoods.png';
import UserNavBar from '../components/userNavBar';
import Footer from '../components/Footer';

const FAQs = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs = [
    {
      question: "How do I place an order on eFoods?",
      answer: "Placing an order is simple! Browse restaurants or food items, add your selections to the cart, review your order, select delivery or pickup options, enter your payment details, and confirm your order. You'll receive a confirmation email with tracking information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and in some areas, cash on delivery. Payment options may vary depending on the restaurant partner."
    },
    {
      question: "How long will my delivery take?",
      answer: "Delivery times vary based on your location, the restaurant's preparation time, and current demand. You'll see an estimated delivery time before confirming your order, and you can track your delivery in real-time through our app."
    },
    {
      question: "Can I schedule an order for later?",
      answer: "Yes! During checkout, you can select 'Schedule for Later' and choose your preferred delivery date and time slot. Please note that availability may vary by restaurant."
    },
    {
      question: "How do I modify or cancel my order?",
      answer: "You can modify or cancel your order within 5 minutes of placing it by going to 'My Orders' and selecting the specific order. After 5 minutes, please contact our customer support as the restaurant may have already started preparing your food."
    },
    {
      question: "Is there a minimum order amount?",
      answer: "Minimum order amounts vary by restaurant. The specific minimum, if any, will be clearly displayed on the restaurant's page before you begin your order."
    },
    {
      question: "Do you offer any loyalty or rewards programs?",
      answer: "Yes! Our eFoods Rewards program gives you points for every order that can be redeemed for discounts, free delivery, or special offers. Look for the Rewards tab in your account to enroll and track your points."
    },
    {
      question: "How can I provide feedback about my order?",
      answer: "After receiving your order, you'll get a notification asking for a rating and review. You can also provide feedback anytime through the 'Order History' section or by contacting our customer support team."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <UserNavBar />

      {/* FAQ Content */}
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#18230F] mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-[#27391C] max-w-3xl mx-auto">
            Find answers to common questions about using our eFoods delivery service. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search box */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for answers..."
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#255F38] focus:border-transparent"
            />
            <div className="absolute left-4 top-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left focus:outline-none"
              >
                <h3 className="text-xl font-medium text-[#27391C]">{faq.question}</h3>
                <span className={`ml-6 flex-shrink-0 text-[#255F38] transition-transform duration-200 ${openFaq === index ? 'transform rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div className={`mt-3 transition-all duration-300 overflow-hidden ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

          
      </main>

      <Footer />
    </div>
  );
};

export default FAQs;