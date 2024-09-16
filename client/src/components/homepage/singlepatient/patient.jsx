import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getItem } from '../../../localStorageUtils'; // Assuming you have this utility
import { usePatientContext } from '../../../context/PatientContext';

const SinglePatient = () => {
  const { insuranceNumber } = useParams(); // Get insuranceNumber from the URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setPatientData } = usePatientContext();

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

  return (
    <div className="min-h-screen pt-20 flex justify-center items-center px-4">
      {patient ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:max-w-3xl lg:max-w-4xl">
          <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Name:</strong> {patient.name}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Insurance Number:</strong> {patient.insuranceNumber}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Age:</strong> {patient.age}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Gender:</strong> {patient.gender}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Phone:</strong> {patient.phone}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Address:</strong> {patient.address}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Symptoms:</strong> {patient.symptoms}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Disease description:</strong> {patient.diseaseDescription}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Disease start date:</strong> {new Date(patient.diseaseStartDate).toLocaleDateString()}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Queue Number:</strong> {patient.queueNumber}
            </div>
            <div className="p-4 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md">
              <strong>Recording Date:</strong> {new Date(patient.recordingDate).toLocaleDateString()}
            </div>

            {/* Center the buttons and improve their styling */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              {/* Update Patient Record Button */}
              <button
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-blue-700 shadow-lg hover:shadow-lg transition-shadow duration-200 font-mono"
                onClick={() => {
                  setPatientData(patient); // Store patient data in context
                  navigate(`/update-patient/${patient.insuranceNumber}`); // Navigate to the update page
                }}
              >
                Update Patient Record
              </button>

              {/* Issue Drug Button */}
              <button
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-green-700 shadow-md hover:shadow-lg transition-shadow duration-200 font-mono"
                onClick={() => {
                  setPatientData(patient); // Store patient data in context
                  navigate(`/patient-prescribe/${patient.insuranceNumber}`); // Navigate to the issue drug page
                }}
              >
                Issue Drug
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>No patient data available.</div>
      )}
    </div>
  );
};

export default SinglePatient;
