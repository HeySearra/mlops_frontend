import axios from "axios";

const http = axios.create({
    baseURL: '/api/',
    timeout: 10000,
    withCredentials: true,
});

export default http
