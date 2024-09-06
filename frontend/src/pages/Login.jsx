import React from 'react';
import { useState } from 'react';
import { API_ENDPOINT } from '../index';
import LoginBar from '../components/loginBar';
import {useNavigate} from 'react-router-dom';



const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Function to handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  console.log(formData);
  
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_ENDPOINT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials in the request
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login successful:', data);
      navigate('/dogs');

    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-fit sm:bg-cover" style={{backgroundImage:"url('/paws.png')"}}>

      <LoginBar className="relative z-10" />
      <section className="flex items-center justify-center flex-grow relative">
        <div className='backdrop-filter backdrop-blur-sm p-16 rounded-xl shadow-xl max-w-md mb-10'>
          <img className='w-60 mx-auto mb-6' src="dog_login.gif" alt="running dogs" />
          <h2 className="text-3xl text-center mb-4 text-black">Welcome back!</h2>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="text-center">
            <div className="mb-5">
              <input
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-80 p-2 border  pl-6 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 "
              />
            </div>
            <div className="mb-5">
              <input
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-80 p-2 pl-6 border rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
              />
            </div>
            <div className="text-center">
              <input
                type="submit"
                value="LOGIN"
                className="w-1/2 py-2 bg-yellow-300 text-black rounded-full cursor-pointer hover:bg-yellow-400 transition duration-300"
              />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;