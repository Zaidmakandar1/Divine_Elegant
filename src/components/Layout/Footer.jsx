import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/assets/images/logo/logo-icon.png" alt="Divine Elegant Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Divine Elegant
              </span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Discover the power of spiritual adornments. Each piece in our collection is carefully 
              crafted to enhance your spiritual journey and bring positive energy into your life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bracelets" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=necklaces" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link to="/shop?category=rings" className="text-gray-300 hover:text-indigo-400 transition-colors duration-200">
                  Rings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-300">info@divineelegant.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-indigo-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-indigo-400 mt-1" />
                <span className="text-gray-300">
                  123 Spiritual Avenue<br />
                  Harmony City, HC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Divine Elegant. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors duration-200">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;