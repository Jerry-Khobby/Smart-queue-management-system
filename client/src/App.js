
import React from 'react'
import UserAdditionForm from "./components/createWorker";
import UserLoginForm from "./components/loginWorker";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import QueuePage from "./components/homepage";
import MainNewPatientForm from './components/homepage/newpatient/main';
import SinglePatientMainComponent from './components/homepage/singlepatient/main';
import MainUpdate from './components/update-patient/main';









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
    </Routes>
    </BrowserRouter>
  );
}

export default App;