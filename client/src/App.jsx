import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import OrderPdf from "../src/components/OrderPdf";
import UpdatePassword from './pages/UpdatePassword';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/core/ProtectedRoute'; 
import Navbar from "./components/Navbar"
import { AuthProvider } from './context/AuthContext'; 
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <AuthProvider> {/* Change this line */}
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/:token" element={<UpdatePassword />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} /> {/* Wrap Home in ProtectedRoute */}
          <Route path="/pdf-order" element={<ProtectedRoute><OrderPdf/></ProtectedRoute>} />
          <Route path="/order-success" element={<OrderSuccess/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;