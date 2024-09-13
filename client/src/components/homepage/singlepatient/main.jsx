import React from 'react'
import Navbar from '../navbar';
import SinglePatient from './patient';



const SinglePatientMainComponent = () => {
  return ( 
    <div>
      <Navbar/>
      <SinglePatient/>
    </div>
   );
}
 
export default SinglePatientMainComponent;