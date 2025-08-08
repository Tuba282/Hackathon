import axios from "axios"


// export const baseUrl = `http://localhost:2525/api/upload`
export const baseUrl = `https://server-production-e88c.up.railway.app/api/upload`


const apiUploadHandle = axios.create({
    baseURL: baseUrl,
    // Do NOT set Content-Type for file uploads; let browser/axios set it automatically
})

export default apiUploadHandle