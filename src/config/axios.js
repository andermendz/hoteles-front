import axios from 'axios'

const api = axios.create({
    baseURL: 'https://laravel-production-4b94.up.railway.app/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default api


// http://127.0.0.1:8000/api