import React from "react";
import StartBar from "../components/startBar";
import { Link } from "react-router-dom";


const HomePage = () => {
  return (
    <>
      <div className="font-sans">
        <section className="relative text-center text-white">
          <img src="cute.jpg" alt="home" className="h-[500px] object-cover md:w-full md:object-cover " />
          <div className="absolute top-0 left-0 w-full z-10 bg-black bg-opacity-30">
            <StartBar />
          </div>

          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-left w-full px-5 md:px-28">
            <h1 className="text-4xl md:text-5xl font-bold">Double your happiness</h1>
            <p className=" mt-1 md:mt-6 text-3xl">2 pups = 2 owners</p>
            <Link to="/register">
            <button className="mt-12 mb-12 px-10 py-4 bg-orange-400 text-white rounded-full">JOIN NOW</button>
            </Link>
          </div>
        </section>
        
        <section className="py-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold mb-6">Our mission</h2>
          <p className="mx-6 max-w-2xl text-lg">
          Connecting pet lovers to foster joyful relationships through shared moments with furry friends.
          We strive to create a community where owners can easily connect, share experiences, and build 
          lasting bonds with their pets and fellow pet enthusiasts. Our platform promotes responsible pet 
          ownership and the joy of companionship, making every interaction meaningful and enjoyable.
          </p>
        </section>
        
        <section className="py-12 text-center">
          <p className="mb-12 text-2xl italic mx-4">Message the owners, connect, and enjoy the company of furry friends together! </p>
          <div className="flex justify-center flex-wrap gap-12">
            <div className="w-72 p-4 bg-white shadow rounded">
              <img src="running_dogs.jpg" alt="Owner Experience" className="w-full h-40 object-cover rounded" />
              <p className="mt-4">Thomas, 38</p>
            </div>
            <div className="w-72 p-4 bg-white shadow rounded">
              <img src="pic2.jpg" alt="Owner Experience" className="w-full h-40 object-cover rounded" />
              <p className="mt-4">Anna, 25 </p>
            </div>
            <div className="w-72 p-4 bg-white shadow rounded">
              <img src="pic3.jpg" alt="Owner Experience" className="w-full h-40 object-cover rounded" />
              <p className="mt-4">Jonas, 39</p>
            </div>
          </div>
        </section>
      </div>
    </>
    );
  };
export default HomePage;