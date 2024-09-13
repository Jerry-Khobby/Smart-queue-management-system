import React,{useEffect} from 'react'
import Navbar from '../navbar';
import NewPatientForm from './newpatient';
import { getItem } from '../../../localStorageUtils';
import { useNavigate } from 'react-router-dom';



const MainNewPatientForm = () => {

  const navigate = useNavigate();
  useEffect(()=>{
    const token = getItem("token");
    if(!token){
      navigate("/login");
      return;
    }
  },[navigate]);
  return ( 
<div>
  <Navbar/>
  <NewPatientForm/>
</div>
   );
}
 
export default MainNewPatientForm;