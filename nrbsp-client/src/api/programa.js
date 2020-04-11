import { axios } from '@/utils/request'

/**
 * 添加一级类
 * @param {*} parameter
 */
export function addFirst (parameter) {
  return axios({
    url: '/xxgkzx/lmflgl/addFirst',
    method: 'post',
    params: parameter
  })
}

/**
 * 添加子类
 * @param {*} parameter
 */
export function addSecond (parameter) {
  return axios({
    url: '/xxgkzx/lmflgl/addSecond',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据id删除栏目
 * @param parameter
 */
export function deleteInformationById (parameter) {
  return axios({
    url: '/xxgkzx/lmflgl/deleteInformationById/' + parameter,
    method: 'delete'
  })
}

/**
 * 根据条件查询新闻栏目及其子类
 * @param {*} parameter
 */
export function findAll (parameter) {
  return axios({
    url: '/xxgkzx/lmflgl/findAll',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据id查询新闻栏目信息
 * @param parameter
 */
export function findById (parameter) {
  return axios({
    url: '/xxgkzx/lmflgl/findById/' + parameter,
    method: 'post'
  })
}

/**
 * 修改新闻栏目信息
 * @param {*} parameter
 */
export function updateInformation (parameter) {
  return axios({
    url: '/xxgkzx/lmflgl/updateInformation',
    method: 'put',
    params: parameter
  })
}
