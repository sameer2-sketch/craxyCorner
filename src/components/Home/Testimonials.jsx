import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Richi Mehta',
    role: 'College Student',
    content: "MoodNest cafe has completely redefined ordering food for me. I love how it understands my mood and suggests just the right comfort food.",
    rating: 5,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    id: 2,
    name: ' Nehanth Bhandari',
    role: 'Tech Analyst',
    content: "I had a rough day and picked ‘Stressed’ — got the most comforting pasta and dessert combo. That felt personal.",
    rating: 5,
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  },
  {
    id: 3,
    name: 'Vinnitha Verma',
    role: ' Working Professional',
    content: "It's intuitive, fast, and the food is always on point. I no longer wait for staff — I just tap and enjoy!",
    rating: 4,
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let interval;
    
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [autoplay]);

  const handlePrev = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-20 bg-primary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Don't just take our word for it - hear from some of our satisfied customers.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-medium p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex mb-3">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-secondary-500 text-secondary-500" />
                    ))}
                    {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent-300" />
                    ))}
                  </div>
                  
                  <blockquote className="font-serif text-xl italic text-primary-800 mb-6">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  
                  <div>
                    <p className="font-medium text-lg">{testimonials[currentIndex].name}</p>
                    <p className="text-accent-600">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button 
            onClick={handlePrev}
            className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-primary-50 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-primary-800" />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-primary-50 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-primary-800" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoplay(false);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-primary-800' : 'bg-primary-200'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
