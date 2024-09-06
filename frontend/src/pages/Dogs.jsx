import React from "react";
import { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../index';
import { Link } from 'react-router-dom';
import Navbar from "../components/navBar";



const Dogs = () => {
  const [dogs, setDogs] = useState(null);

  useEffect(() => {
    const fetchAllDogs = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/dogs`);
        const data = await response.json();
        setDogs(data);
        console.log('Dogs Data:', data); // Log the received data
      } catch (error) {
        console.error('Error fetching dogs data:', error);
      }
    };

    fetchAllDogs();
  }, []); // Empty dependency array to run only once when the component mounts

  // Check if dogs is null before rendering
  if (!dogs) {
    return <div>Loading...</div>; // Render a loading message or spinner while waiting for data
  }



  //we need to call the dog image api inside the map function to get the image of the dog cause each dog has its own image!! we cant render the same image for all dogs
  return (
    <>
      <Navbar /> 
      <div className="flex flex-wrap justify-evenly m-16 gap-10">
        {dogs.map(dog => {
          const dogImage = dog.dog_image ? `${API_ENDPOINT}/dogImages/${dog.dog_image}` : 'running_dogs.jpg';
          return (
            <Link key={dog.user_id} to={{ pathname: `/dogs/${dog.user_id}`, state: { dog } }}>
              <div className="text-center">
                <h2 className="text-md mb-5">{dog.dog_name}</h2>
                <div className="dogs w-64 h-64 rounded-3xl">
                  <img
                    src={dogImage}
                    alt={dog.dog_name}
                    className="w-full h-full object-cover rounded-3xl transform transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Dogs;