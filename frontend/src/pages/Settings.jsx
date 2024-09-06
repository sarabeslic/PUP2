import React, { useState, useEffect } from "react";
import Navbar from "../components/navBar";
import { API_ENDPOINT } from '../index';
import { useParams } from 'react-router-dom';

const Settings = () => {
  const { id } = useParams(); // Extract userId from URL parameter
  const [file, setFile] = useState(null);
  const [dogFile, setDogFile] = useState(null);
  const [userProfile, setUserProfile] = useState({
    email: '',
    name: '',
    surname: '',
    password: '',
    location: '',
    age: '',
    profile_pic: ''
  });

  console.log('User Profile:', userProfile);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/settings`,
          { credentials: 'include' }
        );
        
        if (!response.ok) {
          throw new Error('http error: status ' + response.status);
        }
        const data = await response.json();
        setUserProfile(data);
        console.log('User Profile Data:', data); // Log the received data
      
      if (data.profile_pic) {
        const file = `${API_ENDPOINT}/images/${data.profile_pic}`;
        setFile(file);
      }

      if (data.dog_image) {
        const dogFile = `${API_ENDPOINT}/dogImages/${data.dog_image}`;
        setDogFile(dogFile);
      }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
  
    for (const key in userProfile) {
    formData.append(key, userProfile[key]);
  }
    
    formData.append('profile_pic', file ?? "" );
    
    try {
      const response = await fetch(`${API_ENDPOINT}/settings`, {
        method: 'PUT',
      body: formData,
      credentials: 'include'
    });


      if (!response.ok) {
        throw new Error('http error: status ' + response.status);
      }
      const updatedData = await response.json();
      setUserProfile(updatedData);
      console.log('Updated User Profile Data:', updatedData);
      alert('Profile updated successfully! :)');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('please fill in all the required fields (except for the profile picture). :)');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/settings`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('http error: status ' + response.status);
      }
      const data = await response.json();
      console.log('Delete response:', data);

      // Redirect after successful deletion
      console.log('Redirecting to /bye');
      window.location.href = '/bye'; //in front end we can use window.location.href to redirect to another page not redirect from react-router-dom!

    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }


  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center md:space-x-5">
        <img
          src={dogFile ?? 'smiledog.jpg'} alt="dog" className="w-[400px] h-full object-cover drop-shadow-lg hidden md:block md:w-1/3 md:h-[700px]"
        />
         <form className="flex flex-col items-center w-full md:w-1/2 px-2 md:px-10" onSubmit={handleSubmit}>
          <img
            src={file ?? 'defaultProfile.jpg'} alt="profile" className="w-36 h-36 object-cover rounded-full mb-4 border-2 border-pink-400"
          />
           <input
            type="email"
            name="email"
            placeholder="Email"
            value={userProfile.email}
            onChange={handleChange}
            className="w-3/5 py-2.5 px-4 mb-7 rounded-full text-gray-700 focus:outline-none placeholder-gray-500 shadow-custom focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={userProfile.name}
            onChange={handleChange}
            className="w-3/5 py-2.5 px-4 mb-7 rounded-full text-gray-700 focus:outline-none placeholder-gray-500 shadow-custom focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={userProfile.surname}
            onChange={handleChange}
            className="w-3/5 py-2.5 px-4 mb-7 rounded-full text-gray-700 focus:outline-none placeholder-gray-500 shadow-custom focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userProfile.password}
            onChange={handleChange}
            className="w-3/5 py-2.5 px-4 mb-7 rounded-full text-gray-700 focus:outline-none placeholder-gray-500 shadow-custom focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={userProfile.location}
            onChange={handleChange}
            className="w-3/5 py-2.5 px-4 mb-7 rounded-full text-gray-700 focus:outline-none placeholder-gray-500 shadow-custom focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={userProfile.age}
            onChange={handleChange}
            className="w-3/5 py-2.5 px-4 mb-7 rounded-full text-gray-700 focus:outline-none placeholder-gray-500 shadow-custom focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="file"
            name="profile_pic"
            onChange={handleFileChange}
            className="w-3/5 py-2.5 px-4 mb-7 rounded-full bg-white text-gray-700 focus:outline-none placeholder-gray-500 shadow-custom focus:ring-2 focus:ring-yellow-500"
          />
          <button
            className="py-2 px-20 text-black rounded-3xl bg-yellow-300 hover:bg-yellow-600 transition duration-300 ease-in-out mb-10"
            type="submit"
          >
            UPDATE
          </button>
        </form>
        <div className="flex justify-center my-4 mr-2 md:mr-10">
          <button onClick={deleteAccount} className="px-4 py-2 w-40 h-14 text-black rounded-3xl bg-red-300 hover:bg-red-600 transition duration-300 ease-in-out">
            DELETE YOUR ACCOUNT
          </button>
        </div>
      </div>
    </>
  );
};

export default Settings;