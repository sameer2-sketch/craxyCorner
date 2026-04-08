import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const galleryImages = [
  // Interior
  {
    id: 1,
    src: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Cafe interior with wooden tables and chairs',
    category: 'interior'
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Cozy seating area with plants',
    category: 'interior'
  },
  {
    id: 3,
    src: 'https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Counter area with barista equipment',
    category: 'interior'
  },
  {
    id: 4,
    src: 'https://images.pexels.com/photos/3928526/pexels-photo-3928526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Outdoor seating area',
    category: 'interior'
  },
  
  // Food
  {
    id: 5,
    src: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Brunch plate with eggs and avocado',
    category: 'food'
  },
  {
    id: 6,
    src: 'https://images.pexels.com/photos/1600711/pexels-photo-1600711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Club sandwich on wooden board',
    category: 'food'
  },
  {
    id: 7,
    src: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Pancakes with berries and syrup',
    category: 'food'
  },
  {
    id: 8,
    src: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Fresh salad bowl',
    category: 'food'
  },
  
  // Drinks
  {
    id: 9,
    src: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Cappuccino with latte art',
    category: 'drinks'
  },
  {
    id: 10,
    src: 'https://images.pexels.com/photos/2615323/pexels-photo-2615323.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Cold brew coffee',
    category: 'drinks'
  },
  {
    id: 11,
    src: 'https://images.pexels.com/photos/1793035/pexels-photo-1793035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Fruit smoothie',
    category: 'drinks'
  },
  {
    id: 12,
    src: 'https://images.pexels.com/photos/685527/pexels-photo-685527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Herbal tea with lemon',
    category: 'drinks'
  },
  
  // Events
  {
    id: 13,
    src: 'https://images.pexels.com/photos/7538368/pexels-photo-7538368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Book club meeting at the cafe',
    category: 'events'
  },
  {
    id: 14,
    src: 'https://i.postimg.cc/1zCvSRMH/image.jpg',
    alt: 'Book club meeting at the cafe',
    category: 'events'
  },
  {
    id: 15,
    src: 'https://i.postimg.cc/mkCKxYS1/pexels-photo-2079438.jpg',
    alt: 'Coffee tasting event',
    category: 'events'
  },
  {
    id: 16,
    src: 'https://images.pexels.com/photos/6256081/pexels-photo-6256081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    alt: 'Community gathering',
    category: 'events'
  }
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(image => image.category === activeCategory);

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <div className="relative h-80 bg-cover bg-center flex items-center justify-center" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/2506990/pexels-photo-2506990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Gallery</h1>
          <p className="text-xl max-w-xl mx-auto">
            Explore the ambiance, dishes, and moments that make MoodNest Cafe special
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { value: 'all', label: 'All Photos' },
            { value: 'interior', label: 'Interior' },
            { value: 'food', label: 'Food' },
            { value: 'drinks', label: 'Drinks' },
            { value: 'events', label: 'Events' }
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === category.value
                  ? 'bg-primary-800 text-white'
                  : 'bg-white text-primary-800 hover:bg-primary-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="aspect-square overflow-hidden rounded-lg shadow-soft cursor-pointer"
                onClick={() => setSelectedImage(image)}
                whileHover={{ scale: 1.03 }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-4 right-4 text-white hover:text-secondary-500 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-8 w-8" />
              </button>

              <div className="max-w-4xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
                <motion.img
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-[80vh] rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 rounded-b-lg">
                  <p>{selectedImage.alt}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instagram CTA */}
      <section className="bg-primary-50 py-16">
        <div className="container-custom text-center">
          <h2 className="section-title">Share Your Moments</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Tag us on Instagram with #MoodNestCafeMoments for a chance to be featured on our page!
          </p>
          <a 
            href="https://www.instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Follow Us on Instagram
          </a>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
