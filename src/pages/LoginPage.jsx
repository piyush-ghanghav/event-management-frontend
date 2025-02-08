import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const LoginPage = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();


        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, {email, password});
            localStorage.setItem('token', res.data.token);
            console.log('Login successful');
            navigate('/dashboard'); // redirect to dashboard
        } catch (error) {
            console.log(error);
            setError(error.response.data.error || 'Login failed. Please try again.');
        }
    };

    const backgroundImageUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";

    return(
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      {/* Main container */}
      <div className="w-full min-h-screen flex flex-col md:flex-row">
        {/* Left side - Hero section */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative">
          <img
            src={backgroundImageUrl}
            alt="Event background showing a concert venue with dramatic lighting"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 flex items-center justify-center">
            <div className="text-white text-center p-8 backdrop-blur-lg">
              <h1 className="text-5xl font-bold mb-4">Welcome Back</h1>
              <p className="text-2xl font-light">Your Next Event Awaits</p>
            </div>
          </div>
        </div>
        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white bg-opacity-10 backdrop-blur-lg">
          <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Log In</h2>
              <p className="text-gray-600">Access your EventMaster account</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div> */}

                <div className="text-sm">
                  <a href="/guest" className="font-medium text-purple-600 hover:text-purple-500">
                    Guest Login
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-105"
              >
                Log In
              </button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <a href="/register" className="text-purple-600 hover:text-purple-500 font-medium">
                Register now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}   

export default LoginPage;