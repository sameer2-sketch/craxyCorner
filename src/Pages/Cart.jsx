import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, MapPin, Phone, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import useCartStore from '../components/Store/cartStore';
import { v4 as uuidv4 } from 'uuid';
import { TrendingUpRounded } from '@material-ui/icons';
import Loader from '../components/Loader/Loader';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const user = JSON.parse(localStorage.getItem('cafeUser'));

  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState('');
  const [phone, setPhone] = useState('');
  const [tableError, setTableError] = useState('');
  const [phoneError, setPhoneError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [linkId, setLinkId] = useState(null);
  const [paymentPayload, setPaymentPayload] = useState({});
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, type: '', message: '' });

  const params = useParams();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };
  

  const validateTableSelection = () => {
    if (!selectedTable) {
      setTableError('Please select a table number');
      return false;
    } else if (!phone) {
      setPhoneError('Please enter your phone number');
      return false
    }
    setTableError('');
    setPhoneError('');
    return true;
  };

  const createOrder = (data, actions) => {
    if (!validateTableSelection()) {
      return Promise.reject('Please select a table number');
    }

    return actions.order.create({
      purchase_units: [{
        amount: {
          value: (getTotal() * 1.08).toFixed(2), // Total including tax
          breakdown: {
            item_total: {
              value: getTotal().toFixed(2),
              currency_code: "INR"
            },
            tax_total: {
              value: (getTotal() * 0.08).toFixed(2),
              currency_code: "INR"
            }
          }
        },
        items: items.map(item => ({
          name: item.name,
          description: item.description,
          unit_amount: {
            value: item.price,
            currency_code: "INR"
          },
          quantity: item.quantity
        })),
        custom_id: `table_${selectedTable}` // Include table number in order
      }]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      clearCart();
      setSelectedTable('');
      alert(`Transaction completed! Your order has been placed for Table ${selectedTable}. Thank you for your purchase.`);
    });
  };

  const onError = (err) => {
    console.error('PayPal Error:', err);
    setError('Payment failed. Please try again.');
  };

  useEffect(() => {
    const paymenthandled = localStorage.getItem('paymenthandled');
    if(params?.linkId && paymenthandled) {
      createOrderCafe(params?.linkId);
    }
  }, [params?.linkId])

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-16">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-primary-800 mb-4">Your Cart is Empty</h1>
            <p className="text-accent-600 mb-8">Browse our menu to add some delicious items to your cart!</p>
            <Link to="/menu" className="btn btn-primary inline-flex items-center">
              View Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createFinalOrder = async(linkId) => {
    const userPhone = localStorage.getItem('userPhone');
    const tableNumber = localStorage.getItem('tableNumber');
    setIsLoading(true);
     try {
        const res = await fetch('https://backend-i2v9.onrender.com/api/v1/orders/addOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          tableNumber: tableNumber,
          customerPhoneNumber: userPhone,
          customerEmail: user.email,
          customerName: user.name,
          status: 'pending',
          'id': linkId,
          totalAmount: +(getTotal() * 1.08).toFixed(2),
          from: 'cafe'
        }),
      });
      if(res.ok) {
        clearCart();
        localStorage.removeItem('userPhone')
        localStorage.removeItem('tableNumber')
        localStorage.removeItem('paymenthandled')
        navigate('/orders');
      }
     } catch (err) {

     } finally {
      setIsLoading(false);
     }
  }
 
  const createOrderCafe = async(linkId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/orders/check-payment/${linkId}`);
      const data = await res.json();
      if (res.ok) {
        if(data?.paymentStatus === 'PAID') {
          setPaymentModal({
            isOpen: true,
            type: 'success',
            message: 'Payment successful! Redirecting...',
            paymentUrl: data?.data?.link_url
          });
          createFinalOrder(linkId);
        } else {
          setPaymentModal({
            isOpen: true,
            type: 'failure',
            message: 'Payment failed. Please try again.'
          });
        }
      }
    } catch (err) {
      setPaymentModal({
        isOpen: true,
        type: 'failure',
        message: 'Payment failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, type: '', message: '' });
  };

  const retryPayment = () => {
    closePaymentModal();
    handlePayment();
  };

  const handlePayment = async() => {
    setIsLoading(true);
    try {
      let id = uuidv4();
      const paymentPayload = {
        customerPhoneNumber: phone,
        customerEmail: user.email,
        customerName: user.name,
        totalAmount: +(getTotal() * 1.08).toFixed(2),
        from: 'cafe',
        id: id
      }
      setPaymentPayload(paymentPayload);
      const res = await fetch('https://backend-i2v9.onrender.com/api/v1/orders/handle-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });
      const data = await res.json();
      setLinkId(data?.data?.link_id);
      localStorage.setItem('paymenthandled', true);
      localStorage.setItem('userPhone', phone);
      localStorage.setItem('tableNumber', selectedTable);
      window.location.href = data?.data?.link_url;
    } catch(error) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-32 pb-16">
      {isLoading && <Loader showLoader={(isLoading)} />}
      <div className="container-custom">
        <h1 className="text-3xl font-serif font-bold text-primary-800 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-lg shadow-soft p-4 flex items-center"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-primary-800">{item.name}</h3>
                    <p className="text-accent-600 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-primary-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-primary-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-secondary-500">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="font-serif text-xl font-bold text-primary-800 mb-4">Order Summary</h2>

              {/* Table Selection */}
              <div className="mb-6">
                <label className="block text-accent-700 mb-2 font-medium">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Select Table Number *
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => {
                    setSelectedTable(e.target.value);
                    setTableError('');
                  }}
                  className={`form-input bg-red-200 w-full ${tableError ? 'border-red-500' : ''}`}
                >
                  <option value="">Choose your table</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Table {i + 1}
                    </option>
                  ))}
                </select>
                {tableError && (
                  <p className="text-red-500 text-sm mt-1">{tableError}</p>
                )}
                <p className="text-xs text-accent-500 mt-1">
                  Please select an available table for dine-in service
                </p>
              </div>
              <div className="mb-4">
                <Phone className="inline h-4 w-4 mr-2" />
                <label htmlFor="email" className="text-accent-700 font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="phone"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full bg-red-200 px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 ${phoneError
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-accent-200 focus:border-primary-500'
                    }`}
                  placeholder="Enter your Phone Number"
                />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-accent-600">
                  <span>Subtotal</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-accent-600">
                  <span>Tax (8%)</span>
                  <span>₹{(getTotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-accent-200 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-secondary-500">
                    ₹{(getTotal() * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedTable && (
                <div className="bg-primary-50 p-3 rounded-md mb-4">
                  <p className="text-sm text-primary-800">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Selected: <span className="font-medium">Table {selectedTable}</span>
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}

             <button disabled={!phone || !selectedTable} className="btn btn-outline w-full mt-4" onClick={handlePayment}>Pay</button>

              <Link
                to="/menu"
                className="btn btn-outline w-full mt-4"
              >
                Continue Shopping
              </Link>

              <p className="text-sm text-accent-600 mt-4 text-center">
                Secure checkout powered by CashFree
              </p>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {paymentModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
            >
              {/* Close button */}
              <button
                onClick={closePaymentModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>

              {paymentModal.type === 'success' ? (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {paymentModal.message}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Redirecting...</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {paymentModal.message}
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={closePaymentModal}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={retryPayment}
                      className="flex-1 bg-primary-800 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;