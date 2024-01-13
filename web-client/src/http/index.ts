import axios from 'axios'
import { AuthResponse } from '../models/AuthResponse'

export const API_URL = `http://localhost:5000/api/v1`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    try {
        const originalRequest = error.config

        if (error.response.status === 401) {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response)
            
            localStorage.setItem('token', response.data.accessToken)
            return $api.request(originalRequest)
        }
     } catch (error) {
        console.log(error)
    }
})

export default $api