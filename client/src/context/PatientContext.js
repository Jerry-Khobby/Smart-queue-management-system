import React,{createContext, useState,useContext} from 'react'




const PatientContext = createContext();

export const usePatientContext=()=>{
  return useContext(PatientContext);
}

export const PatientProvider=({children})=>{

  const [patientData,setPatientData]= useState(null);

  return(
    <PatientContext.Provider value={{patientData,setPatientData}}>
      {children}
    </PatientContext.Provider>
  )
}