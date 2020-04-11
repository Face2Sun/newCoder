import { axios } from '@/utils/request'
import qs from 'qs'

/**
 * 新增项目财务决算信息
 * @param {*} parameter
 */
export function addFinancial (parameter) {
  return axios({
    url: '/tdzz/xmgl/addFinancial',
    method: 'post',
    params: parameter
  })
}

/**
 * 新增巡查信息
 * @param {*} parameter
 */
export function addPatrol (parameter) {
  return axios({
    url: '/tdzz/xmgl/addPatrol',
    method: 'post',
    params: parameter
  })
}

/**
 * 新增项目
 * @param {*} parameter
 */
export function addProject (parameter) {
  return axios({
    url: '/tdzz/xmgl/addProject',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据id删除巡查信息
 * @param parameter
 */
export function deletePatrolById (parameter) {
  return axios({
    url: '/tdzz/xmgl/deletePatrolById/' + parameter,
    method: 'delete'
  })
}

/**
 * 删除项目
 * @param parameter
 */
export function deleteProject (parameter) {
  return axios({
    url: '/tdzz/xmgl/deleteProject/' + parameter,
    method: 'delete'
  })
}

/**
 * 根据id查询项目信息
 * @param parameter
 */
export function findById (parameter) {
  return axios({
    url: '/tdzz/xmgl/findById/' + parameter,
    method: 'post'
  })
}

/**
 * 根据id查询项目财务信息
 * @param parameter
 */
export function findFinancialById (parameter) {
  return axios({
    url: '/tdzz/xmgl/findFinancialById/' + parameter,
    method: 'post'
  })
}

/**
 * 根据id查询巡查信息
 * @param parameter
 */
export function findPatrolById (parameter) {
  return axios({
    url: '/tdzz/xmgl/findPatrolById/',
    method: 'post',
    params: parameter
  })
}

/**
 * 获取项目信息
 * @param {*} parameter
 */
export function getProjectInfo (parameter) {
  return axios({
    url: '/tdzz/xmgl/getProjectInfo?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * 修改项目财务决算信息
 * @param {*} parameter
 */
export function updateProjectFinancial (parameter) {
  return axios({
    url: '/tdzz/xmgl/updateProjectFinancial',
    method: 'put',
    params: parameter
  })
}

/**
 * 修改项目信息
 * @param {*} parameter
 */
export function updateProjectInfo (parameter) {
  return axios({
    url: '/tdzz/xmgl/updateProjectInfo',
    method: 'put',
    params: parameter
  })
}

/**
 * /tdzz/xmgl/updateProjectPatrol
修改项目巡查信息
 * @param {*} parameter
 */
export function updateProjectPatrol (parameter) {
  return axios({
    url: '/tdzz/xmgl/updateProjectPatrol',
    method: 'put',
    params: parameter
  })
}

/**
 * 查询项目所有区域
 * 无参数
 */
export function findProjectQy () {
  return axios({
    url: '/tdzz/xmgl/findProjectQy',
    method: 'post'
  })
}

/**
 * 查询项目状态数量
 * 无参数
 */
export function projectStateNum () {
  return axios({
    url: '/tdzz/xmgl/projectStateNum',
    method: 'post'
  })
}
