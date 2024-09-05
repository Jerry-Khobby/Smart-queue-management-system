import React,{createContext,useState,useEffect} from 'react'

export const AuthContext = createContext();

export const AuthProvider =({children})=>{
// storing the token here 
const [token,setToken]=useState(null);
const [loading,setLoading] = useState(true);

useEffect(()=>{
  const storedToken = localStorage.getItem("token");
  setToken(storedToken);
  setLoading(false);
},[]);
return (
  <AuthContext.Provider value={{token,setToken,loading}}>
    {children}
  </AuthContext.Provider>
)
}