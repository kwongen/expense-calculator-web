import axios from 'axios';

const AxiosInstance = axios.create ({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 5000,
    headers: {'Content-Type' : 'application/json'},
    withCredentials: true,
});

export default AxiosInstance;