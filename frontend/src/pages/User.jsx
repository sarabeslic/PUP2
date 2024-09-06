import React, { useState } from 'react';
import Navbar from '../components/navBar';
import { useParams } from 'react-router-dom'; // useParams is a hook that allows you to access the URL parameters
import { API_ENDPOINT } from '../index';
import { useEffect } from 'react';
import { GiPawHeart } from 'react-icons/gi';



const breeds = [
  'Labrador Retriever','German Shepherd','Golden Retriever','Bulldog','Beagle','Poodle','Rottweiler','Yorkshire Terrier',
  'Boxer','Dachshund','Siberian Husky','Chihuahua','Great Dane','Shih Tzu','Doberman Pinscher','Australian Shepherd','Corgi',
  'Border Collie','Pomeranian','Shiba Inu'
];

const UserPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null); // specifically used to handle the selected image file whiile dog-image is used to store the image url
  const [dogData, setDogData] = useState({
    name: '',
    surname: '',
    age: '',
    dog_name: '',
    location: '',
    gender: '',
    size: '',
    breed: '',
    walks: '',
    about_us: '',
    dog_image: ''  //this is the image that will be uploaded to the server, you need this here!!, dont erase it

  });

  const [isEditing, setIsEditing] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);

  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/user`, {  //getting by uer_id so no need to add id here
        credentials: 'include', // Include credentials in the request
        });
        if (!response.ok) {
          console.log(response)
          throw new Error('Failed to fetch dog data. Please try again later.');
        }
        const data = await response.json();
        setDogData(data);
        setIsEditing(false);

      if (data.dog_image) {
        const imageUrl = `${API_ENDPOINT}/dogImages/${data.dog_image}`;
        setFile(imageUrl);
      }
      if (data.dog_name) { // If dog_name exists, it means that the data already exists!! this will control the way the button will check for existing data!!! very important!!
          setIsExistingData(true);  //dont mess this up, dont touch, so important!!!!
        }
      } catch (error) {
        console.error('Error fetching dog data:', error);
      }
    };

    if (id) { // If id exists, fetch the dog data
} fetchDogData();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setDogData({ ...dogData, [name]: value });
  };


  const handleSave = async () => {
    
    try {
      const method = isExistingData ? 'PUT' : 'POST';
      const url =`${API_ENDPOINT}/user` 

      const formData = new FormData();

      // Append form data
      formData.append('name', dogData.name);
      formData.append('surname', dogData.surname);
      formData.append('age', dogData.age);
      formData.append('dog_name', dogData.dog_name);
      formData.append('location', dogData.location);
      formData.append('gender', dogData.gender);
      formData.append('size', dogData.size);
      formData.append('breed', dogData.breed || ''); // If breed is empty, append an empty string
      formData.append('walks', dogData.walks || ''); // If walks is empty, append an empty string
      formData.append('about_us', dogData.about_us);
      if (file) {
        console.log('File exists:', file);
        console.log('File type:', typeof file);
  
        //we need this to check if the file is an object, if it is, we append it to the form data, if not, we append the existing dog_image!!! so that it does not get erased
        if (file && typeof file === 'object') { // Check if the file is an object
          console.log('Appending file to FormData:', file);
          formData.append('dog_image', file); // Append the file if it exists, to the FormData
        } else if (dogData.dog_image) { // If the file is not an object, append the existing dog_image
          formData.append('dog_image', dogData.dog_image);
        }
      }
      const response = await fetch(url, {
        method: method,
        body: formData,
        credentials: 'include', // Include credentials in the request
      });

      if (!response.ok) {
        throw new Error('Failed to save dog data. Please try again later.');
      }

      const savedDogData = await response.json();
      setDogData(savedDogData.data);
      setIsEditing(false);
      console.log(savedDogData);

      if (!isExistingData) { // If the data is new, set isExistingData to true so that the button will change to UPDATE
        setIsExistingData(true);
      }
    } catch (error) {
      console.error('Error saving dog data:', error);
      alert('Please fill all required fields: dog name, dog image, about us, size and gender preference to save your data successfully!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };


  const handleImageChange = (e) => {  // Set the file state to the selected file
    const file = e.target.files[0];
    console.log('Selected file:', file);
    setFile(file);
  };


    return (
      <>
        <Navbar />
        <div className="flex flex-col lg:flex-row gap-4 p-10 rounded-lg sm:mx-20">
          <div className="flex flex-col items-center flex-1">
            <h2 className="text-xl mb-12">Location: {dogData.location}</h2>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="dog_name"
                  value={dogData.dog_name}
                  onChange={handleChange}
                  placeholder="Enter dog name"
                  className="preferences p-2 mb-4 border rounded italic placeholder-gray-500"
                />
                <input
                  type="file"
                  name="dog_image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-4"
                />
              </>
          ) : (
            <>
              <h1 className="text-2xl mb-4">{dogData.dog_name}</h1>
              <img
                src={dogData.dog_image ? `${API_ENDPOINT}/dogImages/${dogData.dog_image}` : 'defaultProfile.jpg'}
                alt="Dog"
                className="w-80 h-80 object-cover dogs rounded-[30px] mb-10"
              />
            </>
          )}
          <h3 className="text-lg mb-2">About Us</h3>
          {isEditing ? (
            <textarea
              name="about_us"
              value={dogData.about_us}
              onChange={handleChange}
              placeholder="Enter about you and your dog. Add a picture of your dog and fill your preferences. Hope to find a good match for you and your dog! Happy matching!"
              className="mb-4 p-2 w-full border rounded h-56 italic placeholder-gray-500 preferencesUser"
            />
          ) : (
            <p>{dogData.about_us}</p>
          )}
          <div className="flex gap-6 sm:gap-16 mt-4 flex-col sm:flex-row ">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                className="py-2 px-16 text-black rounded-3xl hover:bg-green-600"
                style={{ backgroundColor: '#DFE54F' }}
              >
                {isExistingData ? 'UPDATE' : 'SAVE'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="py-2 px-16 mt-2 text-black rounded-3xl hover:bg-violet-600 transition duration-300 bg-violet-400"
              >
                EDIT
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center text-3xl flex-1">
          <span>{dogData.likes}</span> <GiPawHeart className="text-7xl text-pink-500 drop-shadow-lg" />
        </div>
        <div className="flex flex-col flex-1  mt-4 sm:mt-0">
          <div className="user-profile">
            <p>Owner: {dogData.name + " "}{dogData.surname}</p>
            <p>Age: {dogData.age}</p>
          </div>
          <div className="mt-10">
            <h3 className="text-xl mb-12">Preferences</h3>
            {isEditing ? (
              <form className="flex flex-col">
                <label className="mb-2">
                  M/F:
                  <input
                    type="text"
                    name="gender"
                    value={dogData.gender}
                    onChange={handleChange}
                    placeholder="Enter 'F' or 'M'"
                    className="preferencesUser p-2 border rounded italic placeholder-gray-500"
                  />
                </label>
                <label className="mb-2">
                  Size:
                  <input
                    type="text"
                    name="size"
                    value={dogData.size}
                    onChange={handleChange}
                    placeholder="Enter 'small', 'medium' or 'large'"
                    className="preferencesUser p-2 border rounded italic placeholder-gray-500"
                  />
                </label>
                <label className="mb-2">
                  Species:
                  <input
                    type="text"
                    name="breed"
                    value={dogData.breed}
                    onChange={handleChange}
                    placeholder="Enter preferred dog companion"
                    list="breeds"
                    className="preferencesUser p-2 border rounded italic placeholder-gray-500"
                  />
                  <datalist id="breeds">
                    {breeds.map((breed, index) => (
                      <option key={index} value={breed} />
                    ))}
                  </datalist>
                </label>
                <label className="mb-2">
                  Type of Walks:
                  <input
                    type="text"
                    name="walks"
                    value={dogData.walks}
                    onChange={handleChange}
                    placeholder="Enter 'short', 'medium' or 'long'"
                    className="preferencesUser p-2 border rounded italic placeholder-gray-500"
                  />
                </label>
              </form>
            ) : (
              <div>
                <p className="preferences">{dogData.gender}</p>
                <p className="preferences">{dogData.size +' sized dogs'}</p> 
                <p className="preferences">{dogData.breed? `${dogData.breed}` : " "}</p>
                <p className="preferences">{dogData.walks? `${dogData.walks} walks`: " " }</p> 
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
