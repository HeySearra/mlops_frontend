import axios from "axios";
import router from "./router";



axios.defaults.withcredentials = true;  //允许使用cookie
const http = axios.create({
    baseURL: '/api/',
    timeout: 100000,
    withCredentials: true,
});

// axios.interceptors.request.use((config) => {
//     config.headers['X-Requested-With'] = 'XMLHttpRequest';
//     let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
//     config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
//     return config
//   });

const http_vis = axios.create({
    baseURL: '/vis/',
    timeout: 100000,
    withCredentials: true,
})
http_vis.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'//post请求头的默认设置

// create是创建一个全新的axios，要重新设置。
const http_wang = axios.create({
    baseURL: '/wang/',
    timeout: 1000000,
    withCredentials: true
})
http_wang.defaults.timeout = 200000 //超过10s则请求超时
http_wang.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'//post请求头的默认设置

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

http_wang.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config
  });

// http_wang.interceptors.request.use(config => {
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

const http_zyq = axios.create({
    baseURL: '/zyq/v1/newOntMapping/',
    timeout: 1000000,
    withCredentials: true
})
http_zyq.defaults.timeout = 200000 //超过10s则请求超时
http_zyq.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'//post请求头的默认设置

const http_jbw = axios.create({
    baseURL: '/jbw/',
    timeout: 1000000,
    withCredentials: true
})
http_jbw.defaults.timeout = 200000 //超过10s则请求超时
http_jbw.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'//post请求头的默认设置


export {http, http_wang, http_vis, http_zyq, http_jbw}
