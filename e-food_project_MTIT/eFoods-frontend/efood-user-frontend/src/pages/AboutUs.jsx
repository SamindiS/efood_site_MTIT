import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import samindi from '../assets/samindi.png';
import sandeepa from '../assets/sandeepa.png';
import hasini from '../assets/hasini.png';
import geethika from '../assets/geethika.png';
import keerthana from '../assets/keerthana.jpg';
import harshi from '../assets/harshi.jpg';

import UserNavBar from '../components/userNavBar';
import Footer from '../components/Footer';

const AboutUs = () => {
  const aboutRef = useRef(null);

  useEffect(() => {
    // Optional: Add any scroll animations or effects here
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="relative bg-[#18230F] min-h-screen text-white py-0 overflow-hidden" ref={aboutRef}>
      <UserNavBar />
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#1F7D53] blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#255F38] blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <img
              src="/src/assets/efoods.png"
              alt="eFoods Logo"
              className="h-24 md:h-32 mb-8 md:mb-0"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:w-1/2 text-center md:text-right"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1F7D53] to-[#255F38] bg-clip-text text-transparent">
              Our Story
            </h1>
            <div className="h-1 w-24 bg-[#1F7D53] rounded-full mx-auto md:ml-auto md:mr-0 mt-4"></div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="fade-in"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#27391C] to-[#18230F] shadow-xl border border-[#255F38]/20">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1F7D53]">Who We Are</h2>
              <p className="text-gray-300 mb-6">
                eFoods was founded in 2023 with a simple mission: to connect food lovers with their favorite meals in the most convenient way possible. What started as a small startup has grown into a community of food enthusiasts, dedicated delivery partners, and passionate restaurateurs.
              </p>
              <p className="text-gray-300">
                Today, we're proud to serve thousands of customers daily, bringing the best local cuisine right to their doorsteps. Our commitment to quality, convenience, and community drives everything we do.
              </p>

              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1F7D53] flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Fast Delivery</h3>
                    <p className="text-sm text-gray-400">30 minutes or less guaranteed</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-[#255F38] flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Quality Assurance</h3>
                    <p className="text-sm text-gray-400">We partner with only the best restaurants</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="fade-in"
          >
            <div className="relative h-full">
              {/* Stats Section */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#27391C] to-[#18230F] shadow-xl border border-[#255F38]/20 mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1F7D53]">Our Impact</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-[#18230F]/50">
                    <p className="text-3xl font-bold text-[#1F7D53]">500+</p>
                    <p className="text-gray-400">Restaurant Partners</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[#18230F]/50">
                    <p className="text-3xl font-bold text-[#1F7D53]">50k+</p>
                    <p className="text-gray-400">Happy Customers</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[#18230F]/50">
                    <p className="text-3xl font-bold text-[#1F7D53]">30+</p>
                    <p className="text-gray-400">Cities Covered</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[#18230F]/50">
                    <p className="text-3xl font-bold text-[#1F7D53]">1M+</p>
                    <p className="text-gray-400">Deliveries Made</p>
                  </div>
                </div>
              </div>

              {/* Vision Section */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#27391C] to-[#18230F] shadow-xl border border-[#255F38]/20">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#1F7D53]">Our Vision</h2>
                <p className="text-gray-300 mb-4">
                  At eFoods, we envision a world where delicious food is just a click away. We're committed to revolutionizing the food delivery experience by leveraging technology to bring convenience, quality, and variety to our customers.
                </p>
                <p className="text-gray-300">
                  Our goal is to expand to 100+ cities by 2026, while maintaining our commitment to sustainability, supporting local businesses, and delivering exceptional customer experiences.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 fade-in"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1F7D53]">Meet Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Samindi Sankalpani",
                role: "Founder & CEO",
                image: samindi,
              },
              {
                name: "S.M Karunathilaka",
                role: "Chief Operations Officer",
                image: sandeepa,
              },
              {
                name: "I.M Hasini Ilanganthilake",
                role: "Head of Technology",
                image: hasini,
              },
              {
                name: "K.G.G.K.Senavirathna",
                role: "Customer Relations",
                image: geethika,
              },
              {
                name: "S Keerthana",
                role: "Quality Assurance & Review Lead",
                image: keerthana,
              },
              {
                name: "M Harshika",
                role: "Loyalty & Promotions Manager",
                image: harshi,
              },
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden transform transition-all duration-300 group-hover:scale-110 bg-[#27391C] border-2 border-[#1F7D53]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-xl">{member.name}</h3>
                <p className="text-[#1F7D53]">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 text-center fade-in"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#255F38] to-[#1F7D53] shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join Our Journey?</h2>
            <p className="mb-8 text-gray-100 max-w-2xl mx-auto">
              Whether you're a restaurant looking to expand your reach or a tech enthusiast eager to join our team, we'd love to hear from you.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-[#18230F] font-semibold rounded-full hover:bg-gray-100 transition-colors">
                Become a Partner
              </button>
              <button className="px-8 py-3 bg-[#18230F] text-white font-semibold rounded-full border border-white/20 hover:bg-[#27391C] transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-20 py-6 border-t border-[#255F38]/30">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 eFoods. All rights reserved.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;