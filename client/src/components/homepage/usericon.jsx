import React, { useEffect, useState, useRef } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { Box } from "@mui/material";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineSick } from "react-icons/md";

const UserIcon = () => {
  const [showMenu, setShowMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Function to toggle the menu
  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  // Close the drawer when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
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

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: '2px' }}>
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
        <Box>
          <FaRegUserCircle size={23} color='black' />
        </Box>
      </div>
      <div
        ref={userMenuRef}
        style={{
          height: '35px',
          width: '35px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'flex-end',
          borderRadius: '50%',
          cursor: 'pointer',
          position: 'relative'
        }}
        onClick={handleToggleMenu}
      >
        <Box>
          <GiHamburgerMenu size={23} color='black' />
        </Box>
      </div>

      {/* Drawer Menu */}
      {showMenu && (
        <div
          className="fixed top-0 right-0 h-full w-64 bg-gray-50 p-4"
          style={{
            zIndex: 1000,
            transform: showMenu ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className='items-center flex flex-row px-5 mt-5'>
            <MdOutlineSick className='mr-3 text-black' size={35}/>
          <h4 className='text-2xl font-mono'>Feedback</h4>
          </div>
          <ul className='space-y-4 flex-grow'>
            <li>
              {/** I want an icon here  */}
              {/** a text here  */}
            </li>

          </ul>
        </div>
      )}
    </div>
  );
};

export default UserIcon;
