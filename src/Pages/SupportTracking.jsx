import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
import Loader from '../components/Loader/Loader';

const SupportTracking = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('cafeUser'));

  const getSupports = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://backend-i2v9.onrender.com/api/v1/support/getSupport`);
      const data = await res.json();
      const userTracking = data?.supportList.filter(el => el.customerEmail === user.email).sort((a,b) => b.createdAt._seconds - a.createdAt._seconds)
      setSupportTickets(userTracking)
      } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getSupports();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  function convertSecondsToDate(seconds) {
    const milliseconds = seconds * 1000;
    const date = new Date(milliseconds);
    return date.toDateString();
  }

  return (
    <div className="pt-16">
      {isLoading && <Loader showLoader={(isLoading)} />}
      <div className="relative h-80 bg-cover bg-center flex items-center justify-center" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')"
        }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Support Tickets</h1>
          <p className="text-xl max-w-xl mx-auto">
            Track the status of your support requests and get updates
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {!isLoading && supportTickets.length === 0 ? (
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-accent-400 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-primary-800 mb-4">No Support Tickets</h2>
            <p className="text-accent-600 mb-8">You haven't submitted any support requests yet.</p>
            <a href="/support" className="btn btn-primary">
              Get Support
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {supportTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-serif font-bold text-primary-800 mr-3">
                        Ticket #{ticket.id}
                      </h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">{ticket.status}</span>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-primary-700 mb-2">{ticket.problemType}</p>
                    <div className="flex items-center text-sm text-accent-600 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {convertSecondsToDate(ticket.createdAt._seconds)}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Table {ticket.tableNumber}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-primary-800 mb-2">Issue Description:</h4>
                  <p className="text-accent-700">{ticket.problemDesc}</p>
                </div>

                {ticket.responses && ticket.responses.length > 0 && (
                  <div>
                    <h4 className="font-medium text-primary-800 mb-3">Support Responses:</h4>
                    <div className="space-y-3">
                      {ticket.responses.map((response, idx) => (
                        <div key={idx} className="bg-white border border-accent-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-primary-800">{response.from}</span>
                            <span className="text-sm text-accent-600">{response.time}</span>
                          </div>
                          <p className="text-accent-700">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ticket.status === 'resolved' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium text-green-800">Issue Resolved</span>
                    </div>
                    <p className="text-green-700 mt-1">
                      Your support request has been successfully resolved. If you need further assistance, please submit a new ticket.
                    </p>
                  </div>
                )}

                {ticket.estimatedResolution && ticket.status !== 'resolved' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium text-blue-800">Estimated Resolution</span>
                    </div>
                    <p className="text-blue-700 mt-1">{ticket.estimatedResolution}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTracking;