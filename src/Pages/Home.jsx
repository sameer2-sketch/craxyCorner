import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, HelpCircle } from 'lucide-react';

// Components
import FeaturedItems from '../components/Home/FeaturedItems';
import About from '../components/Home/About';
import Testimonials from '../components/Home/Testimonials';
import Hero from '../components/Home/Hero';

const Home = ({ user }) => {
  return (
    <div>
      {/* Personalized Welcome Banner */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-800 to-primary-700 text-white py-3 mt-16"
        >
          <div className="container-custom text-center">
            <p className="text-sm md:text-base">
              Welcome back, <span className="font-semibold">{user.name.split(' ')[0]}</span>! 
              Ready for another amazing coffee experience? ☕
            </p>
          </div>
        </motion.div>
      )}
      
      <Hero />
      <FeaturedItems />
      <About />
      
      {/* Parallax CTA Section */}
      <section className="relative py-40 bg-fixed bg-cover bg-center bg-[url('https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-900/60 to-primary-900/40"></div>
        
        {/* Animated background element */}
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 50, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative container-custom text-center text-white z-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6"
          >
            <span className="text-sm font-semibold">✨ Our Mission</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight"
          >
            Where Every<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">
              Mood Finds a Flavor
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Step into a world of taste that understands how you feel - curated comfort in every bite
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center"
          >
           
          </motion.div>
        </motion.div>
      </section>
      
      <Testimonials />
      
      {/* Instagram Gallery Preview */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-block px-6 py-2 bg-secondary-500/10 border border-secondary-500/30 rounded-full mb-6"
            >
              <span className="text-sm font-semibold text-secondary-600">📸 Follow Us</span>
            </motion.div>
            
            <h2 className="section-title text-4xl md:text-5xl mb-4">
              Follow Us on<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-secondary-600"> Instagram</span>
            </h2>
            <p className="section-subtitle text-lg">
              Share your MoodNest Cafe moments with us using <span className="font-bold text-secondary-600">#MoodNestCafeMoments</span>
            </p>
          </motion.div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              "https://i.postimg.cc/m2fTYTRh/pexels-photo-2615323.jpg",
              "https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg?auto=compress&cs=tinysrgb&w=600",
              "https://i.postimg.cc/mD4gbRDP/pexels-photo-2079438.jpg",
              "https://i.postimg.cc/ZKstfZzr/pexels-photo-1775043.jpg"
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08 }}
                className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
              >
                <img 
                  src={image} 
                  alt={`Instagram post ${index + 1}`} 
                  className="w-full h-64 object-cover group-hover:filter group-hover:brightness-75 transition-all duration-300"
                />
                {/* Overlay on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4"
                >
                  <div className="text-white text-center">
                    <p className="font-bold mb-2">Check on Instagram</p>
                    <p className="text-sm text-gray-300">#MoodNestCafeMoments</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.a 
              href="https://www.instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-lg hover:shadow-xl transition-all"
            >
              <span>View More on Instagram</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
