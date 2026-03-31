import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#18230F] text-white">
      {/* Top section with colorful accent bar */}
      <div className="w-full flex">
        <div className="h-1 w-1/4 bg-[#18230F]"></div>
        <div className="h-1 w-1/4 bg-[#27391C]"></div>
        <div className="h-1 w-1/4 bg-[#255F38]"></div>
        <div className="h-1 w-1/4 bg-[#1F7D53]"></div>
      </div>
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and About */}
          <div>
            <div className="mb-6">
              <img src="/src/assets/efoods.png" alt="eFoods Logo" className="h-12" />
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Your premium food delivery service. Connecting food lovers with delicious 
              restaurants across the country, delivered right to your door.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="bg-[#255F38] p-2 rounded-full hover:bg-[#1F7D53] transition-colors duration-300">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="bg-[#255F38] p-2 rounded-full hover:bg-[#1F7D53] transition-colors duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="bg-[#255F38] p-2 rounded-full hover:bg-[#1F7D53] transition-colors duration-300">
                <Twitter size={18} />
              </a>
              <a href="mailto:support@efoods.com"
                className="bg-[#255F38] p-2 rounded-full hover:bg-[#1F7D53] transition-colors duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#1F7D53]">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">Home</Link></li>
              <li><Link to="/restaurants" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">Restaurants</Link></li>
              <li><Link to="/aboutus" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contactus" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#1F7D53]">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">FAQs</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-[#1F7D53] transition-colors duration-300">Help Center</Link></li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-[#1F7D53]">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-center">
                <span className="mr-2">📱</span> +94 71 234 5678
              </p>
              <p className="flex items-center">
                <span className="mr-2">📧</span> support@efoods.com
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span> 123 Main Street, Colombo 07, Sri Lanka
              </p>
            </div>
            
            {/* Newsletter form */}
            <div className="mt-6">
              <h5 className="font-medium mb-3 text-sm">Subscribe to our newsletter</h5>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[#27391C] text-white px-3 py-2 rounded-l text-sm flex-grow focus:outline-none" 
                />
                <button className="bg-[#1F7D53] hover:bg-[#255F38] text-white px-3 py-2 text-sm rounded-r transition-colors duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom footer */}
      <div className="bg-[#18230F] border-t border-[#27391C]">
        <div className="max-w-7xl mx-auto py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} eFoods. All rights reserved.</p>
          <div className="mt-2 md:mt-0">
            <a href="/terms" className="hover:text-[#1F7D53] mr-4 transition-colors duration-300">Terms</a>
            <a href="/privacy" className="hover:text-[#1F7D53] transition-colors duration-300">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}