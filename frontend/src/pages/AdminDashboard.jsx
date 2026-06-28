import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAllComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints/all');
      if (res.data) {
        // డెమో వీడియో కోసం యూజర్ నేమ్ "Keerthana" అని వచ్చేలా సెట్ చేశాము
        const formattedData = res.data.map(c => ({
          ...c,
          user: {
            name: c.userId?.name || "Keerthana", 
            email: c.userId?.email || "user@example.com"
          }
        }));
        setComplaints(formattedData);
      }
    } catch (err) {
      console.log("Error fetching complaints", err);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}/status`, { status: newStatus });
      
      setComplaints(prev => 
        prev.map(item => item._id === id ? { ...item, status: newStatus } : item)
      );
      setMessage('Complaint status updated successfully! 👍');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.log("Error updating status", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-red-500 text-xs px-2 py-0.5 rounded uppercase font-extrabold tracking-wider">Admin</span>
          Complaint Control Center
        </h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold transition">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-6">All Registered System Complaints (Admin View)</h2>
          {message && <p className="bg-green-50 text-green-600 p-2 rounded mb-4 text-sm text-center font-medium">{message}</p>}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-sm font-semibold border-b border-slate-200">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Complaint Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {complaints.length > 0 ? (
                  complaints.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-medium text-gray-700">
                        {item.user?.name}
                        <span className="block text-xs text-gray-400 font-normal">{item.user?.email}</span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <strong className="text-gray-800 block text-base mb-0.5">{item.title}</strong>
                        <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                          {item.category || "General"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={item.status}
                          className="p-1.5 border border-gray-300 rounded bg-white text-xs font-medium outline-none"
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">No complaints found in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;