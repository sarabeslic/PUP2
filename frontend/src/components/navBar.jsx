import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {IoHome} from 'react-icons/io5';

const Navbar = () => {
  const location = useLocation(); // Get the current location object for active link styling

  const [showDrawer, setShowDrawer] = useState(false); // State to manage drawer visibility

  // Define an array containing objects with text and link properties
  const navItems = [
    { text: "HOMEPAGE", link: "/" },
    { text: "DOGS", link: "/dogs" },
    { text: "MATCHES", link: "/matches" },
    { text: "USER", link: "/user" },
    { text: "PROFILE", link: "/settings" },
    { text: "LOGOUT", link: "/" },
  ];

  // Function to toggle the drawer visibility
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <nav className="p-4 m-4">
      <div className="">
        <div className="">
          {/* Hamburger menu icon */}
          <button
            className="text-white md:hidden"
            onClick={toggleDrawer}
            aria-label="Open navigation menu"
          >
            <IoHome className="text-yellow-300"size={28} />
          </button>
          {/* Navigation links for medium and larger screens */}
          <ul className="hidden md:flex md:justify-evenly">
            {navItems.map((item, index) => (
              <li key={index} className="mx-2">
                <Link
                  to={item.link}
                  className={`px-6 py-2 rounded-full ${
                    location.pathname === item.link ? "bg-yellow-300" : ""
                  }`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      
        {/* Drawer navigation for small screens*/}
        {showDrawer && (
          <div className="md:hidden fixed top-0 left-0 w-full h-full bg-gray-400 bg-opacity-75 z-50">
            <div className="flex flex-col items-center justify-center h-full">
              <ul className="text-black text-xl space-y-4">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className={`block px-6 py-2 rounded-full ${
                        location.pathname === item.link ? "bg-yellow-300" : ""
                      }`}
                      onClick={toggleDrawer}
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;