import { axios } from '@/utils/request'
import qs from 'qs'

/**
 * tdzz-m002-001
 * 查询当年年份指标的使用情况
 * @param {*} parameter
 */
export function getUseIndicatorsByThisYear (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getUseIndicatorsByThisYear',
    method: 'get',
    params: parameter
  })
}

/**
 * tdzz-m002-002
 * 通过近10年以内的年份排序查询各个年份的可用指标
 * @param {*} parameter
 */
export function getUsableIndicatorsByYear (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getUsableIndicatorsByYear',
    method: 'get',
    params: parameter
  })
}

/**
 * tdzz-m002-003
 * 通过近10年以内的年份排序查询各个年份的使用用指标
 * @param {*} parameter
 */
export function getUseIndicatorsByYear (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getUseIndicatorsByYear',
    method: 'get',
    params: parameter
  })
}

/**
 * tdzz-m002-004
 * 新增指标信息
 * @param {*} parameter
 */
export function addIndicators (parameter) {
  return axios({
    url: '/tdzz/llzbgl/addIndicators',
    method: 'post',
    params: parameter
  })
}

/**
 * tdzz-m002-005
 * 修改指标信息
 * @param {*} parameter
 */
export function upIndicators (parameter) {
  return axios({
    url: '/tdzz/llzbgl/upIndicators',
    method: 'put',
    params: parameter
  })
}

/**
 * tdzz-m002-006
 * 删除指标信息
 * @param {*} parameter
 */
export function delIndicators (parameter) {
  return axios({
    url: '/tdzz/llzbgl/delIndicators/' + parameter,
    method: 'delete'
  })
}

/**
 * tdzz-m002-007
 * 通过日期和批次名称筛选出当年年份指标使用情况
 * @param {*} parameter
 */
export function getIndicatorsList (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getIndicatorsList?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m002-008
 * 新增区域指标信息
 * @param {*} parameter
 */
export function addTdzzAreaIndicatorsDetail (parameter) {
  return axios({
    url: '/tdzz/llzbgl/addTdzzAreaIndicatorsDetail',
    method: 'post',
    params: parameter
  })
}

/**
 * tdzz-m002-009
 * 修改区域指标信息
 * @param {*} parameter
 */
export function upTdzzAreaIndicatorsDetail (parameter) {
  return axios({
    url: '/tdzz/llzbgl/upTdzzAreaIndicatorsDetail',
    method: 'put',
    params: parameter
  })
}

/**
 * tdzz-m002-010
 * 通过指标信息ID查询区域面积信息
 * @param {*} parameter
 */
export function getDetailByIndicatorsID (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getDetailByIndicatorsID/' + parameter,
    method: 'get'
  })
}

/**
 * tdzz-m002-011
 * 通过日期和批次名称筛选出当年年份指标新增情况
 * @param {*} parameter
 */
export function getIndicatorsLists (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getIndicatorsLists',
    method: 'post',
    params: parameter
  })
}

/**
 * tdzz-m002-012
 * 查询出当年年份指标新增情况
 * @param {*} parameter
 */
export function getNewIndicatorsByThisYear (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getNewIndicatorsByThisYear',
    method: 'post'
  })
}

/**
 * tdzz-m002-013
 * 查询指标新增总剩余数额
 * @param {*} parameter
 */
export function getIndicatorsTotalSurplus (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getIndicatorsTotalSurplus',
    method: 'post'
  })
}
/**
 * tdzz-m002-014
 * 查询当年指标总新增数额
 * @param {*} parameter
 */
export function getIndicatorsTotalNew (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getIndicatorsTotalNew',
    method: 'post'
  })
}
/**
 * tdzz-m002-015
 * 查询当年指标总使用数额
 * @param {*} parameter
 */
export function getIndicatorsTotalUse (parameter) {
  return axios({
    url: '/tdzz/llzbgl/getIndicatorsTotalUse',
    method: 'post'
  })
}
