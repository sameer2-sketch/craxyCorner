import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, ChefHat, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader/Loader';
import Modal from '../components/Layout/Modal';
import Button from '../components/Layout/Button';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelOrderLoading, setIsCancelOrderLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null });
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const user = JSON.parse(localStorage.getItem('cafeUser'));

  function convertSecondsToDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }

  const getOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/orders/getOrders`);
      const data = await res.json();
      const ordersWithStatus = data?.orderList.filter(el => el.customerEmail === user.email).map(order => ({
        ...order,
        status: order.status || 'confirmed',
        estimatedTime: order.estimatedTime || new Date(Date.now() + 20 * 60000).toLocaleTimeString(),
        statusHistory: order.statusHistory || [
          { status: 'confirmed', time: order.time, message: 'Order confirmed' }
        ]
      })).sort((a,b) => b.createdAt._seconds - a.createdAt._seconds)
      setOrders(ordersWithStatus)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case 'preparing':
        return <ChefHat className="h-6 w-6 text-yellow-500" />;
      case 'ready':
        return <Package className="h-6 w-6 text-green-500" />;
      case 'delivered':
        return <Truck className="h-6 w-6 text-green-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 'confirmed':
        return 25;
      case 'preparing':
        return 50;
      case 'ready':
        return 75;
      case 'delivered':
        return 100;
      default:
        return 0;
    }
  };

  const canCancelOrder = (status) => {
    return status === 'confirmed' || status === 'preparing' || status === 'pending';
  };

  const handleCancelOrder = (orderId) => {
    setCancelModal({ isOpen: true, orderId });
    setCancelReason('');
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    setIsCancelling(true);
    try {     
      let payload = { id: cancelModal.orderId, reason: cancelReason };
      setIsCancelOrderLoading(true);
        const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/orders/cancelOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        getOrders();

      setCancelModal({ isOpen: false, orderId: null });
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setIsCancelling(false);
      setIsCancelOrderLoading(false)
    }
  };

  const closeCancelModal = () => {
    setCancelModal({ isOpen: false, orderId: null });
    setCancelReason('');
  };

  const cancelReasons = [
    'Changed my mind',
    'Ordered by mistake',
    'Taking too long',
    'Need to modify order',
    'Emergency came up',
    "Angry",
    'Other'
  ];

  const modalFooter = (
    <div className="flex gap-3">
      <Button variant="outline" onClick={closeCancelModal}>
        Keep Order
      </Button>
      <Button
        variant="danger"
        onClick={confirmCancelOrder}
        disabled={isCancelling || !cancelReason.trim()}
      >
        {isCancelling ? 'Cancelling...' : 'Cancel Order'}
      </Button>
    </div>
  );

  return (
    <div className="pt-16">
      {(isLoading || isCancelOrderLoading) && <Loader showLoader={(isLoading || isCancelOrderLoading)} />}
      <div className="relative h-80 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Track Your Orders</h1>
          <p className="text-xl max-w-xl mx-auto">
            Stay updated on your order status and estimated delivery time
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {!isLoading && orders.length === 0 ? (
          <div className="text-center">
            <Package className="h-16 w-16 text-accent-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4">No Orders Yet</h2>
            <p className="text-accent-600 mb-8">You haven't placed any orders yet. Start browsing our menu!</p>
            <a href="/menu" className="btn btn-primary">
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary-800 mb-2">
                      Order #{order.id}
                    </h3>
                    <p className="text-accent-600">Placed on {convertSecondsToDate(order.createdAt?._seconds)}</p>
                    <p className="text-accent-600">Total: ₹{order.totalAmount}</p>
                    {order.status === 'cancelled' && order.cancellationReason && (
                      <p className="text-red-600 text-sm mt-1">
                        Cancelled: {order.cancellationReason}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 lg:mt-0 text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </div>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <p className="text-sm text-accent-600 mt-2">
                        Estimated ready time: {order.estimatedTime}
                      </p>
                    )}
                    {canCancelOrder(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="mt-2 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {order.status !== 'cancelled' && (<div className="mb-6">
                  <div className="flex justify-between text-sm text-accent-600 mb-2">
                    <span>Order Progress</span>
                    <span>{getProgressPercentage(order.status)}%</span>
                  </div>
                  <div className="w-full bg-accent-200 rounded-full h-2">
                    <div
                      className="bg-secondary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    ></div>
                  </div>
                </div>)}

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-medium text-primary-800 mb-3">Order Items:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-accent-600 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={cancelModal.isOpen}
        onClose={closeCancelModal}
        title="Cancel Order"
        footer={modalFooter}
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium text-red-800">Are you sure you want to cancel this order?</span>
            </div>
            <p className="text-red-700 mt-1 text-sm">
              This action cannot be undone. Please select a reason for cancellation.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for cancellation *
            </label>
            <div className="space-y-2">
              {cancelReasons.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {cancelReason === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please specify
              </label>
              <textarea
                value={cancelReason === 'Other' ? '' : cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Please provide details..."
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default OrderTracking;
