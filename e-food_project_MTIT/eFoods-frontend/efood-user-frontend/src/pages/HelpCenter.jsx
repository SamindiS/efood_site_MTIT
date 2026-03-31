import React, { useState } from 'react';
import { Search, HelpCircle, FileText, MessageSquare, Coffee, ChevronRight, ArrowLeft } from 'lucide-react';
import logo from '../assets/efoods.png';
import UserNavBar from '../components/userNavBar';
import Footer from '../components/Footer';

// Color palette from user
const colors = {
  darkBrown: '#18230F',  // Very dark brown/green
  darkGreen: '#27391C',  // Dark forest green
  brightGreen: '#255F38', // Medium green
  teal: '#1F7D53'        // Teal/turquoise green
};

const HelpCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const categories = [
    { id: 1, title: 'Getting Started', icon: <Coffee />, articles: [
      { id: 101, title: 'How to create an account', content: 'To create an account, click on the "Sign Up" button in the top right corner of the homepage...' },
      { id: 102, title: 'Placing your first order', content: 'Browse restaurants near you by entering your address or allowing location access...' },
      { id: 103, title: 'Payment methods', content: 'We accept various payment methods including credit/debit cards, digital wallets...' }
    ]},
    { id: 2, title: 'Orders & Delivery', icon: <FileText />, articles: [
      { id: 201, title: 'Tracking your order', content: 'Once your order is confirmed, you can track its progress in real-time...' },
      { id: 202, title: 'Delivery times explained', content: 'Estimated delivery times are calculated based on distance, traffic conditions...' },
      { id: 203, title: 'Modifying or canceling an order', content: 'You can modify or cancel your order within 5 minutes of placing it...' }
    ]},
    { id: 3, title: 'Account & Billing', icon: <MessageSquare />, articles: [
      { id: 301, title: 'Updating account information', content: 'To update your profile, go to Account Settings and select the information you wish to change...' },
      { id: 302, title: 'Subscription plans', content: 'Our premium subscription offers free delivery, exclusive discounts, and priority support...' },
      { id: 303, title: 'Billing issues', content: 'If you notice any discrepancies in your billing or have questions about charges...' }
    ]},
    { id: 4, title: 'Troubleshooting', icon: <HelpCircle />, articles: [
      { id: 401, title: 'App not loading properly', content: 'If the app is slow or not loading, try clearing your cache and cookies...' },
      { id: 402, title: 'Issues with restaurant menus', content: 'Restaurant menus are updated regularly. If you notice any discrepancies...' },
      { id: 403, title: 'Contact support', content: 'Our support team is available 24/7 to assist you with any issues...' }
    ]}
  ];
  
  const renderHomePage = () => (
    <div className="flex flex-col space-y-8">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search for help articles..." 
          className="w-full p-4 pl-12 rounded-xl bg-white border border-gray-200 shadow-sm"
        />
        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Popular Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => (
            <div 
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow transition-all"
            >
              <div className="p-3 rounded-full mr-4" style={{ backgroundColor: colors.brightGreen, color: 'white' }}>
                {category.icon}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.articles.length} articles</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Need more help?</h2>
        <p className="text-gray-600 mb-4">Our support team is available 24/7 to assist you with any questions or issues.</p>
        <button 
          className="py-3 px-6 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: colors.teal }}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
  
  const renderCategoryPage = () => (
    <div className="flex flex-col space-y-6">
      <button 
        onClick={() => setSelectedCategory(null)} 
        className="flex items-center text-gray-600 font-medium mb-2"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Help Center
      </button>
      
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full mr-4" style={{ backgroundColor: colors.brightGreen, color: 'white' }}>
          {selectedCategory?.icon}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{selectedCategory?.title}</h1>
      </div>
      
      <div className="space-y-3">
        {selectedCategory?.articles.map(article => (
          <div 
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow transition-all"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-800">{article.title}</h3>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderArticlePage = () => (
    <div className="flex flex-col space-y-6">
      <button 
        onClick={() => setSelectedArticle(null)} 
        className="flex items-center text-gray-600 font-medium mb-2"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to {selectedCategory?.title}
      </button>
      
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{selectedArticle?.title}</h1>
        <div className="prose text-gray-700">
          <p>{selectedArticle?.content}</p>
          <p className="mt-4">If you need further assistance with this topic, please don't hesitate to contact our support team.</p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="font-medium text-gray-800 mb-3">Was this article helpful?</h3>
          <div className="flex space-x-3">
            <button className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              Yes
            </button>
            <button className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ color: colors.darkBrown }}>
        <UserNavBar />
      
      <main className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        {!selectedCategory && !selectedArticle && (
          <div>
            <div className="flex items-center mb-2">
              <img src={logo} alt="eFoods Logo" className="h-10 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Help Center</h1>
            </div>
            <p className="text-gray-600 mb-8">Find answers to your questions about our eFoods ordering service</p>
            {renderHomePage()}
          </div>
        )}
        
        {selectedCategory && !selectedArticle && renderCategoryPage()}
        
        {selectedArticle && renderArticlePage()}
      </main>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;