import React, { useState,useEffect } from 'react';
import {Link,useNavigate} from "react-router-dom";
import {getItem } from '../../../localStorageUtils';
import axios from 'axios';

const NewPatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    insuranceNumber: '',
    age: '',
    gender: '',
    address: '',
    phone: '',
    symptoms: '',
    diseaseDescription: '',
    queueNumber: '',
    diseaseStartDate: '',
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState('success');
  const router = useNavigate();

// I have to check for the present of token 
useEffect(() => {
  const token = getItem('token');
  if (!token) {
    router('/login'); // Redirect to login if token is not present
    return;
  }
}, [router]); // Remove `token` from dependency array




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = getItem('token');
    if (!token) {
      router('/login'); 
      return;
    }
  
    // Convert insuranceNumber, age, and queueNumber to integers
    const updatedFormData = {
      ...formData,
      insuranceNumber: parseInt(formData.insuranceNumber, 10),
      age: parseInt(formData.age, 10),
      queueNumber: parseInt(formData.queueNumber, 10),
    };
  
    // Validate before sending
    if (isNaN(updatedFormData.insuranceNumber) || updatedFormData.insuranceNumber.toString().length !== 8) {
      setResponseMessage('Insurance number must be 8 digits and a valid number.');
      setResponseType('error');
      startMessageTimer(); // Start timer for clearing message
      return;
    }
  
    if (isNaN(updatedFormData.phone) || updatedFormData.phone.toString().length !== 10) {
      setResponseMessage('Phone number must be 10 digits.');
      setResponseType('error');
      startMessageTimer(); // Start timer for clearing message
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/patient-details', updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (response?.status === 201) {
        const message = response?.data?.message ?? 'Patient details added successfully!';
        setResponseMessage(message);
        setResponseType('success');
        setFormData({
          name: '',
          insuranceNumber: '',
          age: '',
          gender: '',
          address: '',
          phone: '',
          symptoms: '',
          diseaseDescription: '',
          queueNumber: '',
          diseaseStartDate: '',
        });
      } else {
        const errorMessage = response?.data?.error ?? 'Failed to add patient details';
        setResponseMessage(errorMessage);
        setResponseType('error');
      }
  
      startMessageTimer(); // Start timer for clearing message
  
    } catch (error) {
      const errorMessage = error?.response?.data?.error ?? 'There was an error submitting the form.';
      setResponseMessage(errorMessage);
      setResponseType('error');
  
      startMessageTimer(); // Start timer for clearing message
    }
  };
  
  // Function to clear the message after 7 seconds
  const startMessageTimer = () => {
    setTimeout(() => {
      setResponseMessage('');
      setResponseType('');
    }, 7000); // 7000 milliseconds = 7 seconds
  };
  
  
  
  
  

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 bg-white shadow-md rounded-md">
        <h3 className="text-xl font-mono mb-6">Patient Details Form</h3>
        {responseMessage && (
          <div className={`p-4 mb-4 text-sm rounded ${responseType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {responseMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Patient Name"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
<input
  type="number"
  name="insuranceNumber"
  value={formData.insuranceNumber}
  onChange={handleChange}
  placeholder="Insurance Number (8 digits)"
  required
  className="w-full p-2 border border-gray-300 rounded"
/>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Gender"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (10 digits)"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Symptoms"
              rows="3"
              required
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
            <textarea
              name="diseaseDescription"
              value={formData.diseaseDescription}
              onChange={handleChange}
              placeholder="Disease Description"
              rows="4"
              required
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
<input
  type="number"
  name="queueNumber"
  value={formData.queueNumber}
  onChange={handleChange}
  placeholder="Queue Number"
  required
  className="w-full p-2 border border-gray-300 rounded"
/>
            <label htmlFor="diseaseStartDate" className="text-gray-500">Disease Start Date</label>
            <input
              type="date"
              id="diseaseStartDate"
              name="diseaseStartDate"
              value={formData.diseaseStartDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit Patient Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatientForm;
