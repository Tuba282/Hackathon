import axios from "axios"

// export const baseUrl = `https://ques-ans-backend.vercel.app/api/styles`
export const baseUrl = `https://hackathon-server-production-a489.up.railway.app/api/styles`
// export const baseUrl = `http://localhost:2525/api/styles`

const apiHijabStyleHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiHijabStyleHandle
