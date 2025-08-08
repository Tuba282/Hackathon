import React, { useState, useEffect, useRef } from 'react';
import { RiAccountPinBoxFill } from "react-icons/ri";
import { FaUser, FaUsers, FaCube, FaChartLine, FaCog, FaHeart, FaBell, FaHome } from 'react-icons/fa';
import { getUser, set_verification_Email, setToken, setUser as set_user_localStorage, removeUser, setUser } from '../utils/auth';

import { apiAuthHandle } from '../config/apiAuthHandle.js';
import axios from 'axios';
import apiUploadHandle from '../config/apiUploadHandle.js';
import toast, { Toaster } from 'react-hot-toast';
// Blog API removed
import { useNavigate } from 'react-router-dom';


import UserProfile from '../dashboard/UserDashboard/UserProfile';
import UserFavorites from '../dashboard/UserDashboard/UserFavorites';
import UserSettings from '../dashboard/UserDashboard/UserSettings';
import AdminDashboard from '../dashboard/AdminDashboard/AdminDashboard';
import AdminProfile from '../dashboard/AdminDashboard/AdminProfile';
import AdminSettings from '../dashboard/AdminDashboard/AdminSettings';
import AdminUsers from '../dashboard/AdminDashboard/AdminUsers';
import AllQuries from '../dashboard/AdminDashboard/AllQuries.jsx';
import UserQuires from '../dashboard/UserDashboard/UserQuries.jsx';

const Dashboard = () => {

  const currentUser = getUser()
  console.log("User data:", JSON.stringify(currentUser, null, 2));


  useEffect(() => {
    if (currentUser.role === 'admin') {
      getUsersData();
      // Blog logic removed
    }
  }, [currentUser.role]);

  const goto = useNavigate()

  const [activeTab, setActiveTab] = useState('dashboard');

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  // Close sidebar on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const [users, setUsers] = useState([]);
  // get users data
  const getUsersData = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await apiAuthHandle.get(`/getUserData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data?.data);
      console.log(data?.data);

      toast.success('Fetched users successfully');


    } catch (error) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
    }
  };

  

  // get formatted Data
  function formatCustomDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}-${month}-${year}`;
  }
  // admin can add user 
  let [addUserModal, setAddUserModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handle_AddUser_Change = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // add user (admin)
  const handleAddUser = async (e) => {
    e.preventDefault();


    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      console.log(error);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      console.log(error);

      return;
    }


    try {
      const response = await apiAuthHandle.post(`/register`, formData);

      set_verification_Email(formData.email);
      setToken(response.data.token);
      set_user_localStorage(response.data.user);

      toast.success(response.data.message);

      setAddUserModal(false)

      setTimeout(() => {

        goto('/verify-otp', {
          state: {
            email: formData.email,
            message: response.data.message,
            otp: response.data.otp
          }
        });
      }, 2000)

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      console.log(error.response?.data);

    }

  };





  // logout user (self)
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiAuthHandle.post('/logout', {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);

      removeUser()

      setTimeout(() => {
        goto('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };
  // update user (self)
  const [updateUser, setUpdateUser] = useState({
    username: currentUser.name || '',
    useremail: currentUser.email || '',
    linkedin: currentUser.linkedin || '',
    portfolio: currentUser.portfolio || '',
    instagram: currentUser.instagram || '',
    github: currentUser.github || '',
    description: currentUser.description || '',
    field: currentUser.field || '',
    image: null
  });

  const updateImage = useRef(null);

  const handleUserSettingsChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateUser((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // UpdateProfile 
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // 1. Image upload first (if selected)
      let imageUrl = null;
      if (updateUser.image) {
        const imageForm = new FormData();
        imageForm.append('file', updateUser.image); // assuming updateUser.image is a File object

        const uploadRes = await apiUploadHandle.post('/', imageForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = uploadRes?.data?.url;
      }

      // 2. Append all fields to formData
      formData.append('name', updateUser.username);
      formData.append('email', updateUser.useremail);
      formData.append('linkedin', updateUser.linkedin);
      formData.append('portfolio', updateUser.portfolio);
      formData.append('instagram', updateUser.instagram);
      formData.append('github', updateUser.github);
      formData.append('description', updateUser.description);
      formData.append('field', updateUser.field);

      if (imageUrl) {
        formData.append('profileImage', imageUrl); // your backend must support this
      }

      // 3. Send update request to backend
      const { data } = await apiAuthHandle.put('/updateProfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // 4. Save updated user to localStorage and state
      setUser(data?.user); // or whatever your backend returns
      localStorage.setItem('user', JSON.stringify(data?.user));

      toast.success(data.message || 'Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  };


  // Sidebar navigation
  const userNavItems = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'home', label: 'Home', icon: FaHome },
    { id: 'quires', label: 'My Quires', icon: FaCube },
    { id: 'favorites', label: 'Favorites', icon: FaHeart },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'login', label: 'Login', icon: FaUser },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'home', label: 'Home', icon: FaHome },
    { id: 'profile', label: 'Profile', icon: RiAccountPinBoxFill },
    { id: 'settings', label: 'Settings', icon: FaCog },
    { id: 'recent', label: 'Recent', icon: FaCube },
    { id: 'login', label: 'Login', icon: FaUser },
  ];

  const navItems = currentUser.role === 'admin' ? adminNavItems : userNavItems;

  const renderContent = () => {
    if (currentUser.role === 'admin') {
      switch (activeTab) {
        case 'login': return goto('/');
        case 'home': return goto('/board');
        case 'dashboard':
          return <AdminDashboard />;
        case 'users':
          return <AdminUsers
            users={users}
            setAddUserModal={setAddUserModal}
            addUserModal={addUserModal}
            handleAddUser={handleAddUser}
            handle_AddUser_Change={handle_AddUser_Change}
            formData={formData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleLogout={handleLogout}
          />;
        case 'settings':
          return <AdminSettings updateUser={updateUser} updateImage={updateImage} handleUserSettingsChange={handleUserSettingsChange} handleImageChange={handleImageChange} handleUpdateProfile={handleUpdateProfile} handleLogout={handleLogout} currentUser={currentUser} />;
        case 'profile':
          return <AdminProfile currentUser={currentUser} />;
        case 'recent':
          return <AllQuries />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'login': return goto('/');
        case 'home': return goto('/board');
        case 'profile': return <UserProfile currentUser={currentUser} />;
        case 'quires': return <UserQuires goto={goto} />;
        case 'favorites': return <UserFavorites />;
        case 'settings': return <UserSettings updateUser={updateUser} updateImage={updateImage} handleUserSettingsChange={handleUserSettingsChange} handleImageChange={handleImageChange} handleUpdateProfile={handleUpdateProfile} handleLogout={handleLogout} currentUser={currentUser} />;
        default: return <UserProfile currentUser={currentUser} />;
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-6">
          <div className={`${sidebarOpen ? ' space-x-3 p-3' : ''} flex items-center bg-gray-50`}>
            <img src={currentUser.profileImage || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png'} alt="Profile" className="w-8 h-8 rounded-full" />
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}</p>
                <p className="text-xs text-gray-600 capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-indigo-50 transition-colors ${activeTab === item.id ? 'bg-indigo-50 border-r-2 border-indigo-600 text-indigo-600' : 'text-gray-600'
                  }`}
              >
                <Icon className="text-xl" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h2 className="text-2xl md:flex hidden  font-bold text-gray-900 capitalize">
                  {currentUser.role} Dashboard
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900">
                  <FaBell className="text-xl" />
                  <span className='absolute top-5 bg-red-400 rounded-full px-1 text-white font-semibold text-xs'>0</span>
                </button>
                <div className="flex items-center space-x-2">
                  <img src={currentUser.profileImage || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png'} alt="Profile" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className=" overflow-y-auto no-scrollbar">

            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;