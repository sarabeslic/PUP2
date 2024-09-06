import React, { useState } from 'react';
import Navbar from '../components/navBar';
import { GiPawHeart } from "react-icons/gi";
import { API_ENDPOINT } from '../index';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


const DogMatchesComponent = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}/matches`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('HTTP error: status ' + response.status);
                }

                const data = await response.json();
                console.log('Matches:', data);
                setMatches(data); // Correctly set the state with the fetched data

            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        fetchMatches();
    }, []);

    return (
        <>
            <Navbar />
            <div className=" mx-10 sm:mx-40 flex flex-col justify-center">
                <h1 className="text-2xl text-center mb-2 mt-8">Your Matches: {matches.length}</h1>
                <p className="text-center text-gray-500 italic text-sm mb-8">Matches based on mandatory gender and size preference</p>
                {matches.length === 0 && <p className="text-center text-xl mt-4">No matches found</p>}
                
                <div className="flex flex-row flex-wrap justify-evenly">
                    {matches.map((match, index) => (
                        <div key={index} className="flex flex-row items-center">
                             
                            <div className="flex flex-col items-center justify-center mb-4">
                                <h2 className="text-xl mb-4 text-center">{match.dog_name}</h2>
                                <Link to={{ pathname: `/dogs/${match.user_id}`, state: { dog: match } }}>
                                <img
                                    className="w-64 h-64 border rounded-[30px] object-cover mb-2 transform transition-transform duration-300 hover:scale-110"
                                    src={`${API_ENDPOINT}/dogImages/${match.dog_image}`}
                                    alt="Matched Dog"
                                />
                                </Link>
                            </div>
                            <GiPawHeart className="text-7xl mx-5 sm:mx-10 my-5 text-pink-500 drop-shadow-lg" /> 
                        </div>
                    ))}
                    
                </div>
            </div>
        </>
    );
};

export default DogMatchesComponent;
//