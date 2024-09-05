import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QueuePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/patients", {
          withCredentials: true
        });
        if (response.status === 200) {
          // Handle successful response
        } else if (response.status === 401) {
          console.log("Token expired or invalid, logging out...");
          navigate("/login");
        } else {
          console.log("Failed to fetch protected data");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Token expired or invalid, logging out...");
          navigate("/login");
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };
    
    fetchUserData();
  }, [navigate]); // Adding navigate as a dependency

  return (
    <div>
      {/* Your component content */}
      {/** when the token is not available the app must make fast and detect it and work on that my next step for this project  */}
    </div>
  );
};

export default QueuePage;
