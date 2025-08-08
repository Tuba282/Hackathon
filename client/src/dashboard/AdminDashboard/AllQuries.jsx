import { FaUser, FaUsers, FaCube, FaChartLine} from 'react-icons/fa';
import {MdDelete } from 'react-icons/md';
import { useCallback } from 'react';
import { getUser } from '../../utils/auth';
import apiAdminQueryHandle from '../../config/apiAdminQueryHandle';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { apiAuthHandle } from '../../config/apiAuthHandle';

const AllQuries = () => {
    const currentUser = getUser()
    const [users, setUsers] = useState([]);



    useEffect(() => {
        if (currentUser.role === 'admin') {
            getStats();
            fetchAllQnA();
            getUsersData()
        }
    }, [currentUser.role]);


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
            console.log(analytics);

        } catch (error) {
            console.error("Error fetching stats:", error?.response?.data || error.message);
            toast.error("Failed to fetch stats");
        }
    };


    const [questions, setQuestions] = useState([]);
    const recentQuestions = questions.slice(-5)
    const [answers, setAnswers] = useState([]);

    // Fetch all questions and answers for admin
    const fetchAllQnA = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const qRes = await apiAdminQueryHandle.get('/all', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (qRes.data.success) setQuestions(qRes.data.data || []);
            const aRes = await apiAdminQueryHandle.get('/answers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (aRes.data.success) setAnswers(aRes.data.data || []);
        } catch (err) {
            toast.error('Failed to fetch all questions/answers');
        }
    }, []);


    // Handle delete answer with confirmation for delete
    const handleDeleteAnswer = async (answerId) => {
        toast((t) => (
            <span>
                Are you sure you want to delete this answer?
                <div className="mt-2 flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const token = localStorage.getItem('token');
                                const res = await apiAdminQueryHandle.delete(`/answers/${answerId}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                if (res.data.success) {
                                    toast.success(res.data.message || 'Answer deleted');
                                    fetchAllQnA();
                                } else {
                                    toast.error(res.data.message || 'Failed to delete answer');
                                }
                            } catch (err) {
                                toast.error(err?.response?.data?.message || 'Failed to delete answer');
                            }
                        }}
                    >Yes, Delete</button>
                    <button
                        className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-xs hover:bg-gray-300"
                        onClick={() => toast.dismiss(t.id)}
                    >Cancel</button>
                </div>
            </span>
        ), { duration: 8000 });
    };

    return (
        <div className="space-y-6">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Recent Quries</h2>
                <div className="overflow-x-auto flex flex-wrap justify-start gap-4">
                    {recentQuestions.length === 0 ? (
                        <div className="text-gray-500">No questions found.</div>
                    ) : (
                        recentQuestions.map(q => {
                            // Find user for this question
                            let user = null;
                            if (q.userId && typeof q.userId === 'object' && q.userId._id) {
                                user = users.find(u => String(u._id) === String(q.userId._id));
                            } else {
                                user = users.find(u => String(u._id) === String(q.userId));
                            }
                            // Find answer for this question (if any)
                            const answer = answers.find(a => a.question && a.question._id === q._id);
                            return (
                                <div key={q._id} className="max-w-lg border px-6 py-4 rounded-lg shadow-sm shadow-black/50 my-5">
                                    <div className="flex items-center mb-6">
                                        <img src={user?.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <div className="text-lg font-medium text-gray-800">{user?.name || 'User'}</div>
                                            <div className="text-gray-500">{new Date(q.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <h2 className='text-lg font-semibold my-2'>Subject : <span className='font-normal'>{q.title}</span></h2>
                                    <p className="text-lg leading-relaxed mb-6"><span className='text-lg font-semibold my-2'>Question : </span>{q.description}</p>
                                    {answer && (
                                        <div className="max-w-lg border px-6 ms-auto py-4 rounded-lg shadow-sm shadow-black/50 my-5 bg-indigo-500">
                                            <div className="flex items-center mb-6">
                                                <div className="text-lg font-medium text-white">{answer.adminId?.name || 'Admin'}</div>
                                                <div className="text-white/50 ml-4">{new Date(answer.createdAt).toLocaleString()}</div>
                                                <div className="ms-auto flex gap-2">

                                                    <button className="text-white hover:text-red-900 text-sm flex items-center gap-1" title="Delete Answer" onClick={() => handleDeleteAnswer(answer._id)}>
                                                        <MdDelete className="inline text-lg" />
                                                    </button>
                                                </div>
                                            </div>
                                            <h2 className='text-lg text-white  font-semibold my-2'>Subject : <span className='font-nornal text-white/50'>{q.title}</span> </h2>
                                            <p className="text-lg  text-white leading-relaxed mb-6"><span className='text-lg font-semibold my-2 '>Answer : </span> <span className='text-white/50'> {answer.answerText}</span></p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default AllQuries