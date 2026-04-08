import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, MessageSquare, ThumbsUp, Heart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader/Loader';
import ErrorModal from '../components/Layout/ErrorModal';
import SuccessModal from '../components/Layout/SuccessModal';

const initialFormState = {
  name: '',
  email: '',
  orderNumber: '',
  rating: 0,
  category: '',
  description: '',
  wouldRecommend: '',
  suggestions: ''
};

const Feedback = () => {
  const user = JSON.parse(localStorage.getItem('cafeUser'));

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

  const feedbackCategories = [
    { value: 'food-quality', label: 'Food Quality' },
    { value: 'service', label: 'Service' },
    { value: 'ambiance', label: 'Ambiance' },
    { value: 'cleanliness', label: 'Cleanliness' },
    { value: 'value-for-money', label: 'Value for Money' },
    { value: 'ordering-experience', label: 'Ordering Experience' },
    { value: 'overall', label: 'Overall Experience' }
  ];

  useEffect(() => {
    if(user) {
      setFormState(prev => ({...prev, name: user.name, email: user.email}))
    }
  }, [])

  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.name.trim()) newErrors.name = 'Name is required';
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (formState.rating === 0) newErrors.rating = 'Please provide a rating';
    if (!formState.category) newErrors.category = 'Please select a feedback category';
    if (!formState.description.trim()) newErrors.description = 'Feedback is required';
    if (!formState.wouldRecommend) newErrors.wouldRecommend = 'Please let us know if you would recommend us';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (rating) => {
    setFormState(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      addFeedback()
      setFormState(initialFormState);
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
    }
  };

  const addFeedback = async () => {
    let payload = {
      id: uuidv4(),
      customerName: formState.name,
      customerEmail: formState.email,
      orderNumber: formState.orderNumber,
      rating: formState.rating,
      category: formState.category,
      description: formState.description,
      wouldRecommend: formState.wouldRecommend,
    };
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/feedback/addFeedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Create Feedback Failed',
          message: 'Failed to create feedback. Please try again.',
          details: 'Unknown error occurred'
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Feedback Sent',
          message: `Feedback has been successfully sent.`
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Create Feedback Failed',
        message: 'Failed to create feedback. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: '', message: '' });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: '', message: '' });
  };

  return (
    <div className="pt-16">
      {isLoading && <Loader showLoader={(isLoading)} />}
      <div className="relative h-80 bg-cover bg-center flex items-center justify-center" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Share Your Feedback</h1>
          <p className="text-xl max-w-xl mx-auto">
            Help us improve by sharing your experience at MoodNest Cafe
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isSubmitted ? (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10">
                <CheckCircle className="text-secondary-500 h-20 w-20 mb-6" />
                <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">Thank You!</h2>
                <p className="text-lg text-accent-600 mb-4">
                  Your feedback has been submitted successfully. We truly appreciate you taking the time to share your experience.
                </p>
                <p className="text-sm text-accent-500 mb-8">
                  Your feedback helps us serve you better and improve our services.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="btn btn-primary"
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-8 w-8 text-primary-800 mr-3" />
                  <h2 className="text-2xl font-serif font-bold text-primary-800">Your Feedback Matters</h2>
                </div>
                
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
                    <label htmlFor="orderNumber" className="block text-accent-700 mb-1">Order Number (Optional)</label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formState.orderNumber}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your order number if applicable"
                    />
                  </div>

                  {/* Rating Section */}
                  <div className="mb-6">
                    <label className="block text-accent-700 mb-2">Overall Rating *</label>
                    <div className="flex items-center space-x-2 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-8 w-8 transition-colors ${
                              star <= (hoveredStar || formState.rating) 
                                ? 'fill-secondary-500 text-secondary-500' 
                                : 'text-accent-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-4 text-lg font-medium text-primary-800">
                        {getRatingText(hoveredStar || formState.rating)}
                      </span>
                    </div>
                    {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-accent-700 mb-1">Feedback Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={formState.category}
                      onChange={handleChange}
                      className={`form-input ${errors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {feedbackCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-accent-700 mb-1">Your Feedback *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formState.description}
                      onChange={handleChange}
                      className={`form-input min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="Please share your detailed feedback about your experience..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-accent-700 mb-2">Would you recommend us to others? *</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          value="yes"
                          checked={formState.wouldRecommend === 'yes'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <ThumbsUp className="h-5 w-5 mr-1 text-green-500" />
                        Yes, definitely!
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          value="maybe"
                          checked={formState.wouldRecommend === 'maybe'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Maybe
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wouldRecommend"
                          value="no"
                          checked={formState.wouldRecommend === 'no'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                    {errors.wouldRecommend && <p className="text-red-500 text-sm mt-1">{errors.wouldRecommend}</p>}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="suggestions" className="block text-accent-700 mb-1">Suggestions for Improvement (Optional)</label>
                    <textarea
                      id="suggestions"
                      name="suggestions"
                      value={formState.suggestions}
                      onChange={handleChange}
                      className="form-input min-h-[100px]"
                      placeholder="How can we improve your experience?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : (
                      <>
                        Submit Feedback
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Feedback Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-primary-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-primary-800 mr-3" />
                <h2 className="text-2xl font-serif font-bold text-primary-800">Why Your Feedback Matters</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">We Listen & Act</h3>
                  <p className="text-accent-700">
                    Every piece of feedback is carefully reviewed by our management team. Your suggestions directly influence our menu updates, service improvements, and overall customer experience.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3">Recent Improvements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-accent-700">
                    <li>Extended breakfast hours based on customer requests</li>
                    <li>Added more vegan options to our menu</li>
                    <li>Improved WiFi speed throughout the cafe</li>
                    <li>Introduced contactless ordering system</li>
                    <li>Enhanced cleaning protocols for better hygiene</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-3">Recognition Program</h3>
                  <p className="text-accent-700">
                    Customers who provide valuable feedback may receive special offers, early access to new menu items, or invitations to exclusive tasting events.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Feedback Stats */}
            <div className="card">
              <h3 className="font-serif text-xl font-bold text-primary-800 mb-4">
                Customer Satisfaction
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">4.8/5</div>
                  <div className="text-sm text-green-700">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">94%</div>
                  <div className="text-sm text-blue-700">Would Recommend</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">1,200+</div>
                  <div className="text-sm text-purple-700">Happy Customers</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">24hrs</div>
                  <div className="text-sm text-orange-700">Response Time</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={closeSuccessModal}
        title={successModal.title}
        message={successModal.message}
      />
    </div>
  );
};

export default Feedback;