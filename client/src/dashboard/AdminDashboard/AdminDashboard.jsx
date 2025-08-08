import { FaUser, FaUsers, FaCube, FaChartLine} from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { MdOutlineQuestionAnswer } from 'react-icons/md';
import { useCallback } from 'react';
import { getUser } from '../../utils/auth';
import apiAdminQueryHandle from '../../config/apiAdminQueryHandle';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { apiAuthHandle } from '../../config/apiAuthHandle';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

const AdminDashboard = () => {
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
    const [answers, setAnswers] = useState([]);

    // Modal state for answering
    const [answerModal, setAnswerModal] = useState(false);
    const [answerForm, setAnswerForm] = useState({ answerText: '', questionId: '' });
    const [answerLoading, setAnswerLoading] = useState(false);
    // Open answer modal for a question
    const openAnswerModal = (questionId) => {
        setAnswerForm({ answerText: '', questionId });
        setAnswerModal(true);
    };

    // Handle answer form change
    const handleAnswerFormChange = (e) => {
        setAnswerForm({ ...answerForm, [e.target.name]: e.target.value });
    };

    // Submit answer to DB
    const handleAddAnswer = async (e) => {
        e.preventDefault();
        setAnswerLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await apiAdminQueryHandle.post(`/answers/${answerForm.questionId}`, {
                answerText: answerForm.answerText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                toast.success(res.data.message || 'Answer added');
                setAnswerModal(false);
                setAnswerForm({ answerText: '', questionId: '' });
                fetchAllQnA();
            } else {
                toast.error(res.data.message || 'Failed to add answer');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to add answer');
        } finally {
            setAnswerLoading(false);
        }
    };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ...existing code for stats cards... */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <FaUsers className="text-blue-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <FaUser className="text-green-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Verified Users</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.verifiedUsers}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100">
                            <FaCube className="text-purple-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Total Work</p>
                            <p className="text-2xl font-bold text-gray-900">+{analytics.totalQuestions}%</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <FaChartLine className="text-yellow-600 text-2xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">Growth</p>
                            <p className="text-2xl font-bold text-gray-900">+{analytics.growth}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Recent Quries</h2>
                <div className="overflow-x-auto flex flex-wrap justify-start gap-4">
                    {questions.length === 0 ? (
                        <div className="text-gray-500">No questions found.</div>
                    ) : (
                        questions.map(q => {
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
                                    {/* Give Answer icon (if not already answered) */}
                                    {!answer && (
                                        <button
                                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-semibold mt-2"
                                            onClick={() => openAnswerModal(q._id)}
                                            title="Give Answer"
                                        >
                                            <MdOutlineQuestionAnswer className="text-lg" /> Give Answer
                                        </button>
                                    )}
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
            {/*get Answer Modal */}
            <Dialog open={answerModal} as="div" className="relative z-10 focus:outline-none" onClose={() => setAnswerModal(false)}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg duration-300 ease-out shadow-sm shadow-black/50"
                        >
                            <DialogTitle as="h3" className="text-lg font-bold text-gray-800 mb-4">
                                Give Answer
                            </DialogTitle>
                            <form onSubmit={handleAddAnswer} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Answer</label>
                                    <textarea
                                        name="answerText"
                                        value={answerForm.answerText}
                                        onChange={handleAnswerFormChange}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                                        onClick={() => setAnswerModal(false)}
                                        disabled={answerLoading}
                                    >Cancel</button>
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                                        disabled={answerLoading}
                                    >{answerLoading ? 'Submitting...' : 'Submit Answer'}</button>
                                </div>
                            </form>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default AdminDashboard;
