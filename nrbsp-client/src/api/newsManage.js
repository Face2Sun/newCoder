import { axios } from '@/utils/request'

/**
 * 保存新闻信息草稿与直接发布
 * @param {*} parameter
 */
export function addInformation (parameter) {
  return axios({
    url: '/xxgkzx/xwgl/addInformation',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据id删除新闻
 * @param parameter
 */
export function deleteInformationById (parameter) {
  return axios({
    url: '/xxgkzx/xwgl/deleteInformationById/' + parameter,
    method: 'delete'
  })
}

/**
 * 根据标题分页
 * @param {*} parameter
 */
export function findAll (parameter) {
  return axios({
    url: '/xxgkzx/xwgl/findAll',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据id查询新闻信息
 * @param {*} parameter
 */
export function findById (parameter) {
  return axios({
    url: '/xxgkzx/xwgl/findById/' + parameter,
    method: 'post'
  })
}

/**
 * 根据二级栏目名称查询新闻
 * @param {*} parameter
 */
export function findInformation (parameter) {
  return axios({
    url: '/xxgkzx/xwgl/findInformation',
    method: 'post',
    params: parameter
  })
}

/**
 * 修改新闻信息
 * @param {*} parameter
 */
export function updateInformation (parameter) {
  return axios({
    url: '/xxgkzx/xwgl/updateInformation',
    method: 'put',
    params: parameter
  })
}
