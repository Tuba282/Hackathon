import axios from "axios"

export const baseUrl = `https://server-production-0cde.up.railway.app/api/reviews`

const apiReviewHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiReviewHandle
