import React, { useEffect, useState, useRef } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineSick } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai"; // Import close icon
import { Box } from "@mui/material";
import { FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getItem, removeItem } from '../../localStorageUtils';
import axios from 'axios';  // Ensure axios is imported
import { useNavigate } from 'react-router-dom';

const UserIcon = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userMenuRef = useRef(null);
  const drawerRef = useRef(null); // Ref for drawer
  const navigate = useNavigate();

  // Function to toggle the menu
  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  // Close the drawer when clicking outside of it or on the overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (userMenuRef.current && !userMenuRef.current.contains(event.target)) &&
        (drawerRef.current && !drawerRef.current.contains(event.target))
      ) {
        closeMenu();
      }
    };
    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  const token = getItem("token");

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Create a function that logs out the user
  const handleLogout = async () => {
    try {
      const response = await axios.put('http://localhost:8000/logout', {}, {
        headers: {
          'Authorization': `Bearer ${getItem('token')}`  // Include the token in the request
        }
      });

      removeItem('token');  // Remove token from localStorage
      alert(response.data.message);  // Show the logout message
      navigate('/login');  // Redirect to login page

    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: '2px' }}>
      {/* Notification Icon */}
      <div
        style={{
          height: '35px',
          width: '35px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
      >
        <div className='relative'>
          <div className='absolute bottom-3 left-2 text-center flex items-center bg-red-600 rounded-full h-4 w-4 justify-center'>
            <p className='text-white text-xs text-center items-center'>0</p>
          </div>
          <IoIosNotifications size={23} color='black' />
        </div>
      </div>

      <div
        ref={userMenuRef}
        style={{
          height: '35px',
          width: '35px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
        onClick={handleToggleMenu}
      >
        <Box>
          <FaRegUserCircle size={23} color='black' />
        </Box>
      </div>

      {showMenu && (
        <div>
          <div
            className="fixed inset-0 bg-black opacity-50"
            style={{ zIndex: 999 }}
            onClick={closeMenu}
          ></div>

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="fixed top-0 right-0 h-full w-64 bg-gray-50 p-4"
            style={{
              zIndex: 1000,
              transform: showMenu ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            {/* Close Icon */}
            <div className='flex justify-end'>
              <AiOutlineClose
                className="cursor-pointer"
                size={24}
                onClick={closeMenu}
              />
            </div>

            {/* Drawer Content */}
            <div className='items-center flex flex-row px-5 mt-5'>
              <MdOutlineSick className='mr-3 text-black' size={35} />
              <h4 className='text-2xl font-mono'>Feedback</h4>
            </div>
            <ul className='space-y-4 flex-grow flex flex-col pt-10 gap-4'>
              <Link to="/newpatient" className='flex items-center cursor-pointer hover:bg-gray-400 p-2 rounded'>
                Record New Patient Details
              </Link>
              <li className='flex items-center cursor-pointer hover:bg-gray-400 p-2 rounded'>
                View Data for Patient
              </li>
              <li className='flex items-center cursor-pointer hover:bg-gray-400 p-2 rounded'>
                Record New Patient Details
              </li>
              <li className='flex items-center cursor-pointer hover:bg-gray-400 p-2 rounded'>
                Record New Patient Details
              </li>
              <li className='flex items-center cursor-pointer hover:bg-gray-400 p-2 rounded'>
                Record New Patient Details
              </li>
              <li className='flex items-center cursor-pointer hover:bg-gray-400 p-2 rounded' onClick={handleLogout}>
                <FaSignOutAlt className='mr-3 text-black' />
                Logout
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIcon;
