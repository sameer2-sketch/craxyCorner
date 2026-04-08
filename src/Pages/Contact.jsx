import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

const initialFormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const Contact = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formState.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormState(initialFormState);
      }, 1500);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <div className="relative h-80 bg-cover bg-center flex items-center justify-center" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-xl mx-auto">
            We'd love to hear from you! Get in touch with any questions or feedback
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6">
              Get in Touch
            </h2>
            <p className="text-accent-600 mb-8">
              Whether you have a question about our menu, opening hours, or want to share your experience, 
              we're here to help. Reach out to us using any of the methods below.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-primary-800" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-primary-800 mb-1">Address</h3>
                  <p className="text-accent-600">123 Coffee Street, Brewville, CA 90210</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-primary-800" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-primary-800 mb-1">Phone</h3>
                  <p className="text-accent-600">(123) 456-7890</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-primary-800" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-primary-800 mb-1">Email</h3>
                  <p className="text-accent-600">hello@moodnestcafe.com</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-primary-800" />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-primary-800 mb-1">Hours</h3>
                  <p className="text-accent-600">Monday - Friday: 7:00 AM - 8:00 PM</p>
                  <p className="text-accent-600">Saturday - Sunday: 8:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-medium h-80">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.7152203615976!2d-118.35894828430084!3d34.0756979226944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b8d3b1e0287d%3A0x9cc32be17df028b8!2sLos%20Angeles%2C%20CA%2090036!5e0!3m2!1sen!2sus!4v1648209561002!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Cafe location"
              ></iframe>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card">
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="text-secondary-500 h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">Message Sent!</h3>
                  <p className="text-accent-600 mb-6">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="btn btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-accent-700 mb-1">Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Your name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-accent-700 mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Your email address"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-accent-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className={`form-input ${errors.subject ? 'border-red-500' : ''}`}
                      placeholder="What is this regarding?"
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-accent-700 mb-1">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      className={`form-input min-h-[150px] ${errors.message ? 'border-red-500' : ''}`}
                      placeholder="Your message"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-primary-50 rounded-lg p-6">
              <h3 className="font-serif text-xl font-bold text-primary-800 mb-4">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary-800 mb-1">Do you take reservations for large groups?</h4>
                  <p className="text-accent-600 text-sm">Yes, we accept reservations for groups of all sizes. For parties of 9 or more, please call us directly.</p>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800 mb-1">Is there parking available?</h4>
                  <p className="text-accent-600 text-sm">We have a dedicated parking lot behind our cafe with free parking for customers.</p>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800 mb-1">Do you offer catering services?</h4>
                  <p className="text-accent-600 text-sm">Yes, we offer catering for events of all sizes. Please contact us for a custom quote.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;