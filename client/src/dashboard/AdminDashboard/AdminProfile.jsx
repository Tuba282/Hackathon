import React from 'react';
import { AiOutlineLinkedin } from 'react-icons/ai';
import { MdOutlineAlternateEmail } from 'react-icons/md';
import { TbBrandGithub } from 'react-icons/tb';
import { FaInstagram } from 'react-icons/fa';

const AdminProfile = ({ currentUser }) => (
  <div className="w-full flex items-center justify-center dark:bg-gray-900">
    <div className="relative w-full max-w-2xl my-8 md:my-16 flex flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6 px-4 py-8 border-2 border-dashed border-gray-400 dark:border-gray-400 shadow-lg rounded-lg">
      <span className="absolute text-xs font-medium top-0 left-0 rounded-br-lg rounded-tl-lg px-2 py-1 bg-primary-100 dark:bg-gray-900 dark:text-gray-300 border-gray-400 dark:border-gray-400 border-b-2 border-r-2 border-dashed ">
        profile {currentUser.isVerified ? 'Verified' : 'Not verified'}
      </span>
      <div className="w-full flex justify-center sm:justify-start sm:w-auto">
        <img className="object-cover w-20 h-20 mt-3 mr-3 rounded-full" src={currentUser.profileImage || 'https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png'} alt="Profile" />
      </div>
      <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
        <p className="font-display text-2xl font-semibold dark:text-gray-200" itemProp="author">
          {currentUser.name}
        </p>
        <div className="text-gray-400">
          <p>{currentUser.email}</p>
        </div>
        <div className="my-4 md:text-lg text-gray-400">
          <p>{currentUser.field || 'Computer Science Field'}</p>
        </div>
        <div className="mb-4 md:text-lg text-gray-400">
          <p>{currentUser.description || 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio, aut.'}</p>
        </div>
        <div className="flex gap-4">
          <a title="LinkedIn" href={currentUser.linkedin} target="_blank" rel="noopener noreferrer">
            <AiOutlineLinkedin className="text-2xl font-bold" />
          </a>
          <a title="Portfolio" href={currentUser.portfolio} target="_blank" rel="noopener noreferrer">
            <MdOutlineAlternateEmail className="text-2xl" />
          </a>
          <a title="GitHub" href={currentUser.github} target="_blank" rel="noopener noreferrer">
            <TbBrandGithub className="text-2xl" />
          </a>
          <a title="Instagram" href={currentUser.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default AdminProfile;
