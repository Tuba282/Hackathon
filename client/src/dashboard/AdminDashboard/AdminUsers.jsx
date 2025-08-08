import { FaUser, FaTrash, FaPlus, FaSearch, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import apiAdminQueryHandle from '../../config/apiAdminQueryHandle';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { getUser } from '../../utils/auth';
import { apiAuthHandle } from '../../config/apiAuthHandle';

function formatCustomDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  return `${day}-${month}-${year}`;
}

/*
    
*/


const AdminUsers = ({ setAddUserModal, addUserModal, handleAddUser, handle_AddUser_Change, formData, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword }) => {

  const currentUser = getUser()
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    if (currentUser.role === 'admin') {
      getStats();
      getUsersData()
    }
  }, [currentUser.role]);

  // get Stats
  const [analytics, setAnalytics] = useState({});


  // Fetch admin stats (questions, users, answers)
  const getStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiAdminQueryHandle.get('/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Stats fetched successfully");
      setAnalytics(data?.stats);


    } catch (error) {
      console.error("Error fetching stats:", error?.response?.data || error.message);
      toast.error("Failed to fetch stats");
    }
  };
  // getUsers
  const getUsersData = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiAuthHandle.get(`/getUserData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data?.data);

      toast.success('Fetched users successfully');


    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
    }
  };

  // delete user
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiAuthHandle.delete(`/deleteUserData/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data?.message);

      getUsersData()
    } catch (error) {
      toast.error(error.message);
      console.error('Error in deleting user:', error);
    }
  };


  // getUserQuestionCount

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">All Users</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setAddUserModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
            <FaPlus className="mr-2" /> Add User
          </button>
        </div>
      </div>

      {/* add user modal */}
      <Dialog open={addUserModal} as="div" className="relative z-10 focus:outline-none" onClose={() => setAddUserModal(false)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white shadow-sm shadow-black p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle className="text-3xl mb-3 font-medium text-Black">
                Add User
              </DialogTitle>
              <form onSubmit={handleAddUser}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute top-3 left-3 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handle_AddUser_Change}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handle_AddUser_Change}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute top-3 left-3 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handle_AddUser_Change}
                      />
                      <span
                        role="button"
                        tabIndex={0}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute top-3 left-3 text-gray-400" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className="appearance-none rounded-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handle_AddUser_Change}
                      />
                      <span
                        role="button"
                        tabIndex={0}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setShowConfirmPassword(!showConfirmPassword);
                        }}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    type='submit'
                    className="rounded-md bg-indigo-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-indigo-700 focus:shadow-none active:bg-indigo-700 hover:bg-indigo-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                    Got it, thanks!
                  </Button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users
              .filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user, ind) => {
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{ind + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isVerified === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-center">
                      {analytics?.questionCountsPerUser && Array.isArray(analytics.questionCountsPerUser)
                        ? (analytics.questionCountsPerUser.find(q => String(q.userId) === String(user._id))?.questionCount || 0)
                        : 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatCustomDate(user.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button className="text-red-600 hover:text-red-800" onClick={() => deleteUser(user._id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminUsers;
