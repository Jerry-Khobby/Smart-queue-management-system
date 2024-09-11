import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './homepage/navbar';
import AllPatients from './homepage/main';

const QueuePage = () => {
  const { token, loading } = useContext(AuthContext);


  if(loading){
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
      </div>
    );
  }

  if(!token){
    return <Navigate to="/login" replace/>
  }
 

  return (
    <div>
      <Navbar/>
      <AllPatients/>
    </div>
  );
};

export default QueuePage;
