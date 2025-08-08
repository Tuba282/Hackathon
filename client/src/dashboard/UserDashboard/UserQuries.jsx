import { useEffect, useState } from 'react';
import { AiOutlineWhatsApp } from "react-icons/ai";
import { FaRegThumbsUp, FaRegShareSquare } from 'react-icons/fa';
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoHandLeft } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';

import { getToken, getUser } from '../../utils/auth.js';
import apiUserQueryHandle from '../../config/apiUserQueryHandle.js';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Loader from '../../components/Loader.jsx';



const UserQuires = () => {
  const currentUser = getUser();
  const token = getToken()
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false)
  let [addQuesModal, setAddQuesModal] = useState(false)
  let [editQuesModal, setEditQuesModal] = useState(false)
  const [editForm, setEditForm] = useState({ _id: '', title: '', description: '' });
  const [editFormLoading, setEditFormLoading] = useState(false);
  // Handle edit form change
  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Open edit modal with question data
  const openEditModal = (q) => {
    setEditForm({ _id: q._id, title: q.title, description: q.description });
    setEditQuesModal(true);
  };

  const handleEditQuestion = async (e) => {
    e.preventDefault();
    setEditFormLoading(true);

    try {
      const res = await apiUserQueryHandle.put(`/update/${editForm._id}`, {
        title: editForm.title,
        description: editForm.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEditQuesModal(false);
        setEditForm({ _id: '', title: '', description: '' });
        toast.success(res.data.message || 'Question updated');
        fetchQuestions();
      } else {
        toast.error(res.data.message || 'Failed to update question');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update question');
    } finally {
      setEditFormLoading(false);
    }
  };
  const [form, setForm] = useState({ title: '', description: '', isPublic: true });
  const [formLoading, setFormLoading] = useState(false);
  // Favorite logic
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });

  const toggleFavorite = (questionId) => {
    let updated;
    if (favorites.includes(questionId)) {
      updated = favorites.filter(id => id !== questionId);
    } else {
      updated = [...favorites, questionId];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Fetch questions function
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await apiUserQueryHandle.get(`/getMy`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setQuestions(res.data.data || []);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await apiUserQueryHandle.post(`/add`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setAddQuesModal(false);
        setForm({ title: '', description: '' });
        toast.success(res.data.message)
        // Refresh questions
        fetchQuestions();
      } else {
        toast.error(res.data.message || 'Failed to add question');
      }
    } catch (err) {
      toast.error('Failed to add question');
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchQuestions();
    // eslint-disable-next-line
  }, [token]);



  // Handle delete question with toast confirmation
  const handleDeleteQuestion = (questionId) => {
    toast((t) => (
      <span>
        Are you sure you want to delete this question?
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await apiUserQueryHandle.delete(`/delete/${questionId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                  toast.success(res.data.message || 'Question deleted');
                  fetchQuestions();
                } else {
                  toast.error(res.data.message || 'Failed to delete question');
                }
              } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to delete question');
              }
            }}
            style={{
              background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            No
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="w-full grid md:flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold mb-4 text-center md:text-start">My Quries</h2>
        <button type="button" onClick={() => setAddQuesModal(true)} className="ml-3 inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">I have a question <IoHandLeft /></button>
      </div>

      {loading ? (
        <Loader />
      ) : questions.length === 0 ? (
        <div className="text-gray-500">No questions found.</div>
      ) : (
        questions.map((q) => (
          <div key={q._id}>
            {/* Question Card */}
            <div className={`max-w-lg border px-6 py-4 rounded-lg shadow-sm shadow-black/50 my-5 ${favorites.includes(q._id) ? 'ring-2 ring-yellow-400' : ''}`}>
              <div className="flex items-center mb-6">
                <img src={currentUser?.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <div className="text-lg font-medium text-gray-800">{currentUser?.name || 'User'}</div>
                  <div className="text-gray-500">{new Date(q.createdAt).toLocaleString()}</div>
                </div>
                {/* Edit button (only for own questions) */}
                <div className="ms-auto flex gap-2">
                  <button
                    type="button"
                    className="ml-2 text-indigo-600 hover:text-indigo-900 text-sm flex items-center gap-1"
                    onClick={() => openEditModal(q)}
                  >
                    <MdModeEdit className="inline" />
                  </button>
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-900 text-sm flex items-center gap-1"
                    onClick={() => handleDeleteQuestion(q._id)}
                  >
                    <MdDelete className="inline" />
                  </button>
                </div>

              </div>
              <h2 className='text-lg font-semibold my-2'>Subject : <span className='font-normal'>{q.title}</span></h2>
              <p className="text-lg leading-relaxed mb-6"><span className='text-lg font-semibold my-2'>Question : </span>{q.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <button
                    type="button"
                    className={`text-gray-500 hover:text-yellow-500 mr-4 focus:outline-none ${favorites.includes(q._id) ? 'text-yellow-500' : ''}`}
                    onClick={() => toggleFavorite(q._id)}
                  >
                    <FaRegThumbsUp className="inline mr-1" /> {favorites.includes(q._id) ? 'Liked' : 'Like'}
                  </button>
                </div>
                <div className="flex items-center">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Question: ${q.title}\n${q.description}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-green-600 flex items-center"
                  >
                    <AiOutlineWhatsApp className="inline mr-1" /> Share
                  </a>
                </div>
              </div>
            </div>
            {/* Answer Card (if answer exists) */}
            {q.answer && (
              <div className="max-w-lg border px-6 ms-auto py-4 rounded-lg shadow-sm shadow-black/50 my-5 bg-green-50">
                <div className="flex items-center mb-6">
                  <img src={q.answer.adminImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <div className="text-lg font-medium text-gray-800">{q.answer.adminName || 'Admin'}</div>
                    <div className="text-gray-500">{new Date(q.answer.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <h2 className='text-lg font-semibold my-2'>Subject : {q.title}</h2>
                <p className="text-lg leading-relaxed mb-6"><span className='text-lg font-semibold my-2'>Answer : </span>{q.answer.answerText}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <a href="#" className="text-gray-500 hover:text-gray-700 mr-4"><FaRegThumbsUp className="inline mr-1" /> Like</a>
                  </div>
                  <div className="flex items-center">
                    <a href="#" className="text-gray-500 hover:text-gray-700"><FaRegShareSquare className="inline mr-1" /> Share</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}



      {/* Ask Question modal */}
      <Dialog open={addQuesModal} as="div" className="relative z-10 focus:outline-none" onClose={() => setAddQuesModal(false)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg duration-300 ease-out  shadow-sm  shadow-black/50"
            >
              <DialogTitle as="h3" className="text-lg font-bold text-gray-800 mb-4">
                Add New Question
              </DialogTitle>
      <form onSubmit={handleAddQuestion} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            rows={4}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleFormChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isPublic" className="text-gray-700 font-medium select-none">
            Make this question public
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            onClick={() => setAddQuesModal(false)}
            disabled={formLoading}
          >Cancel</Button>
          <Button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
            disabled={formLoading}
          >{formLoading ? 'Adding...' : 'Add Question'}</Button>
        </div>
      </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Edit Question modal */}
      <Dialog open={editQuesModal} as="div" className="relative z-10 focus:outline-none" onClose={() => setEditQuesModal(false)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg duration-300 ease-out  shadow-md  shadow-black/50"
            >
              <DialogTitle as="h3" className="text-lg font-bold text-gray-800 mb-4">
                Edit Question
              </DialogTitle>
              <form onSubmit={handleEditQuestion} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                    onClick={() => setEditQuesModal(false)}
                    disabled={editFormLoading}
                  >Cancel</Button>
                  <Button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    disabled={editFormLoading}
                  >{editFormLoading ? 'Updating...' : 'Update Question'}</Button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>




    </div>
  );
};

export default UserQuires;
