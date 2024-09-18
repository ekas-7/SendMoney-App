import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin } from '../service/api';
import Cookies from 'js-cookie'; // Import js-cookie

interface SigninFormData {
  username: string;
  password: string;
}

const Signin: React.FC = () => {
  const [formData, setFormData] = useState<SigninFormData>({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Assuming the signin function returns the token in its response
      const response = await signin(formData);
      
      // Assuming the token is in response.data.token
      const token = response.token;

      // Store the token in cookies with 1-hour expiration
      Cookies.set('authToken', token, { expires: 1 / 24 }); // 1 hour expiration
      
      console.log('Token set in cookies for 1 hour:', token);
      navigate("/dashboard");
    } catch (error) {
      console.error('Signin failed:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-gray-800 transition duration-300"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don’t have an account?{' '}
            <Link to="/" className="text-black hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
