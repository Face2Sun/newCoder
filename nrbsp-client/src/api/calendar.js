import { axios } from '@/utils/request'

/**
 * 添加日程信息
 * @param {*} parameter
 */
export function addDateCanlendar (parameter) {
  return axios({
    url: '/dateCanlendar/addDateCanlendar',
    method: 'post',
    params: parameter
  })
}

/**
 * 查询所有日程
 * @param {*} parameter
 */
export function findAll (parameter) {
  return axios({
    url: '/dateCanlendar/findAll',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据日期详细查询当天日程
 * @param {*} parameter
 */
export function findByDate (parameter) {
  return axios({
    url: '/dateCanlendar/findByDate/' + parameter,
    method: 'post'
  })
}

/**
 * 修改日程信息
 * @param {*} parameter
 */
export function updateDateCanlendar (parameter) {
  return axios({
    url: '/dateCanlendar/updateDateCanlendar',
    method: 'put',
    params: parameter
  })
}

/**
 * 根据id删除日程
 * @param {*} parameter
 */
export function deleteDateCanlendar (parameter) {
  return axios({
    url: '/dateCanlendar/deleteDateCanlendar/' + parameter,
    method: 'delete'
  })
}
