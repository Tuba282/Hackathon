import axios from "axios"

// export const baseUrl = `https://ques-ans-backend.vercel.app/api/styles`
export const baseUrl = `https://server-production-0cde.up.railway.app/api/styles`
// export const baseUrl = `http://localhost:2525/api/styles`

const apiHijabStyleHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiHijabStyleHandle
