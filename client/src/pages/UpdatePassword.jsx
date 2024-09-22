import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();  // Get token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/v1/auth/reset-password', {
        password,
        confirmPassword,
        token,  // Send the token to the backend
      });

      if (response.data.success) {
        setSuccessMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate('/');  // Redirect to login page after success
        }, 2000);
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
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
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

        {error && (
          <div className="bg-red-200 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-200 text-green-700 p-2 rounded">
            {successMessage}
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="password">
            New Password:
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
