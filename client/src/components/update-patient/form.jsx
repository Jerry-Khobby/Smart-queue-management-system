import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import { getItem } from '../../localStorageUtils'; // Assuming you store the token here
import { usePatientContext } from '../../context/PatientContext';

const UpdatePatientForms = () => {
  const navigate = useNavigate();
  const { patientData, setPatientData } = usePatientContext();
  const [formData, setFormData] = useState({
    name: '',
    insuranceNumber: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    symptoms: '',
    diseaseDescription: '',
    diseaseStartDate: '',
    queueNumber: '',
  });

  useEffect(() => {
    const token = getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (patientData) {
      setFormData({
        name: patientData.name || '',
        insuranceNumber: patientData.insuranceNumber || '',
        age: patientData.age || '',
        gender: patientData.gender || '',
        phone: patientData.phone || '',
        address: patientData.address || '',
        symptoms: patientData.symptoms || '',
        diseaseDescription: patientData.diseaseDescription || '',
        diseaseStartDate: patientData.diseaseStartDate || '',
        queueNumber: patientData.queueNumber || '',
      });
    }
  }, [navigate, patientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8000/update-patient/${formData.insuranceNumber}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to headers
          },
        }
      );

      if (response.status === 200) {
        // Update the context state with the new patient data
        setPatientData(response.data.patient);
        navigate('/updated-patient-details');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="min-h-screen pt-20 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full sm:max-w-3xl lg:max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Update Patient Details</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="insuranceNumber" className="block mb-2 font-medium">Insurance Number</label>
            <input
              type="text"
              id="insuranceNumber"
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
              disabled
            />
          </div>

          <div>
            <label htmlFor="age" className="block mb-2 font-medium">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block mb-2 font-medium">Gender</label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 font-medium">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="address" className="block mb-2 font-medium">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="symptoms" className="block mb-2 font-medium">Symptoms</label>
            <input
              type="text"
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="diseaseDescription" className="block mb-2 font-medium">Disease Description</label>
            <input
              type="text"
              id="diseaseDescription"
              name="diseaseDescription"
              value={formData.diseaseDescription}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="diseaseStartDate" className="block mb-2 font-medium">Disease Start Date</label>
            <input
              type="date"
              id="diseaseStartDate"
              name="diseaseStartDate"
              value={formData.diseaseStartDate}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <div>
            <label htmlFor="queueNumber" className="block mb-2 font-medium">Queue Number</label>
            <input
              type="text"
              id="queueNumber"
              name="queueNumber"
              value={formData.queueNumber}
              onChange={handleChange}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Update Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePatientForms;
