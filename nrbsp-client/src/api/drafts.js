import { axios } from '@/utils/request'

/**
 * 根据id删除新闻草稿
 * @param parameter
 */
export function deleteInformationById (parameter) {
  return axios({
    url: '/xxgkzx/cgx/deleteInformationById/' + parameter,
    method: 'delete'
  })
}

/**
 * 根据标题查询新闻
 * @param {*} parameter
 */
export function findAll (parameter) {
  return axios({
    url: '/xxgkzx/cgx/findAll',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据id查询新闻草稿信息
 * @param {*} parameter
 */
export function findById (parameter) {
  return axios({
    url: '/xxgkzx/cgx/findById/' + parameter,
    method: 'post'
  })
}

/**
 * 修改新闻草稿信息
 * @param {*} parameter
 */
export function updateInformation (parameter) {
  return axios({
    url: '/xxgkzx/cgx/updateInformation',
    method: 'put',
    params: parameter
  })
}
