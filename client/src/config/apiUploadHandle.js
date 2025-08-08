import axios from "axios"


// export const baseUrl = `http://localhost:2525/api/upload`
export const baseUrl = `https://server-production-e88c.up.railway.app/api/upload`


// Use axios instance for baseURL, but do not set Content-Type globally
const apiUploadHandle = axios.create({
    baseURL: baseUrl
});

// Helper for uploading a file (FormData)
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // No need to set Content-Type, browser/axios will handle it
    return apiUploadHandle.post('/', formData);
};

export default apiUploadHandle;