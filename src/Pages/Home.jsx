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
      <section className="relative py-32 bg-fixed bg-cover bg-center bg-[url('https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')]"
      >
        <div className="absolute inset-0 bg-primary-900 opacity-70"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative container-custom text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Where Every Mood Finds a Flavor
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Step into a world of taste that understands how you feel - curated comfort in every bite
          </p>
          
          
        </motion.div>
      </section>
      
      <Testimonials />
      
      {/* Instagram Gallery Preview */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Follow Us on Instagram</h2>
            <p className="section-subtitle">
              Share your Moodsync Cafe moments with us using #MoodsyncCafeMoments
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "https://i.postimg.cc/m2fTYTRh/pexels-photo-2615323.jpg",
              "https://images.pexels.com/photos/1002740/pexels-photo-1002740.jpeg?auto=compress&cs=tinysrgb&w=600",
              "https://i.postimg.cc/mD4gbRDP/pexels-photo-2079438.jpg",
              "https://i.postimg.cc/ZKstfZzr/pexels-photo-1775043.jpg"
            ].map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-lg shadow-soft"
              >
                <img 
                  src={image} 
                  alt={`Instagram post ${index + 1}`} 
                  className="w-full h-64 object-cover"
                />
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="https://www.instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              View More on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
