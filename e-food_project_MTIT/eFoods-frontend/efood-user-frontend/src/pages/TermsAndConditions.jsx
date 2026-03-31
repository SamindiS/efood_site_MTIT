import React, { useState } from 'react';
import logo from '../assets/efoods.png';
import UserNavBar from '../components/userNavBar';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Overview',
      content: `Welcome to eFoods! These Terms and Conditions govern your use of our food ordering service. By accessing or using eFoods, you agree to be bound by these terms. Please read them carefully before placing any orders.`
    },
    account: {
      title: 'Account Registration',
      content: `To use eFoods services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account and keep this information updated.`
    },
    ordering: {
      title: 'Ordering Process',
      content: `All orders placed through eFoods are subject to availability and acceptance by the restaurant partners. Prices, delivery fees, and minimum order requirements are determined by individual restaurants and may change without prior notice. We strive to display accurate information but cannot guarantee the absence of errors.`
    },
    payment: {
      title: 'Payments',
      content: `eFoods accepts various payment methods as indicated on the platform. By providing payment information, you represent that you are authorized to use the payment method. All payments are processed securely. We may use third-party payment processors whose terms may also apply.`
    },
    delivery: {
      title: 'Delivery',
      content: `Delivery times are estimates and may vary due to factors beyond our control. eFoods is not responsible for delays caused by traffic, weather conditions, or restaurant preparation times. You agree to provide accurate delivery information and to be present at the delivery location to receive your order.`
    },
    refunds: {
      title: 'Refunds & Cancellations',
      content: `Order cancellations are subject to our cancellation policy and the restaurant's policy. Refunds may be issued at our discretion if orders are incorrect, incomplete, or of unacceptable quality. Refund requests must be submitted within 24 hours of delivery.`
    },
    privacy: {
      title: 'Privacy & Data',
      content: `We collect and process your personal data in accordance with our Privacy Policy. By using eFoods, you consent to our data practices as described in the Privacy Policy, which includes the collection of order history, delivery addresses, and payment information to improve our services.`
    },
    liability: {
      title: 'Limitation of Liability',
      content: `eFoods shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. Our liability is limited to the amount paid by you for the specific order in question.`
    },
    changes: {
      title: 'Changes to Terms',
      content: `eFoods reserves the right to modify these Terms and Conditions at any time. Changes become effective immediately upon posting. Your continued use of eFoods after changes are posted constitutes acceptance of the modified terms.`
    },
    contact: {
      title: 'Contact Us',
      content: `If you have any questions about these Terms and Conditions, please contact our customer support team at support@efoods.com or through the in-app support feature.`
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <UserNavBar />

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Title Banner */}
          <div className="bg-gradient-to-r from-[#27391C] to-[#255F38] px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
            <p className="text-gray-100 mt-2">Last Updated: April 27, 2025</p>
          </div>

          <div className="md:flex">
            {/* Sidebar Navigation */}
            <div className="md:w-1/4 bg-gray-50 p-6">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-[#18230F] mb-4">Sections</h3>
                <nav className="space-y-2">
                  {Object.keys(sections).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeSection === key
                          ? 'bg-[#255F38] text-white font-medium'
                          : 'hover:bg-[#1F7D53] hover:bg-opacity-10 text-gray-700'
                      }`}
                    >
                      {sections[key].title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-3/4 p-8">
              <h2 className="text-2xl font-bold text-[#18230F] mb-6">{sections[activeSection].title}</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">{sections[activeSection].content}</p>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-12 flex justify-between">
                {Object.keys(sections).indexOf(activeSection) > 0 && (
                  <button
                    onClick={() => {
                      const currentIndex = Object.keys(sections).indexOf(activeSection);
                      setActiveSection(Object.keys(sections)[currentIndex - 1]);
                    }}
                    className="flex items-center text-[#1F7D53] hover:text-[#255F38] font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous Section
                  </button>
                )}
                
                {Object.keys(sections).indexOf(activeSection) < Object.keys(sections).length - 1 && (
                  <button
                    onClick={() => {
                      const currentIndex = Object.keys(sections).indexOf(activeSection);
                      setActiveSection(Object.keys(sections)[currentIndex + 1]);
                    }}
                    className="ml-auto flex items-center text-[#1F7D53] hover:text-[#255F38] font-medium"
                  >
                    Next Section
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-8">
          <div className="border-l-4 border-[#1F7D53] pl-6">
            <h3 className="text-xl font-bold text-[#18230F] mb-3">Accept Terms & Conditions</h3>
            <p className="text-gray-600 mb-6">
              By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
            <div className="flex items-center space-x-4">
              <button className="bg-[#255F38] hover:bg-[#1F7D53] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                I Accept
              </button>
              <button className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Decline
              </button>
            </div>
          </div>
        </div>

        
        
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;