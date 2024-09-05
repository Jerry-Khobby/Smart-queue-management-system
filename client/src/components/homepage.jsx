import React, { useEffect,useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
      {/* Your component content */}
      <h1>Hello World</h1>
    </div>
  );
};

export default QueuePage;
