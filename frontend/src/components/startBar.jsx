import React from "react";
import { Link } from 'react-router-dom';

const StartBar = () => {
  // Define an array containing objects with text and link properties
  const navItems = [
    { text: 'HOMEPAGE', link: '/' },
    { text: 'LOGIN', link: '/login' },
    { text: 'REGISTER', link: '/register' },
  ];

  return (
    <nav className="px-4 py-4 sm:px-8 sm:py-6 md:px-20 md:py-8 ">
      <ul className="flex flex-wrap items-center justify-between">
        <li className="mr-auto">
          <Link to={navItems[0].link} className="text-white text-lg">{navItems[0].text}</Link>
        </li>
        <div className="flex ml-auto items-center space-x-4">
          {navItems.slice(1).map((item, index) => (
            <li key={index} className="px-2 py-1">
              <Link to={item.link} className="text-white text-lg">{item.text}</Link>
            </li>
          ))}
        </div>
      </ul>
    </nav>
  );
};

export default StartBar;