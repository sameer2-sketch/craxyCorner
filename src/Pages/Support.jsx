import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageSquare, Send, CheckCircle, HelpCircle, Clock, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import Loader from '../components/Loader/Loader';
import ErrorModal from '../components/Layout/ErrorModal';
import SuccessModal from '../components/Layout/SuccessModal';

const initialFormState = {
  name: '',
  email: '',
  tableNumber: '',
  problemType: '',
  description: '',
  priority: 'medium'
};

const Support = () => {
  const user = JSON.parse(localStorage.getItem('cafeUser'));

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

  const problemTypes = [
    { value: 'order', label: 'Order Issue' },
    { value: 'food', label: 'Food Quality' },
    { value: 'service', label: 'Service Problem' },
    { value: 'billing', label: 'Billing/Payment' },
    { value: 'cleanliness', label: 'Cleanliness Issue' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'other', label: 'Other' }
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
    if (!formState.tableNumber) newErrors.tableNumber = 'Table number is required';
    if (!formState.problemType) newErrors.problemType = 'Problem type is required';
    if (!formState.description.trim()) newErrors.description = 'Problem description is required';

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
      addSupportTicket()
      setFormState(initialFormState);
    }
  };

  const getEstimatedResolution = (priority) => {
    switch (priority) {
      case 'high': return 'Within 5-10 minutes';
      case 'medium': return 'Within 15-30 minutes';
      case 'low': return 'Within 30-60 minutes';
      default: return 'Within 30 minutes';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const addSupportTicket = async () => {
    let payload = {
      id: uuidv4(),
      customerName: formState.name,
      customerEmail: formState.email,
      tableNumber: formState.tableNumber,
      problemType: formState.problemType,
      problemDesc: formState.description,
      priority: formState.priority,
      status: 'open',
      estimatedResolution: getEstimatedResolution(formState.priority)
    };
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/support/addSupport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setErrorModal({
          isOpen: true,
          title: 'Create Support Failed',
          message: 'Failed to create support. Please try again.',
          details: 'Unknown error occurred'
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Support Added',
          message: `Support has been successfully created.`
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Create Support Failed',
        message: 'Failed to add support. Please try again.',
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
          backgroundImage: "url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Customer Support</h1>
          <p className="text-xl max-w-xl mx-auto">
            Need help? We're here to assist you with any questions or concerns
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Support Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isSubmitted ? (
              <div className="card h-full flex flex-col items-center justify-center text-center p-10">
                <CheckCircle className="text-secondary-500 h-20 w-20 mb-6" />
                <h2 className="text-3xl font-serif font-bold text-primary-800 mb-4">Support Request Submitted!</h2>
                <p className="text-lg text-accent-600 mb-4">
                  Thank you for reaching out. We've received your support request and our team will assist you shortly.
                </p>
                <p className="text-sm text-accent-500 mb-8">
                  Expected response time: 5-10 minutes for urgent issues, 15-30 minutes for general inquiries.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="btn btn-primary"
                  >
                    Submit Another Request
                  </button>
                  <div>
                    <a href="/support-tickets" className="btn btn-outline">
                      View My Support Tickets
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-8 w-8 text-primary-800 mr-3" />
                  <h2 className="text-2xl font-serif font-bold text-primary-800">Report an Issue</h2>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="tableNumber" className="block text-accent-700 mb-1">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Table Number *
                      </label>
                      <select
                        id="tableNumber"
                        name="tableNumber"
                        value={formState.tableNumber}
                        onChange={handleChange}
                        className={`form-input ${errors.tableNumber ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select your table</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Table {i + 1}
                          </option>
                        ))}
                      </select>
                      {errors.tableNumber && <p className="text-red-500 text-sm mt-1">{errors.tableNumber}</p>}
                    </div>
                    <div>
                      <label htmlFor="problemType" className="block text-accent-700 mb-1">Problem Type *</label>
                      <select
                        id="problemType"
                        name="problemType"
                        value={formState.problemType}
                        onChange={handleChange}
                        className={`form-input ${errors.problemType ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select problem type</option>
                        {problemTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.problemType && <p className="text-red-500 text-sm mt-1">{errors.problemType}</p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="priority" className="block text-accent-700 mb-1">Priority Level</label>
                    <select
                      id="priority"
                      name="priority"
                      value={formState.priority}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="medium">Medium - Standard issue</option>
                      <option value="high">High - Urgent assistance needed</option>
                    </select>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${getPriorityColor(formState.priority)}`}>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formState.priority.charAt(0).toUpperCase() + formState.priority.slice(1)} Priority
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="description" className="block text-accent-700 mb-1">Problem Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formState.description}
                      onChange={handleChange}
                      className={`form-input min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                      placeholder="Please describe the issue you're experiencing in detail..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    <p className="text-xs text-accent-500 mt-1">
                      The more details you provide, the better we can assist you.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : (
                      <>
                        Submit Support Request
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>

          {/* Support Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-primary-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <HelpCircle className="h-8 w-8 text-primary-800 mr-3" />
                <h2 className="text-2xl font-serif font-bold text-primary-800">How We Can Help</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Response Times</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm"><strong>High Priority:</strong> 5-10 minutes</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-sm"><strong>Medium Priority:</strong> 15-30 minutes</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm"><strong>Low Priority:</strong> 30-60 minutes</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Common Issues We Handle</h3>
                  <ul className="list-disc pl-5 space-y-2 text-accent-700">
                    <li>Order delays or incorrect items</li>
                    <li>Food quality concerns</li>
                    <li>Service-related issues</li>
                    <li>Payment and billing problems</li>
                    <li>Cleanliness or hygiene concerns</li>
                    <li>Technical issues with ordering system</li>
                    <li>Special dietary requirements</li>
                    <li>Accessibility assistance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Immediate Assistance</h3>
                  <p className="text-accent-700 mb-4">
                    For urgent matters that require immediate attention, please approach our staff directly or call:
                  </p>
                  <div className="bg-white p-4 rounded-md">
                    <p className="font-medium text-primary-800">Emergency Line: (123) 456-7890</p>
                    <p className="text-sm text-accent-600">Available during operating hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="card">
              <h3 className="font-serif text-xl font-bold text-primary-800 mb-4">
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary-800 mb-1">How long does it take to resolve issues?</h4>
                  <p className="text-accent-600 text-sm">Most issues are resolved within 15-30 minutes. Complex matters may take longer, but we'll keep you updated.</p>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800 mb-1">Can I change my order after placing it?</h4>
                  <p className="text-accent-600 text-sm">Yes, if your order hasn't started preparation. Submit a support request with your table number and we'll assist you.</p>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800 mb-1">What if I have dietary restrictions?</h4>
                  <p className="text-accent-600 text-sm">Our staff can help modify menu items to accommodate most dietary needs. Please inform us of any allergies or restrictions.</p>
                </div>
                <div>
                  <h4 className="font-medium text-primary-800 mb-1">Is there WiFi available?</h4>
                  <p className="text-accent-600 text-sm">Yes! Network: "MoodSyncCafe_Guest" | Password: "mood2025"</p>
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

export default Support;