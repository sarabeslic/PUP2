import React from "react";
import { Link, useLocation } from 'react-router-dom';


const LoginBar = () => {
    const location=useLocation();
        // Define an array containing objects with text and link properties

        const navItems = [
          { text: 'HOMEPAGE', link: '/' },
          { text: 'LOGIN', link: '/login' },
          { text: 'REGISTER', link: '/register'},

        ];
      
        return (
          <nav className="px-4 py-4 sm:px-8 sm:py-6 md:px-20 md:py-8">
            <ul className="flex flex-wrap items-center justify-between">
              <li className="mr-auto text-black">
                <Link to={navItems[0].link}>{navItems[0].text}</Link>
              </li>
              <div className="flex items-center space-x-4">
                {navItems.slice(1).map((item, index) => (
                  <li key={index} className="px-2 py-1">
                    <Link
                      to={item.link}
                      className={`px-6 py-2 rounded-full text-black ${
                        location.pathname === item.link ? "bg-yellow-300" : ""
                      }`}
                    >
                      {item.text}
                    </Link>
                  </li>
                ))}
              </div>
            </ul>
          </nav>
        );
      };
      
      export default LoginBar;
    