import React from 'react';
import { courses } from '../../CourseData';
import axios from 'axios';
import {loadStripe} from '@stripe/stripe-js';

const HomePage = () => {

  const handleBuyNow = async (course) => {
    console.log(course);

    const stripe = await loadStripe("pk_test_51Q1QsRRxWWqxrtmqWwUlFaDyyVBr2uRupHFmKcDAD8cagZnGpgHXLdrPwqpZ2rAzQCsWnHDMnfg7gfkVIjHu43BV00DvA3gSfs");
    try {
      // Create a checkout session on your backend
      const response = await axios.post('/api/v1/checkout/create-checkout-session', {
        courseId: course.id,
        courseTitle: course.title,
        coursePrice: course.price
      }, {
        withCredentials: true,
      });

      const session = response.data;

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* ... (header section remains the same) ... */}

      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Courses</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-6 shadow-lg rounded-lg hover:shadow-2xl transition">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover rounded-t-lg"/>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600 mt-2">{course.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">${course.price}</span>
                  <button 
                    onClick={() => handleBuyNow(course)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Footer Section */}
      <footer className="bg-blue-600 py-4 text-white text-center">
        <p>&copy; 2024 CourseMaster. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
