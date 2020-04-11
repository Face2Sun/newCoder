import { axios } from '@/utils/request'

/**
 * 根据bsznid查询办事指南
 * @param parameter
 */
export function findXzsxBsznByBsznid (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/findXzsxBsznByBsznid/' + parameter,
    method: 'get'
  })
}

/**
 * 根据code查询办事指南
 * @param parameter
 */
export function findXzsxBsznListByBsznCode (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/findXzsxBsznListByCode',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据code查询办事指南
 * @param parameter
 */
export function updateXzsxBszn (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/updateXzsxBszn',
    method: 'put',
    params: parameter
  })
}

/**
 * 根据code和bssx查询办事指南
 * @param parameter
 */
export function findXzsxBsznListLikeBssxAndCode (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/findXzsxBsznListLikeBssxAndCode',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据bsznid查询基本信息
 * @param parameter
 */
export function findXzsxJbxxListByBsznid (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/jbxx/findXzsxJbxxByBsznid/' + parameter,
    method: 'get'
  })
}

/**
 * 修改基本信息
 * @param parameter
 */
export function updateXzsxJbxx (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/jbxx/updateXzsxJbxx',
    method: 'put',
    params: parameter
  })
}

/**
 * 新增基本信息
 * @param parameter
 */
export function addXzsxJbxx (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/jbxx/addXzsxJbxx',
    method: 'post',
    params: parameter
  })
}

/**
 * 根据bsznid查询办理材料
 * @param parameter
 */
export function findXzsxBlclListByBsznid (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/blcl/findXzsxBlclListByBsznid',
    method: 'post',
    params: parameter
  })
}

/**
 * 增加新的办理材料
 * @param parameter
 */
export function addXzsxBlcl (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/blcl/addXzsxBlcl',
    method: 'post',
    params: parameter
  })
}

/**
 * 增加新的办理材料
 * @param parameter
 */
export function updateXzsxBlcl (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/blcl/updateXzsxBlcl',
    method: 'put',
    params: parameter
  })
}

/**
 * 通过clmuid删除办理材料
 * @param parameter
 */
export function deteleXzsxBlclByclmuid (parameter) {
  return axios({
    url: '/xxgkzx/xzsx/blcl/deteleXzsxBlclByclmuid/' + parameter,
    method: 'delete'
  })
}
