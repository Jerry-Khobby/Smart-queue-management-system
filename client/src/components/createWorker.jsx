import React, { useState } from 'react';
import axios from 'axios';

const UserAdditionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: ['receptionist'], // Default role set to 'receptionist'
    email: '',
    password: '',
    password_two:'',
    contactNumber: '',
    department: '',
    profileImage: ''
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState('success');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      // Handle multi-select change
      const options = e.target.options;
      const selectedRoles = [];
      for  (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedRoles.push(options[i].value);
        }
      }
      setFormData({
        ...formData,
        role: selectedRoles,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !==formData.password_two) {
      setResponseMessage('Passwords do not match');
      setResponseType('error');

      // Clear the message after 5 seconds
      setTimeout(() => {
        setResponseMessage(null);
      }, 5000);
      return;
    }

    try{
      const response = await axios.post("http://localhost:8000/create",{
        name: formData.name,
        email: formData.email,
        password: formData.password, // Only one password is needed for submission
        role: formData.role,
        contactNumber: formData.contactNumber,
        department: formData.department,
        profileImage: formData.profileImage,
      });

      if (response.status === 200) {
        setResponseMessage('User added successfully!');
        setResponseType('success');

        // Clear the form after successful submission
        setFormData({
          name: '',
          role: ['receptionist'],
          email: '',
          password: '',
          password_two: '',
          contactNumber: '',
          department: '',
          profileImage: ''
        });
      } else {
        setResponseMessage(response.data.error || 'Failed to add user');
        setResponseType('error');
      }

    }catch(e){
      setResponseMessage('There was an error in submitting the form.');
      setResponseType('error');
    }
  };

  return (
    <div 
      className="min-h-screen pt-20 flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('https://cdn.modernghana.com/content__/640/457/317202473848-h40o2s6eey-hswu.png')` }}
    >
      {/* Overlay to fade the background image */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg z-10">
        <h3 className="text-xl font-mono mb-6">Workers Registration Form</h3>
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
              placeholder="Full Name"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create Password"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password_two"
              value={formData.password_two}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Department"
              className="w-full p-2 border border-gray-300 rounded"
              required 
            />
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="Profile Image URL (optional)"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <label className='text-md font-mono text-gray-700'>
              Select your role in the hospital: 
              <select name="role" value={formData.role} onChange={handleChange} required
              className='  className="w-full p-2 border border-gray-600 rounded'
              >
                <option value="receptionist">Receptionist</option>
                <option value="nurse">Nurse</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
                <option value="pharmacist">Pharmacist</option>
              </select>
            </label>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAdditionForm;
