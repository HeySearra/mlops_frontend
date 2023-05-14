import axios from "axios";
import router from "./router";



const http = axios.create({
    baseURL: '/api/',
    timeout: 10000,
    withCredentials: true,
});

const http_vis = axios.create({
    baseURL: '/vis/',
    timeout: 10000,
    withCredentials: true,
})
http_vis.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'//post请求头的默认设置

// create是创建一个全新的axios，要重新设置。
const http_wang = axios.create({
    baseURL: '/wang/',
    timeout: 10000,
    withCredentials: true
})
http_wang.defaults.timeout = 10000 //超过10s则请求超时
http_wang.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'//post请求头的默认设置

//响应拦截器
http_wang.interceptors.response.use(
    response => {
        //根据状态码判断是否请求成功，否则返回报错
        console.log(response)
        if(response.status === 200){
            return Promise.resolve(response)
        } else {
            return Promise.reject(response)
        }
    },
    error => {
        if(error.response.status === 401){
            localStorage.setItem('token', null)
            localStorage.setItem('username', "")
            router.push("/login")
        }
        return error
    }
)

// http_wang.interceptors.request.use(
//     config => {
//         //登录注册相关接口不用认证
//         if (config.url.indexOf('/token') === 0||config.url.indexOf('/account') === 0) {
//             return config
//         }
//         if (localStorage.getItem('token')) {
//             const token = localStorage.getItem('token')
//             if (!config.headers) {
//                 config.headers = {}
//             }
//             config.headers.Authorization = `Bearer ${token}`
//         }
//         return config
//     },error => {
//         return Promise.reject(error)
//     }
// )

export {http, http_wang, http_vis}
