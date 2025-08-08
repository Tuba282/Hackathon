import { useEffect, useState } from 'react';
import { AiOutlineWhatsApp } from "react-icons/ai";
import { BiMessageSquareDetail } from 'react-icons/bi';
import { FaRegThumbsUp, FaRegShareSquare } from 'react-icons/fa';
import { MdDelete, MdModeEdit } from "react-icons/md";
import { IoHandLeft } from "react-icons/io5";
import toast, { Toaster } from 'react-hot-toast';

import { getToken, getUser } from '../../utils/auth.js';
import apiUserQueryHandle from '../../config/apiUserQueryHandle.js';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Loader from '../../components/Loader.jsx';
import apiHijabStyleHandle from '../../config/apiHijabStyleHandle.js';
import apiUploadHandle from '../../config/apiUploadHandle.js';
import apiAdminQueryHandle from '../../config/apiAdminQueryHandle.js';
import apiReviewHandle from '../../config/apiReviewHandle.js';
import axios from 'axios';
import UserFavorites from './UserFavorites';



const UserQuires = () => {
  const currentUser = getUser();
  const token = getToken()
  const [hijabiStyles, setHijabiStyles] = useState([]);
  const [loading, setLoading] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false);
  let [addHijabiModal, setAddHijabiModal] = useState(false)
  let [editHijabiModal, setEditHijabiModal] = useState(false)
  const [editHijabiForm, setEditHijabiForm] = useState({ _id: '', name: '', description: '', image: '' });
  const [editHijabiFormLoading, setEditHijabiFormLoading] = useState(false);
  // Handle edit form change
  const handleEditHijabiFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setEditHijabiForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setEditHijabiForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Open edit modal with hijabi style data
  const openEditHijabiModal = (style) => {
    setEditHijabiForm({ _id: style._id, name: style.name, description: style.description, image: '' });
    setEditHijabiModal(true);
  };

  const handleEditHijabiStyle = async (e) => {
    e.preventDefault();
    setEditHijabiFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', editHijabiForm.name);
      formData.append('description', editHijabiForm.description);
      if (editHijabiForm.image) {
        formData.append('image', editHijabiForm.image);
      }
      // Replace with your hijab style update API endpoint
      const res = await apiUserQueryHandle.put(`/hijab-styles/update/${editHijabiForm._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setEditHijabiModal(false);
        setEditHijabiForm({ _id: '', name: '', description: '', image: '' });
        toast.success(res.data.message || 'Hijabi style updated');
        // Optionally refresh hijabi styles list here
      } else {
        toast.error(res.data.message || 'Failed to update hijabi style');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update hijabi style');
    } finally {
      setEditHijabiFormLoading(false);
    }
  };
  // Hijabi style form state
  const [hijabiForm, setHijabiForm] = useState({ name: '', description: '', image: '' });
  const [hijabiFormLoading, setHijabiFormLoading] = useState(false);
  // Favorite logic
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });

  const toggleFavorite = (styleId) => {
    let updated;
    if (favorites.includes(styleId)) {
      updated = favorites.filter(id => id !== styleId);
    } else {
      updated = [...favorites, styleId];
    }
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  // Add Review logic
  // Review modal and logic
  const [addReviewModal, setAddReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch reviews for a hijabi style
  const fetchReviews = async (styleId) => {
    setReviewsLoading(true);
    try {
      const res = await apiReviewHandle.get(`/${styleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReviews(res.data.data || []);
      } else {
        setReviews([]);
      }
    } catch (err) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const openAddReviewModal = (styleId) => {
    setSelectedStyleId(styleId);
    setAddReviewModal(true);
    setReviewText('');
    fetchReviews(styleId);
  };
  const [allReviews, setAllReviews] = useState([]);

  // Fetch all reviews for a specific styleId (or all if not provided)
  const fetchAllReviews = async (styleId = "") => {
    try {
      const token = localStorage.getItem('token');
      let url = 'http://localhost:2525/api/reviews';
      if (styleId) {
        url += `/${styleId}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAllReviews(response.data.data);
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching allReviews:', error.response?.data || error.message);
      return [];
    }
  };

  // Edit review
  const handleEditReview = async (reviewId, newText, newRating) => {
    try {
      const res = await apiReviewHandle.put(`/edit/${reviewId}`, { text: newText, rating: newRating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Review updated');
        fetchAllReviews();
      } else {
        toast.error(res.data.message || 'Failed to update review');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update review');
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await apiReviewHandle.delete(`/delete/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Review deleted');
        fetchAllReviews();
      } else {
        toast.error(res.data.message || 'Failed to delete review');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete review');
    }
  };
  
  const handleAddReview = async () => {
    try {
      const res = await apiReviewHandle.post(`/${style._id}`, {
        rating,
        text: reviewText,
      });

      if (res.data.success) {
        setReviews((prev) => [...prev, res.data.review]); // naya review add karo
        setRating(0);
        setReviewText("");
      }
    } catch (error) {
      console.log(error);
    }
  };


  // Handle hijabi style form input change
  const handleHijabiFormChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      // Upload image to upload API and save URL in hijabiForm.image
      const file = files[0];
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await apiUploadHandle.post('/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        if (res.data.success && res.data.url) {
          setHijabiForm((prev) => ({ ...prev, image: res.data.url }));
          toast.success('Image uploaded!');
        } else {
          toast.error(res.data.message || 'Image upload failed');
        }
      } catch (err) {
        toast.error('Image upload failed');
      }
    } else {
      setHijabiForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Fetch hijabi styles function
  // Fetch only current user's hijabi styles
  const fetchHijabiStyles = async () => {
    setLoading(true);
    try {
      const res = await apiHijabStyleHandle.get(`/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setHijabiStyles(res?.data?.data || []);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch hijabi styles');
    } finally {
      setLoading(false);
    }
  };

  // Handle hijabi style form submit
  const handleAddHijabiStyle = async (e) => {
    e.preventDefault();
    setHijabiFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', hijabiForm.name);
      formData.append('description', hijabiForm.description);
      if (hijabiForm.image) {
        formData.append('image', hijabiForm.image);
      }
      const res = await apiHijabStyleHandle.post(`/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setAddHijabiModal(false);
        setHijabiForm({ name: '', description: '', image: '' });
        toast.success(res.data.message || 'Hijabi style added');
        // Optionally refresh hijabi styles list here
      } else {
        toast.error(res.data.message || 'Failed to add hijabi style');
      }
    } catch (err) {
      toast.error('Failed to add hijabi style');
    } finally {
      setHijabiFormLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHijabiStyles();
    fetchAllReviews()
    // eslint-disable-next-line
  }, [token]);



  // Handle delete hijabi style with toast confirmation
  const handleDeleteHijabiStyle = (styleId) => {
    toast((t) => (
      <span>
        Are you sure you want to delete this hijabi style?
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await apiHijabStyleHandle.delete(`/delete/${styleId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                  toast.success(res.data.message || 'Hijabi style deleted');
                  fetchHijabiStyles();
                } else {
                  toast.error(res.data.message || 'Failed to delete hijabi style');
                }
              } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to delete hijabi style');
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

  const handleAddReviewForStyle = async (styleId, text, rating) => {
    if (!text.trim() || !rating) {
      toast.error("Please write review and select rating");
      return;
    }
    try {
      const res = await apiReviewHandle.post(`/${styleId}`, { text, rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Review added");
        fetchHijabiStyles(); // refresh list with new review
      } else {
        toast.error(res.data.message || "Failed to add review");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error adding review");
    }
  };


  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="w-full grid md:flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold mb-4 text-center md:text-start"> Collection</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFavorites(false)}
            className={`inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${!showFavorites ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-indigo-700 focus:outline-none`}
          >All Styles</button>
          <button
            type="button"
            onClick={() => setShowFavorites(true)}
            className={`inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${showFavorites ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-indigo-700 focus:outline-none`}
          >Favorites</button>
          <button type="button" onClick={() => setAddHijabiModal(true)} className="ml-3 inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Hijabi Style <IoHandLeft /></button>
        </div>
      </div>

      <div className="flex justify-start itmes-center gap-4 flex-wrap">
        {loading ? (
          <Loader />
        ) : showFavorites ? (
          <UserFavorites hijabiStyles={hijabiStyles} favorites={favorites} />
        ) : hijabiStyles.length === 0 ? (
          <div className="text-gray-500">No hijabi styles found.</div>
        ) : (
          hijabiStyles.map((style) => (
            // ...existing code for each style card...
            <div key={style._id} className="max-w-lg border px-6 py-4 rounded-lg shadow-sm shadow-black/50 my-5">
              <img src={style.image} className='w-full rounded-t h-[300px]' />
              <div className="flex items-center mb-6 mt-2">
                <img
                  src={currentUser?.profileImage || "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="text-lg font-medium text-gray-800">{currentUser?.name || 'User'}</div>
                  <div className="text-gray-500">{new Date(style.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <h2 className='text-lg font-semibold my-2'>Name: <span className='font-normal'>{style.name}</span></h2>
              <p className="text-lg leading-relaxed mb-6">
                <span className='text-lg font-semibold my-2'>Description: </span>{style.description}
              </p>
              {/* Like Button */}
              <button
                type="button"
                className={`text-gray-500 hover:text-yellow-500 mr-4 focus:outline-none ${favorites.includes(style._id) ? 'text-yellow-500' : ''}`}
                onClick={() => toggleFavorite(style._id)}
              >
                <FaRegThumbsUp className="inline mr-1" /> {favorites.includes(style._id) ? 'Liked' : 'Like'}
              </button>
              {/* ...existing review section and form... */}
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Reviews</h4>
                {(() => {
                  const styleReviews = allReviews.filter(
                    (review) => review.hijabStyle === style._id
                  );
                  return styleReviews.length === 0 ? (
                    <div className="text-gray-500 text-sm">No reviews yet.</div>
                  ) : (
                    <div>
                      {styleReviews.map((rev) => (
                        <div key={rev._id} className="review flex items-center gap-2">
                          <strong>{rev.rating}⭐</strong>
                          <p className="flex-1">{rev.text}</p>
                          {/* Edit and Delete buttons for review */}
                          <button
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => {
                              const newText = prompt('Edit review text:', rev.text);
                              const newRating = prompt('Edit rating (1-5):', rev.rating);
                              if (newText && newRating) handleEditReview(rev._id, newText, Number(newRating));
                            }}
                          >Edit</button>
                          <button
                            className="text-xs text-red-600 hover:underline"
                            onClick={() => {
                              if (window.confirm('Delete this review?')) handleDeleteReview(rev._id);
                            }}
                          >Delete</button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                {/* Add Review Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddReviewForStyle(style._id, e.target.review.value, e.target.rating.value);
                    e.target.reset();
                  }}
                  className="mt-3 space-y-2"
                >
                  <textarea
                    name="review"
                    placeholder="Write your review..."
                    className="w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                  <select name="rating" className="border rounded px-2 py-1 text-sm" required>
                    <option value="">Rating</option>
                    <option value="1">⭐ 1</option>
                    <option value="2">⭐ 2</option>
                    <option value="3">⭐ 3</option>
                    <option value="4">⭐ 4</option>
                    <option value="5">⭐ 5</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    Add Review
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>




      {/* Add Hijabi Style Modal */}
      <Dialog open={addHijabiModal} as="div" className="relative z-10 focus:outline-none" onClose={() => setAddHijabiModal(false)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg duration-300 ease-out  shadow-sm  shadow-black/50"
            >
              <DialogTitle as="h3" className="text-lg font-bold text-gray-800 mb-4">
                Add Hijabi Style
              </DialogTitle>
              <form onSubmit={handleAddHijabiStyle} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={hijabiForm.name}
                    onChange={handleHijabiFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={hijabiForm.description}
                    onChange={handleHijabiFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleHijabiFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                    onClick={() => setAddHijabiModal(false)}
                    disabled={hijabiFormLoading}
                  >Cancel</Button>
                  <Button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    disabled={hijabiFormLoading}
                  >{hijabiFormLoading ? 'Adding...' : 'Add Hijabi Style'}</Button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Edit Hijabi Style Modal */}
      <Dialog open={editHijabiModal} as="div" className="relative z-10 focus:outline-none" onClose={() => setEditHijabiModal(false)}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg duration-300 ease-out  shadow-md  shadow-black/50"
            >
              <DialogTitle as="h3" className="text-lg font-bold text-gray-800 mb-4">
                Edit Hijabi Style
              </DialogTitle>
              <form onSubmit={handleEditHijabiStyle} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editHijabiForm.name}
                    onChange={handleEditHijabiFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editHijabiForm.description}
                    onChange={handleEditHijabiFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Image (leave blank to keep old)</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleEditHijabiFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                    onClick={() => setEditHijabiModal(false)}
                    disabled={editHijabiFormLoading}
                  >Cancel</Button>
                  <Button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
                    disabled={editHijabiFormLoading}
                  >{editHijabiFormLoading ? 'Updating...' : 'Update Hijabi Style'}</Button>
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
