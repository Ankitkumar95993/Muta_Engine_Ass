import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import {Link} from "react-router-dom";
import OAuth from "../components/OAuth";
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaValue) {
      setError("Please complete the reCAPTCHA");
      return;
    }

    setIsLoading(true);
    try {
      // Send login request to the server
      const response = await axios.post(
        '/api/v1/auth/login',
        {
          email,
          password,
          captchaValue
        },
        {
          withCredentials: true,
        }
      );
  
      // If login is successful, redirect to dashboard or homepage
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        navigate('/'); 
      }
    } catch (err) {
      // If an error occurs, show error message
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>

        {error && (
          <div className="bg-red-200 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !captchaValue}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <OAuth/>


         {/* Forgot Password Link */}
         <div className="text-center mt-4">
          <Link to="/reset-password-token" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        
      </form>
    </div>
  );
};

export default SignIn;