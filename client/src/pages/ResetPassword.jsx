import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { getToken } from '../utils/auth';
import { apiAuthHandle } from '../config/apiAuthHandle.js';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchError, setMatchError] = useState('');

  const goto = useNavigate();

  const token = getToken()
  console.log("Reset Token:", token);



  
  const handleConfirmPassword = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (value !== password) {
      setMatchError('Passwords do not match')
    } else {
      setMatchError('')
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiAuthHandle.post(`/resetPassword/${token}`, { password });
      toast.success(data.message);
      goto("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Toaster position="top-center" />
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl text-center font-bold">Set New Password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={handleConfirmPassword}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${matchError ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
              }`}
          />
          {matchError && <p className="text-red-500 text-sm">{matchError}</p>}

          <button
            type="submit"
            disabled={loading || matchError}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
