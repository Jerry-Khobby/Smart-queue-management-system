import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getItem } from '../../localStorageUtils';

const AllPatients = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = getItem("token");
      if (!token) {
        throw new Error("No valid token found");
      }

      const response = await axios.get("http://localhost:8000/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        setError("No patients found in the database");
      } else {
        setData(response.data); 
      } 
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to format date for better readability
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to group patients by recording date
  const groupByDate = (patients) => {
    return patients.reduce((groups, patient) => {
      const date = formatDate(patient.recordingDate);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(patient);
      return groups;
    }, {});
  };

  const groupedPatients = groupByDate(data);

  return (
    <div className="flex flex-col min-h-screen pt-20 mx-5">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="space-y-4">
          {/* Render grouped patients */}
          {Object.entries(groupedPatients).map(([date, patients]) => (
            <div key={date}>
              {/* Heading for recording date */}
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {date}
              </h3>

              {/* Render patient cards */}
              <div className=" flex-row gap-2 flex  cursor-pointer">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white shadow-lg rounded-lg w-24 h-24 flex items-center justify-center flex-col"
                  >
                    <p className="text-center text-sm font-semibold">
                      {patient.insuranceNumber}
                    </p>
                    <p className="text-center text-sm font-semibold bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      {patient.queueNumber}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPatients;
