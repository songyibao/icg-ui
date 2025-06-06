import axios from 'axios'
import { message } from 'ant-design-vue'

const myAxios = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 1000,
  withCredentials: true,
})

// 添加请求拦截器
// myAxios.interceptors.request.use(
//   function (config) {
//     // 在发送请求之前做些什么
//     return config
//   },
//   function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error)
//   },
// )

// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // 判断data是否存在,不存在则拦截
    if (!data) {
      message.error('服务器异常')
      return response
    }
    if (data.code === 0) {
      return response
    }
    // 未登录
    if (data.code === 40100) {
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !response.request.responseURL.includes('user/login')
      ) {
        message.warning('请先登录！')
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    } else {
      // 展示错误码和错误信息
      message.error(`${data.code}:${data.message}`)
    }
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    message.error('请求异常')
    return Promise.reject(error)
  },
)

export default myAxios
