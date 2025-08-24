import axios from "axios"

export const baseUrl = `https://hackathon-server-production-a489.up.railway.app/api/reviews`

const apiReviewHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiReviewHandle
