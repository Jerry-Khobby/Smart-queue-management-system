import React,{useState,useContext,useEffect} from 'react'
import axios from 'axios';
import {Link,useNavigate} from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { setItem,getItem } from '../localStorageUtils';



const UserLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',

  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [responseType, setResponseType] = useState('success');
  const {setToken,token} = useContext(AuthContext);

  useEffect(() => {
    const savedToken = getItem("token"); // Use the imported getItem function
    if (savedToken) {
      setToken(savedToken);
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      // Handle single-select change
      setFormData({
        ...formData,
        role: value,
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
    try {
      const response = await axios.post("https://smart-queue-management-system-1.onrender.com/login", {
        email: formData.email,
        password: formData.password, // Only one password is needed for submission
      }, {
       /*  withCredentials: true, */
      });

      if (response.status === 200) {
        setResponseMessage('Logged in successfully');
        setResponseType('success');
        setToken(response.data.token);
        setItem("token", response.data.token); // Use the imported setItem function
        navigate("/", { replace: true });
        // Clear the form after successful submission
        setFormData({
          email: '',
          password: '',
        });
      } else {
        setResponseMessage(response.error || 'Failed to login');
        setResponseType('error');
      }
    } catch (error) {
      setToken(null);
      localStorage.removeItem("token");
      setResponseMessage('There was an error in loggin in');
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
        <h3 className="text-xl font-mono mb-6">Workers Login  Form</h3>
        {responseMessage && (
          <div className={`p-4 mb-4 text-sm rounded ${responseType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {responseMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
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
              placeholder="Enter Password"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Dont have an Account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;