import React, { useState } from 'react';

import logo from '../assets/efoods.png';
import UserNavBar from '../components/userNavBar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  // State for tracking active section
  const [activeSection, setActiveSection] = useState('introduction');

  // Define our color scheme from the provided colors
  const colors = {
    darkGreen: '#18230F',
    forestGreen: '#27391C',
    mediumGreen: '#255F38',
    emeraldGreen: '#1F7D53',
    lightGray: '#f5f5f5',
    white: '#ffffff',
  };

  // Define sections of privacy policy
  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'information-sharing', title: 'Information Sharing' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies & Similar Technologies' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'changes', title: 'Changes to Policy' },
  ];

  const policyContent = {
    'introduction': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Welcome to eFoods</h3>
        <p className="mb-4">
          At eFoods, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our food ordering application.
        </p>
        <p className="mb-4">
          Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
        </p>
        <p>
          Last updated: April 27, 2025
        </p>
      </div>
    ),
    'information-collected': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Information We Collect</h3>
        <h4 className="font-medium mb-2">Personal Data</h4>
        <p className="mb-4">
          When you register for an account, we may collect personally identifiable information, such as your:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Delivery address</li>
          <li>Payment information</li>
        </ul>
        <h4 className="font-medium mb-2">Usage Data</h4>
        <p>
          We may also collect information on how the application is accessed and used. This may include information such as your device's IP address, browser type, pages visited, time spent on pages, and other diagnostic data.
        </p>
      </div>
    ),
    'how-we-use': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">How We Use Your Information</h3>
        <p className="mb-4">We use the information we collect for various purposes, including to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Process and deliver your orders</li>
          <li>Manage your account and provide customer support</li>
          <li>Send you order confirmations and updates</li>
          <li>Improve our application and user experience</li>
          <li>Personalize your experience and deliver content relevant to your preferences</li>
          <li>Process payments and prevent fraudulent transactions</li>
        </ul>
      </div>
    ),
    'information-sharing': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Information Sharing</h3>
        <p className="mb-4">We may share your information with:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Restaurants and delivery partners to fulfill your orders</li>
          <li>Payment processors to complete transactions</li>
          <li>Service providers who assist us in operating our application</li>
          <li>Law enforcement when required by law</li>
        </ul>
        <p>
          We do not sell or rent your personal information to third parties for marketing purposes without your explicit consent.
        </p>
      </div>
    ),
    'data-security': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Data Security</h3>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </p>
        <p>
          However, please note that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee the absolute security of your data.
        </p>
      </div>
    ),
    'your-rights': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Your Rights</h3>
        <p className="mb-4">Depending on your location, you may have the right to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Access personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Object to processing of your information</li>
          <li>Request restriction of processing</li>
          <li>Data portability</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the information provided in the Contact Us section.
        </p>
      </div>
    ),
    'cookies': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Cookies & Similar Technologies</h3>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track activity on our application and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
        </p>
        <p className="mb-4">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our application.
        </p>
      </div>
    ),
    'children': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Children's Privacy</h3>
        <p className="mb-4">
          Our application is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
        </p>
        <p>
          If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
        </p>
      </div>
    ),
    'changes': (
      <div>
        <h3 className="text-xl mb-4 font-semibold">Changes to This Privacy Policy</h3>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <UserNavBar />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-8 px-6 md:flex">
        {/* Sidebar Navigation */}
        <aside className="md:w-1/4 mb-6 md:mb-0 md:pr-6">
          <div className="sticky top-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: colors.forestGreen }}>
              Privacy Policy
            </h2>
            <nav>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        activeSection === section.id 
                          ? 'text-white font-medium' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      style={{ 
                        backgroundColor: activeSection === section.id ? colors.mediumGreen : 'transparent',
                      }}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="md:w-3/4 bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="prose max-w-none">
            {policyContent[activeSection]}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;