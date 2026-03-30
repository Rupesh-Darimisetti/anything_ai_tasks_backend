import axios from 'axios';

const baseURL = process.env.REACT_APP_API || 'http://localhost:5000/api/v1';
const API = axios.create({ baseURL });

// Automatically attach JWT to every request.
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req;
})

export const register = (data) => API.post('/auth/register', data);
export const login = (formData) => API.post('/auth/login', formData);

export const fetchTasks = () => API.get('/tasks');
export const fetchTask = (id) => API.get(`/tasks/${id}`);
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);