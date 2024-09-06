import React from "react";
import StartBar from "../components/startBar";
import { useState } from 'react';
import { API_ENDPOINT } from '../index';
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation



const Register = () => {  
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [imageFile, setImageFile] = useState(null); // Initialize imageFile state for file upload

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    location: '',
    age: '',
    profile_pic: ''

  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  console.log(formData);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file selected by the user
    setImageFile(file);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.email || !formData.name || !formData.surname || !formData.password || !formData.location || !formData.age) {
      alert('Please fill requried fields: email, name, surname, password, location, age');
      return; // Stop the form submission
    }
    try {
      const formDataWithImage = new FormData();
      formDataWithImage.append('email', formData.email);
      formDataWithImage.append('name', formData.name);
      formDataWithImage.append('surname', formData.surname);
      formDataWithImage.append('password', formData.password);
      formDataWithImage.append('location', formData.location);
      formDataWithImage.append('age', formData.age);

      if (imageFile) { // Check if an image file is selected by the user if no image file is selected, the image will not be uploaded
        formDataWithImage.append('profileImage', imageFile ?? ''); //if imageFile is null, use an empty string
      }

      console.log('Form data with image:', formDataWithImage);
      const response = await fetch(`${API_ENDPOINT}/register`, {
        method: 'POST',
        body: formDataWithImage,
      });

      console.log('Response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User registered:', data);
      navigate('/login');
      
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user. Please try again. :)');
    }
  };


  return (
    <div className="bg-cover "  style={{ backgroundImage: "url('/running_dogs2.jpg')" }}>
      <StartBar className="relative z-10" />
      <section className="flex items-center justify-end h-screen relative px-5 sm:mx-14">
        <div className="p-10 max-w-[500px] w-full border border-none rounded-3xl bg-white bg-opacity-30 ">
          
          <form onSubmit={handleSubmit} encType="multipart/form-data"> 
          <div className="form-group mb-5">
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="pl-8"
                type="email" placeholder="Email" id="email" name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text" placeholder="Name"id="name" name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text" placeholder="Surname" id="surname" name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password" placeholder="Password" id="password" name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text" placeholder="Location" id="location" name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text" placeholder="Age" id="age" pattern="[0-9]*" inputMode="numeric" name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input type="submit" onClick={handleSubmit} value="Register" />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;