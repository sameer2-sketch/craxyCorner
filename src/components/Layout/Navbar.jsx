import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Coffee, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartIcon from '../Cart/CartIcon';
import logo from '../../assets/logo2.png'

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Support', path: '/support' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Feedback', path: '/feedback' },
    { name: 'Orders', path: '/orders' },
    { name: 'Support Tickets', path: '/support-tickets' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-black py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logo}
            className={`h-8 w-8 mr-2 ${isScrolled ? 'text-primary-800' : 'text-white'}`} 
            style={{ height: 50, width: 50 }}
          />
          <span 
            className={`font-serif text-xl font-bold ${
              isScrolled ? 'text-primary-800' : 'text-white'
            }`}
          >
            MoodNest Cafe
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium transition-colors duration-200 ${
                isScrolled ? 'text-accent-800 hover:text-primary-800' : 'text-white hover:text-secondary-500'
              } ${location.pathname === link.path ? 'border-b-2 border-secondary-500' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Cart Icon */}
          <div className={`${isScrolled ? 'text-primary-800' : 'text-white'}`}>
            <CartIcon isScrolled={isScrolled} />
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-primary-800 hover:bg-primary-50' 
                  : 'bg-white/10 text-white border-b border-accent-200'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-accent-200"
                >
                  <div className="p-3 border-b border-accent-200">
                    <p className="font-medium text-primary-800">{user?.name}</p>
                    <p className="text-sm text-accent-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center px-3 py-2 text-left text-accent-700 hover:bg-accent-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <div className={`${isScrolled ? 'text-primary-800' : 'text-white'}`}>
            <CartIcon />
          </div>
          <button
            className="focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-primary-800' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-primary-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-md"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-2 font-medium text-accent-800 hover:text-primary-800 ${
                    location.pathname === link.path ? 'text-primary-800 font-semibold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile User Info */}
              <div className="border-t border-accent-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-primary-800">{user?.name}</p>
                    <p className="text-sm text-accent-600">{user?.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center px-3 py-2 text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;