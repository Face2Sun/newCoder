import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 获取后台Spring Security传递过来的保存在cookie中的XSRF-TOKEN add by sgy 2019-11-06
// const CSRF_TOKEN = document.cookie.match(new RegExp(`XSRF-TOKEN=([^;]+)`))[1]

// 创建 axios 实例
const service = axios.create({
  // headers: { 'X-XSRF-TOKEN': CSRF_TOKEN },
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    if (error.response.status === 500) {
      notification.error({
        message: error.response.statusText,
        description: error.response.data.message
      })
    }
    console.log(error.response)
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)

  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

// const TEST_ENV = 'http://localhost:9080/system/' // 'http://localhost:8000'

function get (url, params) {
  return new Promise((resolve, reject) => {
    service({
      method: 'GET',
      url,
      params: params
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

function post (url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'POST',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json;'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

function put (url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'PUT',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json;'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

function del (url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'DELETE',
      url,
      data: data,
      headers: {
        'Content-Type': 'application/json;'
      }
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
function downFile (url, parameter) {
  return service({
    url: url,
    params: parameter,
    method: 'get',
    responseType: 'blob'
  })
}

export {
  installer as VueAxios,
  service as axios,
  get,
  post,
  del,
  put,
  downFile
}
