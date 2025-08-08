import React from 'react';
import { FaRegThumbsUp } from 'react-icons/fa';

const UserFavorites = ({ hijabiStyles, favorites }) => {
  const favoriteStyles = hijabiStyles.filter(style => favorites.includes(style._id));
  if (!favoriteStyles.length) {
    return <div className="text-gray-500">No favorite hijabi styles yet.</div>;
  }
  return (
    <div className="flex flex-wrap gap-4">
      {favoriteStyles.map(style => (
        <div key={style._id} className="max-w-lg border px-6 py-4 rounded-lg shadow-sm shadow-black/50 my-5">
          <img src={style.image} className='w-full rounded-t h-[300px]' alt={style.name} />
          <div className="flex items-center mb-6 mt-2">
            <div>
              <div className="text-lg font-medium text-gray-800">{style.name}</div>
              <div className="text-gray-500">{new Date(style.createdAt).toLocaleString()}</div>
            </div>
          </div>
          <h2 className='text-lg font-semibold my-2'>Name: <span className='font-normal'>{style.name}</span></h2>
          <p className="text-lg leading-relaxed mb-6">
            <span className='text-lg font-semibold my-2'>Description: </span>{style.description}
          </p>
          <div className="flex items-center">
            <FaRegThumbsUp className="inline mr-1 text-yellow-500" /> Favorite
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserFavorites;
