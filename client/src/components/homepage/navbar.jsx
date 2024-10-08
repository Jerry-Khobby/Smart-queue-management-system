import React from 'react'
/* import {Button,Tooltip} from "@mui/material" */
import UserIcon from './usericon';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (  
    <div>
    <div
    style={{
      borderBottom:"2px solid #ccc",
      backgroundColor:"white",
      zIndex:"1000",
      height:"60px",
      position:'fixed',
      width:"100%",
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      }}>
      <Link to="/" className='pl-3 cursor-pointer'>
          <img src="https://media.istockphoto.com/id/1359883064/vector/person-in-hospital-bed-patient-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=-KaAuvlh-YdUnWynZRO-40uIEMO8-a3EXLoxAoLvL0I=" alt="Logo " height={70} width={70}/>
      </Link>
      <div>
        <h1 className='sm:text-md md:text-lg lg:text-2xl xl:text-2xl text-md font-mono font-semibold cursor-pointer'>Patient Queue</h1>
      </div>
      <div className='pr-3'>
        <UserIcon/>
      </div>
    </div>
    </div>
  );
}
 
export default Navbar;
