import axios from "axios";

const http = axios.create({
    baseURL: '/api/',
    timeout: 10000,
    withCredentials: true,
});

const http_wang = axios.create({
    baseURL: '/wang/',
    timeout: 10000,
    withCredentials: true
})

export {http, http_wang}
