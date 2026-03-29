import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
          alt="Cafe ambiance" 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/40"></div>
        {/* Animated Gradient Accent */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary-500/20 to-transparent blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 right-20 z-5"
        variants={floatingVariants}
        animate="animate"
      >
        <div className="text-6xl opacity-10">☕</div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-10 z-5"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <div className="text-5xl opacity-10">🍰</div>
      </motion.div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            variants={textVariants}
            custom={0}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white"
          >
            <Sparkles className="w-4 h-4 text-secondary-400" />
            <span className="text-sm font-semibold">Welcome to Moodsync Cafe</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={textVariants}
            custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight"
          >
            Where Mood<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 via-secondary-400 to-secondary-500">
              Meets Menu
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={textVariants}
            custom={2}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl leading-relaxed"
          >
            🎯 Choose your vibe • 🍽️ Explore our menu • 😋 Enjoy food that understands you
          </motion.p>

          {/* Description */}
          <motion.p
            variants={textVariants}
            custom={3}
            className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl"
          >
            Experience a revolutionary dining concept where your mood guides your meal. From energizing coffee to comfort food, every item is curated to match your current vibe.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={textVariants}
            custom={4}
            className="flex flex-wrap gap-4"
          >
            <Link to="/menu">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(208, 112, 68, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold rounded-lg flex items-center gap-2 hover:shadow-xl transition-all duration-300"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={textVariants}
            custom={5}
            className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-white/20"
          >
            {[
              { number: "500+", label: "Happy Customers" },
              { number: "50+", label: "Menu Items" },
              { number: "24/7", label: "Available" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-secondary-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <motion.div 
          className="w-8 h-12 border-2 border-white rounded-full flex justify-center p-2"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1.5 h-3 bg-white rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Side decoration */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-secondary-400 via-secondary-500 to-transparent opacity-50"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2 }}
      />
    </section>
  );
};

export default Hero;