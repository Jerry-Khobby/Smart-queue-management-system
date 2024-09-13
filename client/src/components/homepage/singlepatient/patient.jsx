import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getItem } from '../../../localStorageUtils'; // Assuming you have this utility

const SinglePatient = () => {
  const { insuranceNumber } = useParams(); // Get insuranceNumber from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  // Redirect to login if no token is found
  useEffect(() => {
    const token = getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // Fetch patient data from backend
  useEffect(() => {
    const fetchPatientData = async () => {
      const token = getItem("token"); // Retrieve token

      try {
        const response = await axios.get(`http://localhost:8000/patient/${insuranceNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in header
          },
        });
        setPatient(response.data.singlePatient); // Access response.data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [insuranceNumber]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleFieldClick = (field) => {
    navigate(`/edit-patient/${insuranceNumber}/${field}`); // Navigate to the edit page for a specific field
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      {patient ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
          <div className="flex flex-col gap-4">
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('name')}
            >
              <strong>Name:</strong> {patient.name}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('insuranceNumber')}
            >
              <strong>Insurance Number:</strong> {patient.insuranceNumber}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('age')}
            >
              <strong>Age:</strong> {patient.age}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('gender')}
            >
              <strong>Gender:</strong> {patient.gender}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('phone')}
            >
              <strong>Phone:</strong> {patient.phone}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('address')}
            >
              <strong>Address:</strong> {patient.address}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('symptoms')}
            >
              <strong>Symptoms:</strong> {patient.symptoms}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('diseaseDescription')}
            >
              <strong>Disease description:</strong> {patient.diseaseDescription}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('diseaseStartDate')}
            >
              <strong>Disease start date:</strong> {new Date(patient.diseaseStartDate).toLocaleDateString()}
            </div>
            
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('queueNumber')}
            >
              <strong>Queue Number:</strong> {patient.queueNumber}
            </div>
            <div
              className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md"
              onClick={() => handleFieldClick('recordingDate')}
            >
              <strong>Recording Date:</strong> {new Date(patient.recordingDate).toLocaleDateString()}
            </div>

            {/* Full Update Button */}
            <button
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              onClick={() => navigate(`/update-patient/${insuranceNumber}`)} // Navigate to full update page
            >
              Update Patient Record
            </button>
          </div>
        </div>
      ) : (
        <div>No patient data available.</div>
      )}
    </div>
  );
};

export default SinglePatient;
