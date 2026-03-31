import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-white-900 text-blace">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-2">eFoods</h2>
          <p className="text-sm text-gray-600">Delivering delicious experiences, one click at a time.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-sky-400">Home</a></li>
            <li><a href="#" className="hover:text-sky-400">About</a></li>
            <li><a href="#" className="hover:text-sky-400">Services</a></li>
            <li><a href="#" className="hover:text-sky-400">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-sky-400"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
            <a href="#" className="hover:text-sky-400"><FaInstagram /></a>
            <a href="#" className="hover:text-sky-400"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-700">
        © {new Date().getFullYear()} eFoods. All rights reserved.
      </div>
    </footer>
  )
}
