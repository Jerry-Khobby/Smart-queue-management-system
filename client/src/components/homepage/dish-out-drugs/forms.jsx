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
  const [openForm, setOpenForm] = useState(false);  // Track form visibility
  const [status, setStatus] = useState("");  // Track selected status value

  useEffect(() => {
    const token = getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchDrugs(token);  // Fetch drugs if token exists
    }
  }, [navigate, insuranceNumber]);

  const fetchDrugs = async (token) => {
    try {
      const response = await axios.get(`http://localhost:8000/patient-prescribe/${insuranceNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add token in headers
        },
      });
      setMessage(response?.data?.message);  // Set the message from the backend
      setPrescribedDrugs(response.data.prescribedDrugs || []);  // Handle empty response gracefully
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error?.response?.data?.message);  // Capture the message from the error response
      } else {
        setMessage("Error fetching prescribed drugs");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.patch(`http://localhost:8000/patient-prescribe/${insuranceNumber}`, {
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Set the backend message from the response
      if (response.data.message) {
        setMessage(response?.data?.message);
      }
  
      // Optionally, update the UI to reflect the successful submission
      setPrescribedDrugs(response.data.prescribedDrugs || []);
      setOpenForm(false);  // Close the form on success
      setStatus("");  // Reset the status
    } catch (error) {
      // Capture the error message if present
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error?.response?.data?.message);
      } else {
        setMessage("Error submitting the drug status");
      }
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
            <>
              {prescribedDrugs.map((drug, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                  <p><strong>Drug Name:</strong> {drug.drugName}</p>
                  <p><strong>Dosage:</strong> {drug.dosage}</p>
                  <p><strong>Frequency:</strong> {drug.frequency}</p>
                </div>
              ))}

              {/* Show "Issue Drug" button if drugs are present */}
              <button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-green-700 shadow-md hover:shadow-lg transition-shadow duration-200 font-mono mt-4"
                onClick={() => setOpenForm(true)}  // Open the form when clicked
              >
                Issue Drug
              </button>

              {/* Display the form when "Issue Drug" button is clicked */}
              {openForm && (
                <form onSubmit={handleSubmit} className="mt-4">
                  <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
                    Select Drug Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}  // Track selected status
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                    required
                  >
                    <option value="">-- Select Status --</option>
                    <option value="Dispensed">Dispensed</option>
                    <option value="Not Available">Not Available</option>
                  </select>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-blue-700 shadow-md hover:shadow-lg transition-shadow duration-200 font-mono mt-4"
                  >
                    Submit Status
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 flex flex-row">
              <GiMedicinePills size={80} />
              <p>No drugs prescribed for this patient today.</p>
            </div>
          )}
        </div>
      )}
      <div className='flex flex-row items-center justify-center gap-8 mt-6'>
        <button
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-green-700 shadow-md hover:shadow-lg transition-shadow duration-200 font-mono"
          onClick={() => navigate(`/patient/${insuranceNumber}`)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Forms;
