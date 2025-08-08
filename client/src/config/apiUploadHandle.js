import axios from "axios"

// export const baseUrl = `https://ques-ans-backend.vercel.app/api/upload`
export const baseUrl = `http://localhost:2525/api/upload`

const apiUploadHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiUploadHandle