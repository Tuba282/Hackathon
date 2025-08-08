import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { IoTrendingUpSharp, IoTimeOutline } from 'react-icons/io5';
import { MdQuestionAnswer } from 'react-icons/md';
import { FaCalendarAlt, FaUsers, FaHeart, FaClock } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import apiAdminQueryHandle from '../config/apiAdminQueryHandle.js';
import Loader from '../components/Loader';
import axios from 'axios';
import { apiAuthHandle } from '../config/apiAuthHandle.js';


const MainBoard = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [users, setUsers] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all questions
  const handleFetchAllQuestions = async () => {
    try {
      const response = await apiAdminQueryHandle.get('/all');
      // const response = await axios.get('http://localhost:2525/api/admin/quries/all');
      console.log('Questions:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching questions:', error.response?.data || error.message);
      return [];
    }
  };

  // Fetch all answers
  const handleFetchAllAnswers = async () => {
    try {
      const response = await apiAdminQueryHandle.get('/answers');
      // const response = await axios.get('http://localhost:2525/api/admin/quries/answers');
      console.log('Answers:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching answers:', error.response?.data || error.message);
      return [];
    }
  };

  // Fetch all users
  const handleFetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiAuthHandle.get('/getUserData', {
      // const response = await axios.get('http://localhost:2525/api/auth/getAllUser', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Users:', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [questionsRes, answersRes, usersRes] = await Promise.all([
          handleFetchAllQuestions(),
          handleFetchAllAnswers(),
          handleFetchAllUsers()
        ]);

        setQuestions(questionsRes);
        setAnswers(answersRes);
        setUsers(usersRes);
      } catch (error) {
        console.error('Error fetching combined data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const date = new Date(dateObj);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  useEffect(() => {
    if (!loading && questions.length && answers.length && users.length) {
      const mapped = questions.map((q) => {
        const user =
          typeof q.userId === 'object'
            ? q.userId
            : users.find((u) => String(u._id) === String(q.userId));

        const answer = answers.find((a) => a.question && String(a.question._id) === String(q._id));

        const admin =
          answer && typeof answer.adminId === 'object'
            ? answer.adminId
            : answer
              ? users.find((u) => String(u._id) === String(answer.adminId))
              : null;

        const qDate = new Date(q.createdAt);
        const aDate = answer?.createdAt ? new Date(answer.createdAt) : null;

        return {
          id: q._id,
          subject: q.title,
          question: q.description,
          questionDate: qDate.toLocaleDateString(),
          questionTime: qDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          userName: user?.username || 'User',
          userProfile: user?.profileImage || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png',
          answer: answer?.answerText || null,
          adminName: admin?.name || (answer ? 'Admin' : null),
          adminProfile: admin?.profileImage || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png',
          answerDate: aDate?.toLocaleDateString() || null,
          answerTime: aDate
            ? aDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null,
        };
      });

      setQuestionsData(mapped);
    }
  }, [loading, questions, answers, users]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-indigo-600">Q&A Board</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Browse community questions and answers, get help from our support team
          </p>
          {/* Action Buttons */}
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-gray-50  hover:text-indigo-600 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                <BiMessageSquareDetail className="mr-2" />
                Have a question?
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                <IoTrendingUpSharp className="mr-2" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
        {/* Questions Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MdQuestionAnswer className="mr-3 text-indigo-600" />
            Community Q&A
          </h2>
          {/* Questions List */}
          <div className="space-y-6 flex flex-wrap gap-4 items-baseline">
            {loading ? (
              <Loader />
            ) : questionsData.length === 0 ? (
              <div className="text-center w-full py-12 text-lg text-gray-500">No questions found.</div>
            ) : (
              questionsData.map((item) => (
                <div key={item.id} className="w-full md:max-w-xl bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  {/* Question Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.subject}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(item.questionDate)} at {item.questionTime}
                      </div>
                    </div>
                  </div>
                  {/* Chat-style Q&A */}
                  <div className="space-y-4">
                    {/* Question - Right side */}
                    <div className="flex justify-end">
                      <div className="max-w-sm">
                        <div className="bg-indigo-600 text-white p-4 rounded-lg rounded-br-none">
                          <p className="text-sm font-medium mb-2">Question:</p>
                          <p>{item.question}</p>
                        </div>
                        <div className="flex items-center justify-end mt-2">
                          <img src={item.userProfile} alt={item.userName} className="w-6 h-6 rounded-full mr-2" />
                          <span className="text-sm text-gray-600">{item.userName}</span>
                          <IoTimeOutline className="ml-2 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-600">{item.questionTime}</span>
                        </div>
                      </div>
                    </div>
                    {/* Answer - Left side (if exists) */}
                    {item.answer ? (
                      <div className="flex justify-start">
                        <div className="max-w-sm">
                          <div className="bg-gray-100 text-gray-900 p-4 rounded-lg rounded-bl-none border">
                            <p className="text-sm font-medium mb-2 text-green-600">Answer:</p>
                            <p>{item.answer}</p>
                          </div>
                          <div className="flex items-center justify-start mt-2">
                            <img src={item.adminProfile} alt={item.adminName} className="w-6 h-6 rounded-full mr-2" />
                            <span className="text-sm font-medium text-green-600">{item.adminName}</span>
                            <IoTimeOutline className="ml-2 mr-1 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {item.answerDate ? `${formatDate(item.answerDate)} at ${item.answerTime}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start">
                        <div className="max-w-sm">
                          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
                            <p className="text-sm font-medium flex items-center">
                              <FaClock className="mr-2" />
                              Waiting for admin response...
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <SummaryCard icon={<BiMessageSquareDetail className="text-2xl" />} label="Total Questions" value={questionsData.length} color="indigo" />
          <SummaryCard icon={<MdQuestionAnswer className="text-2xl" />} label="Answered" value={questionsData.filter(q => q.answer).length} color="green" />
          <SummaryCard icon={<FaClock className="text-2xl" />} label="Not Answered" value={questionsData.filter(q => !q.answer).length} color="yellow" />
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, label, value, color }) => {
  const bgColor = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }[color];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-4 ${bgColor}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      <p className={`text-3xl font-bold mt-2 ${bgColor.split(' ')[1]}`}>{value}</p>
    </div>
  );
};

export default MainBoard;
