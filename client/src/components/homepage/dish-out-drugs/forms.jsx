import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getItem } from '../../../localStorageUtils';
import axios from 'axios';
import { GiMedicinePills } from "react-icons/gi";

const Forms = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");  // Store backend message
  const [prescribedDrugs, setPrescribedDrugs] = useState([]);
  const { insuranceNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchDrugs();  // Fetch drugs if token exists
    }
  }, [navigate, insuranceNumber]);

  const fetchDrugs = async () => {
    try {
      const response = await axios.get(`/patient-prescribe/${insuranceNumber}`);
      setMessage(response.data.message);  // Set the message from the backend
      setPrescribedDrugs(response.data.prescribedDrugs || []);  // Handle empty response gracefully
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);  // Capture the message from the error response
      } else {
        setMessage("Error fetching prescribed drugs");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <p className="text-lg text-gray-700">Loading...</p>
      ) : (
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-center mb-6">Drugs Prescribed Today</h2>
          <p className="text-center mb-4 text-gray-700">{message}</p>  {/* Display the backend message */}
          {prescribedDrugs.length > 0 ? (
            prescribedDrugs.map((drug, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                <p><strong>Drug Name:</strong> {drug.drugName}</p>
                <p><strong>Dosage:</strong> {drug.dosage}</p>
                <p><strong>Frequency:</strong> {drug.frequency}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 flex flex-row ">
              <GiMedicinePills  size={80}/>
              <p>No drugs prescribed for this patient today.</p>
              </div>
          )}
        </div>
      )}
      <div className='flex flex-row items-center justify-center gap-8 mt-6'>
      <button
            type="submit"
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-green-700 shadow-md hover:shadow-lg transition-shadow duration-200 font-mono"
            onClick={()=>navigate(`/patient/${insuranceNumber}`)}
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-green-700 shadow-md hover:shadow-lg transition-shadow duration-200 font-mono"
          >
            Back
          </button>
      </div>
    </div>
  );
};

export default Forms;
