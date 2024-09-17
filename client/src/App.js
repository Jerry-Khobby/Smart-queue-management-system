
import React from 'react'
import UserAdditionForm from "./components/createWorker";
import UserLoginForm from "./components/loginWorker";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import QueuePage from "./components/homepage";
import MainNewPatientForm from './components/homepage/newpatient/main';
import SinglePatientMainComponent from './components/homepage/singlepatient/main';
import MainUpdate from './components/update-patient/main';
import IssueDrugs from './components/homepage/issue-drugs/main';
import PharmacistForm from './components/homepage/dish-out-drugs/main';









function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<QueuePage/>}/>
      <Route path="/signup" element={<UserAdditionForm />}/>
      <Route path="/login" element={<UserLoginForm />}/>
      <Route path="/newpatient" element ={<MainNewPatientForm />}/>
      <Route path="/patient/:insuranceNumber" element={<SinglePatientMainComponent/>}/>
      <Route path="/update-patient/:insuranceNumber" element={<MainUpdate/>}/>
      <Route path="/patient-prescribe/:insuranceNumber" element={<IssueDrugs/>}/>
      <Route path="/prescription/:insuranceNumber" element={<PharmacistForm/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;