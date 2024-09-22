import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';



const Navbar = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/sign-in');
    };

    
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          Course Master
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          {isAuthenticated ? ( 
            <>
              <Link to="/pdf-order" className="text-white hover:text-gray-300">
                Order PDF
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="text-white hover:text-gray-300">
                Sign In
              </Link>
              <Link to="/sign-up" className="text-white hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;