import React, { useEffect, useState } from 'react';
import { getToken } from '../../utils/auth.js';
import apiUserQueryHandle from '../../config/apiUserQueryHandle.js';


const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(favs);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    const fetchQuestions = async () => {
      try {
        const res = await apiUserQueryHandle.get('/getMy', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setQuestions((res.data.data || []).filter(q => favorites.includes(q._id)));
        }
      } catch {
        setQuestions([]);
      }
    };
    if (favorites.length > 0) fetchQuestions();
    else setQuestions([]);
  }, [favorites]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Favorite List</h2>
      {questions.length === 0 ? (
        <div className="text-gray-500">No favorites yet.</div>
      ) : (
        questions.map(q => (
          <div key={q._id} className="max-w-lg border px-6 py-4 rounded-lg shadow-sm shadow-yellow-400 my-5">
            <h2 className='text-lg font-semibold my-2'>Subject : {q.title}</h2>
            <p className="text-lg leading-relaxed mb-6"><span className='text-lg font-semibold my-2'>Question : </span>{q.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserFavorites;
