import Axios from 'axios';

export const api = Axios.create({
    baseURL: 'http://localhost:5260',
    timeout: 8000,
    withCredentials: true
})