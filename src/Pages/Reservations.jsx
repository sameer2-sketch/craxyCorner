import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

const initialFormState = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    occasion: '',
    specialRequests: '',
  };

const Reservations = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Set minimum date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setMinDate(formattedDate);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formState.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formState.date) newErrors.date = 'Date is required';
    if (!formState.time) newErrors.time = 'Time is required';
    
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

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', 
    '1:30 PM', '2:00 PM', '5:00 PM', '5:30 PM', '6:00 PM', 
    '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
  ];

  return (
    <div className="pt-16">
      {/* Hero Banner */}
      <div className="relative h-80 bg-cover bg-center flex items-center justify-center" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Reserve a Table</h1>
          <p className="text-xl max-w-xl mx-auto">
            Make a reservation for your next visit to MoodNest Cafe
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reservation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isSubmitted ? (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10">
                <CheckCircle className="text-secondary-500 h-20 w-20 mb-6" />
                <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">Reservation Confirmed!</h2>
                <p className="text-lg text-accent-600 mb-8">
                  Thank you for your reservation. We've sent a confirmation email with all the details.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-primary"
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <div className="card">
                <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6">Book Your Table</h2>
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
                        placeholder="Your full name"
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
                    <label htmlFor="phone" className="block text-accent-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="Your phone number"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label htmlFor="date" className="block text-accent-700 mb-1">Date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formState.date}
                          min={minDate}
                          onChange={handleChange}
                          className={`form-input ${errors.date ? 'border-red-500' : ''} pl-10`}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500 h-5 w-5" />
                      </div>
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-accent-700 mb-1">Time *</label>
                      <div className="relative">
                        <select
                          id="time"
                          name="time"
                          value={formState.time}
                          onChange={handleChange}
                          className={`form-input ${errors.time ? 'border-red-500' : ''} pl-10 appearance-none`}
                        >
                          <option value="">Select a time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500 h-5 w-5" />
                      </div>
                      {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>
                    <div>
                      <label htmlFor="guests" className="block text-accent-700 mb-1">Guests *</label>
                      <div className="relative">
                        <select
                          id="guests"
                          name="guests"
                          value={formState.guests}
                          onChange={handleChange}
                          className="form-input pl-10 appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                          ))}
                          <option value="9">9+ People (Call us)</option>
                        </select>
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500 h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="occasion" className="block text-accent-700 mb-1">Occasion (Optional)</label>
                    <select
                      id="occasion"
                      name="occasion"
                      value={formState.occasion}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Select an occasion</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Business Meeting">Business Meeting</option>
                      <option value="Date">Date</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="specialRequests" className="block text-accent-700 mb-1">Special Requests (Optional)</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formState.specialRequests}
                      onChange={handleChange}
                      className="form-input min-h-[100px]"
                      placeholder="Any special requests or dietary requirements?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Reservation Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-primary-50 rounded-lg p-8">
              <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6">Reservation Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Hours of Operation</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span>7:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday - Sunday:</span>
                      <span>8:00 AM - 9:00 PM</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Reservation Policies</h3>
                  <ul className="list-disc pl-5 space-y-2 text-accent-700">
                    <li>Reservations are held for 15 minutes past the scheduled time.</li>
                    <li>For parties of 9 or more, please call us directly at (123) 456-7890.</li>
                    <li>Special requests are accommodated based on availability.</li>
                    <li>Cancellations should be made at least 4 hours in advance.</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Need Assistance?</h3>
                  <p className="text-accent-700 mb-4">
                    For immediate assistance or special arrangements, please contact us directly:
                  </p>
                  <div className="bg-white p-4 rounded-md">
                    <p className="font-medium">Phone: (123) 456-7890</p>
                    <p className="font-medium">Email: reservations@moodnest.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image */}
            <div className="mt-8 rounded-lg overflow-hidden shadow-soft hidden md:block">
              <img 
                src="https://images.pexels.com/photos/6270541/pexels-photo-6270541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="Cafe interior" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;