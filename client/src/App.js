
import React from 'react'
import UserAdditionForm from "./components/createWorker";
import UserLoginForm from "./components/loginWorker";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import QueuePage from "./components/homepage";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<QueuePage/>}/>
      <Route path="/signup" element={<UserAdditionForm />}/>
      <Route path="/login" element={<UserLoginForm />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;