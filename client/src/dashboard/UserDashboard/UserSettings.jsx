import React from 'react';

const UserSettings = ({ updateUser, updateImage, handleUserSettingsChange, handleImageChange, handleUpdateProfile, handleLogout, currentUser }) => (
  <form className="space-y-8 container mx-auto divide-y divide-gray-200 px-2 py-4 sm:px-4 md:px-8 lg:px-10 w-full max-w-2xl" onSubmit={handleUpdateProfile}>
    {console.log(updateUser.description)}
    <div className="space-y-8 divide-y divide-gray-200">
      <div className="">
        <div>
          <h3 className="text-3xl leading-6 font-medium text-gray-900">Profile</h3>
          <p className="mt-1 text-sm text-gray-500">This information will be displayed publicly so be careful what you share.</p>
        </div>
        <div className="mt-6 flex flex-col gap-6">
          {/* user name and email */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700"> User Name </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input type="text" name="username" id="username" placeholder="Enter name ..." className="shadow-sm p-2 text-lg outline-none block w-full sm:text-sm border border-gray-300 rounded-md" value={updateUser.username} onChange={handleUserSettingsChange} />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="useremail" className="block text-sm font-medium text-gray-700"> User Email </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input type="email" name="useremail" id="useremail" placeholder="Enter email ..." autoComplete="useremail" className="shadow-sm p-2 text-lg outline-none block w-full sm:text-sm border border-gray-300 rounded-md" value={updateUser.useremail} onChange={handleUserSettingsChange} />
              </div>
            </div>
          </div>
          {/* user links */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700"> Linkedin </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input type="text" name="linkedin" id="linkedin" placeholder="Enter linkedin link ..." className="shadow-sm p-2 text-lg outline-none block w-full sm:text-sm border border-gray-300 rounded-md" value={updateUser.linkedin} onChange={handleUserSettingsChange} />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700"> Portfolio </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input type="text" name="portfolio" id="portfolio" placeholder="Enter Portfolio live url ..." className="shadow-sm p-2 text-lg outline-none block w-full sm:text-sm border border-gray-300 rounded-md" value={updateUser.portfolio} onChange={handleUserSettingsChange} />
              </div>
            </div>
          </div>
          {/* user links */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col">
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700"> Instagram </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input type="text" name="instagram" id="instagram" placeholder="Enter Instagram Link ..." className="shadow-sm p-2 text-lg outline-none block w-full sm:text-sm border border-gray-300 rounded-md" value={updateUser.instagram} onChange={handleUserSettingsChange} />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label htmlFor="github" className="block text-sm font-medium text-gray-700"> Github </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input type="text" name="github" id="github" placeholder="Enter Github url ..." className="shadow-sm p-2 text-lg outline-none block w-full sm:text-sm border border-gray-300 rounded-md" value={updateUser.github} onChange={handleUserSettingsChange} />
              </div>
            </div>
          </div>
          {/* <div className="flex flex-col">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700"> Bio </label>
            <div className="mt-1">
              <textarea id="description" name="description" rows="3" placeholder="Write a few sentences about yourself." className="shadow-sm p-2 text-lg outline-none block w-full sm:text-sm border border-gray-300 rounded-md" value={updateUser.description} onChange={handleUserSettingsChange}></textarea>
            </div>
          </div> */}
          <div className="flex flex-col">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700"> Photo </label>
            <div className="mt-1 flex items-center">
              <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                <input type="file" name="image" ref={updateImage} className='hidden' onChange={handleImageChange} />
                <img onClick={() => { updateImage.current.click() }} src={currentUser.avatar || 'https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg'} alt="" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="pt-5 w-full">
      <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
        <button type="button" onClick={handleLogout} className="w-full sm:w-auto ml-0 sm:ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Log Out</button>
        <button type="submit" className="w-full sm:w-auto ml-0 sm:ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Updates</button>
      </div>
    </div>
  </form>
);

export default UserSettings;
