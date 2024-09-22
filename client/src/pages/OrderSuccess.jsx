import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderSuccess = () => {
  const [status, setStatus] = useState('Processing');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const session_id = queryParams.get('session_id');

    console.log('Session ID from URL:', session_id);

    if (session_id) {
      console.log('Sending request to backend');
      axios.post('/api/v1/checkout/payment-success', { session_id }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log('Backend response:', response.data);
          setStatus('Success');
        })
        .catch(error => {
          console.error('Error from backend:', error.response ? error.response.data : error.message);
          setStatus('Error');
        });
    } else {
      console.log('No session ID found in URL');
      setStatus('Error');
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Order Status</h2>
        
        {status === 'Processing' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600">Processing your order...</p>
          </div>
        )}
        
        {status === 'Success' && (
          <div className="text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-lg text-gray-700 mb-4">Order successful! Check your email for the invoice.</p>
          </div>
        )}
        
        {status === 'Error' && (
          <div className="text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <p className="text-lg text-gray-700 mb-4">There was an error processing your order. Please contact support.</p>
          </div>
        )}
        
        {status !== 'Processing' && (
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Return to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;