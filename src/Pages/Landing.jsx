import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, ArrowRight, Users, Award, Heart } from 'lucide-react';
import logo from '../assets/logo2.png'

const Landing = ({ onUserRegistered }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        // Store user data in localStorage
        localStorage.setItem('cafeUser', JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          registeredAt: new Date().toISOString()
        }));
        
        setIsSubmitting(false);
        onUserRegistered(formData);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-cream to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start mb-8"
            >
              <div className="relative">
                <img src={logo} style={{ height: 100, width: 100 }}/>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="font-serif text-4xl font-bold text-primary-800">MoodNest Cafe</h1>
                <p className="text-secondary-600 font-medium">Exceptional Cuisine</p>
              </div>
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-800 mb-4">
                Welcome to Your Perfect Cafe Experience
              </h2>
              <p className="text-lg text-accent-600 mb-6 leading-relaxed">
                Step into a world where every mood tells a story and every meal is crafted with passion. 
                Join our community of food enthusiasts.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                  <Coffee className="h-6 w-6 text-primary-800" />
                </div>
                <h3 className="font-serif font-bold text-primary-800 mb-1">Premium Coffee</h3>
                <p className="text-sm text-accent-600">Ethically sourced beans</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-full mb-3">
                  <Users className="h-6 w-6 text-secondary-700" />
                </div>
                <h3 className="font-serif font-bold text-primary-800 mb-1">Community</h3>
                <p className="text-sm text-accent-600">Welcoming atmosphere</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                  <Award className="h-6 w-6 text-primary-800" />
                </div>
                <h3 className="font-serif font-bold text-primary-800 mb-1">Award Winning</h3>
                <p className="text-sm text-accent-600">Recognized excellence</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-medium p-8 border border-primary-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif font-bold text-primary-800 mb-2">
                    Join Our Cafe Family
                  </h3>
                  <p className="text-accent-600">
                    Enter your details to start your personalized mood journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-accent-700 font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-pink-100 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.name 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-accent-200 focus:border-primary-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-accent-700 font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-pink-100 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-accent-200 focus:border-primary-500'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-800 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Getting Ready...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Enter Cafe
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-accent-500">
                    By continuing, you agree to receive personalized recommendations and updates about our menu and events.
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-center"
              >
                <div className="flex items-center justify-center space-x-6 text-accent-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">10,000+ Happy Customers</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span className="text-sm">Award Winning</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Coffee Beans Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-300 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{
              y: -50,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Landing;
