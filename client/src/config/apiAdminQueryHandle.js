import axios from "axios";

// export const baseUrl = `https://ques-ans-backend.vercel.app/api/admin/quries`;
export const baseUrl = `http://localhost:2525/api/admin/quries`;

const apiAdminQueryHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiAdminQueryHandle;
