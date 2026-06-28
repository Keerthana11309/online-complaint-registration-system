import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Network Issues');
  const [description, setDescription] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch existing complaints for this user
  const fetchUserComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints/my-complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.log("Error fetching user complaints", err);
      setError("Could not load previous complaints. Please check if server is running.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserComplaints();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const res = await axios.post('http://localhost:5000/api/complaints/create', {
        title,
        category,
        description
      }, config);

      if (res.data) {
        setSuccess('Complaint submitted successfully! 🎉');
        setTitle('');
        setDescription('');
        setError('');
        // Refresh the list immediately
        fetchUserComplaints();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition">
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6">File a New Complaint</h2>
          
          {error && <p className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm font-medium">{error}</p>}
          {success && <p className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm font-medium">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Title</label>
              <input 
                type="text" 
                placeholder="e.g. Room fan not working"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-white text-sm"
              >
                <option value="Network Issues">Network Issues</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Hostel/Food">Hostel/Food</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              <textarea 
                rows="4"
                placeholder="Describe your issue here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm resize-none"
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition text-sm">
              Submit Complaint
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Your Complaints History</h2>
          
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
            {complaints.length > 0 ? (
              complaints.map((item) => (
                <div key={item._id} className="border border-gray-100 bg-gray-50/50 p-4 rounded-xl flex justify-between items-start hover:shadow-sm transition">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                    <p className="text-gray-600 text-xs mt-0.5 line-clamp-2">{item.description}</p>
                    <span className="inline-block bg-gray-200 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded mt-2">
                      Category: {item.category}
                    </span>
                    <span className="block text-gray-400 text-[10px] mt-1">
                      Filed on: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    item.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                    item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-12 text-sm font-medium">No complaints filed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;