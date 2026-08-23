import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'https://my-backend.onrender.com',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
