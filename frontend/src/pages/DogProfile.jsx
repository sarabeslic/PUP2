import React from 'react';
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../index';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navBar';
import { BsEnvelopeHeart } from "react-icons/bs";
import { GiPawHeart } from "react-icons/gi";



const DogProfile = () => {
  const { id } = useParams(); // Extract userId from URL parameter 
  const [userProfile, setUserProfile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [dogImage, setDogImage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      
      try {
        const response = await fetch(`${API_ENDPOINT}/dogs/${id}`); //fetching the dogs but passing the user id since they need to be visible to all users
        if (!response.ok) {
          throw new Error('http error: status ' + response.status);
        }
        const data = await response.json();
        setUserProfile(data);
        console.log('User Profile Data:', data);
  
        if (data.profile_pic) {
          const imageUrl = `${API_ENDPOINT}/images/${data.profile_pic}`;
          setImageUrl(imageUrl);
        }

        if (data.dog_image) {
          const dogImage = `${API_ENDPOINT}/dogImages/${data.dog_image}`;
          setDogImage(dogImage);
        }

      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchUserProfile();
  }, [id]);
  
  // Check if userProfile is null before rendering
  if (!userProfile) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <Navbar />
      <div className="flex flex-col lg:flex-row gap-4 p-10 rounded-lg sm:mx-20">
        {/* Left column */}

        <div className="flex flex-col items-center flex-1">
          <h2 className="text-xl mb-12 font-light italic">Location: {userProfile.location}</h2>
          <h1 className="text-2xl mb-4">{userProfile.dog_name}</h1>
          <img src={dogImage} alt={'dog image'} className="w-80 h-80 object-cover dogs rounded-[30px] mb-10" />
          <h3 className="text-xl my-4">About Us</h3>
          <p className="ml-0 mb-10">{userProfile.about_us}</p>
        </div>
        {/* Middle column */}
        <div className="flex items-center justify-center text-3xl flex-1 mb-10">
          <GiPawHeart className="text-7xl text-pink-500 drop-shadow-lg" />
        </div>

        {/* Right column */}
        <div className="flex flex-col flex-1 mx-2 sd:mx-12"> 
          <div className="flex mb-8 justify-between">
            {/* Column for owner info */}
            <div className="flex flex-col mr-2 sm:mr-8 ">
              <p className="mb-2">Owner: {userProfile.name} {userProfile.surname}</p>
              <p className="mb-2">Age: {userProfile.age}</p>
              <div className="flex items-center mb-2">
              <BsEnvelopeHeart className="text-2xl mr-4 text-pink-500 drop-shadow-lg" />
              <p>{userProfile.email}</p>
            </div>
            </div>

            {/* Column for profile image */}
            <img src={imageUrl || 'defaultProfile.jpg'} alt={'profile image'} className="w-24 h-24 object-cover rounded-full border-2 border-pink-400" />
          </div>
          <div>
          <div className="mt-4">
              <h3 className="text-xl mb-4">Preferences</h3>
              
                <div className="flex flex-col"> {/* the fields not filled in by the user will not be displayed */}
                  {userProfile.gender && (<p className="preferences">{userProfile.gender}</p>)} 
                  {userProfile.size && (<p className="preferences">{`${userProfile.size} sized dogs`}</p>)}
                  {userProfile.breed && (<p className="preferences">{userProfile.breed}</p>)}
                  {userProfile.walks && (<p className="preferences">{`${userProfile.walks} walks`}</p>)}
                </div>
            </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default DogProfile;