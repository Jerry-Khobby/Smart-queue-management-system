import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BsPlusLg } from 'react-icons/bs'; // Import the plus icon
import { getItem } from '../../../localStorageUtils';

const IssueDrugsForms = () => {
  let { insuranceNumber } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState([{ drugName: '', dosage: '', frequency: '' }]);
  const [formStatuses, setFormStatuses] = useState([false]); // Track completion status of each form
  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedForms = [...forms];
    updatedForms[index] = { ...updatedForms[index], [name]: value };
    setForms(updatedForms);

    // Check if the current form is filled
    const isFormFilled = updatedForms[index].drugName && updatedForms[index].dosage && updatedForms[index].frequency;
    const updatedFormStatuses = [...formStatuses];
    updatedFormStatuses[index] = isFormFilled;
    setFormStatuses(updatedFormStatuses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    const token = getItem('token');
  
    // Check if any form is incomplete
    for (const form of forms) {
      if (!form.drugName || !form.dosage || !form.frequency) {
        setResponseMessage("Please fill out all fields for each medication.");
        setResponseType("error");
        startMessageTimer();
        setLoading(false); // Stop loading if there's an error
        return;
      }
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/patient-prescribe/${insuranceNumber}`,
        { medications: forms }, // Send the forms as an array of medications
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200 || response?.status === 201) {
        const message = response?.data?.message ?? 'Drug issued successfully!';
        setResponseMessage(message);
        setResponseType('success');
        startMessageTimer();

        // Reset the forms after successful submission
        setForms([{ drugName: '', dosage: '', frequency: '' }]);
        setFormStatuses([false]);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message ?? 'There was an error submitting the form.';
      setResponseMessage(errorMessage);
      setResponseType('error');
    } finally {
      setLoading(false); // Stop loading when the request is done
    }
  };

  const startMessageTimer = () => {
    setTimeout(() => {
      setResponseMessage('');
      setResponseType('');
    }, 7000);
  };

  const handleAddForm = () => {
    // Add a new form if the last form is filled
    if (formStatuses[formStatuses.length - 1]) {
      setForms([...forms, { drugName: '', dosage: '', frequency: '' }]);
      setFormStatuses([...formStatuses, false]); // New form starts as not filled
    }
  };

  const handleRemoveForm = (index) => {
    // Only allow removal if there is more than one form
    if (forms.length > 1) {
      const updatedForms = forms.filter((_, i) => i !== index);
      const updatedFormStatuses = formStatuses.filter((_, i) => i !== index);
      setForms(updatedForms);
      setFormStatuses(updatedFormStatuses);
    } else {
      setResponseMessage('Cannot delete the last remaining drug!');
      setResponseType('error');
      startMessageTimer();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex justify-center items-center px-4">
      <div className="bg-white shadow-md rounded-3xl p-6 w-full sm:max-w-3xl lg:max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 font-mono">Issue Drugs</h1>
        {responseMessage && (
          <div className={`p-4 mb-4 text-sm rounded ${responseType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {responseMessage}
          </div>
        )}

        {forms.map((form, index) => (
          <div key={index} className="flex flex-col gap-4 mb-4">
            <div>
              <label htmlFor={`drugName-${index}`} className="block mb-2 font-medium font-mono">Medicine Name</label>
              <input
                type="text"
                id={`drugName-${index}`}
                name="drugName"
                value={form.drugName}
                onChange={(e) => handleChange(index, e)}
                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full h-5"
                required
              />
            </div>

            <div>
              <label htmlFor={`dosage-${index}`} className="block mb-2 font-medium font-mono">Dosage</label>
              <input
                type="text"
                id={`dosage-${index}`}
                name="dosage"
                value={form.dosage}
                onChange={(e) => handleChange(index, e)}
                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full h-5"
                required
              />
            </div>

            <div>
              <label htmlFor={`frequency-${index}`} className="block mb-2 font-medium font-mono">Frequency</label>
              <input
                type="text"
                id={`frequency-${index}`}
                name="frequency"
                value={form.frequency}
                onChange={(e) => handleChange(index, e)}
                className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md w-full h-5"
                required
              />
            </div>

            {forms.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveForm(index)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-red-500 shadow-md hover:shadow-lg transition-shado duration-200  w-full mt-2 font-mono"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-sm border-1 border-green-700 shadow-md hover:shadow-lg transition-shadow duration-200  md:w-1/2 lg:w-1/2 sm:w-full mt-4 h-8 flex items-center justify-center text-center font-mono"
          >
            Issue Drug
          </button>
        </form>

        {formStatuses[formStatuses.length - 1] && (
          <div className="flex items-center justify-center mt-3">
            <div
              className="border-3 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer bg-slate-900"
              onClick={handleAddForm}
              style={{ width: '50px', height: '50px' }} // Make it a circle
            >
              <BsPlusLg size={30} color="white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueDrugsForms;
