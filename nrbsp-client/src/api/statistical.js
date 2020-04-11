import { axios } from '@/utils/request'
import qs from 'qs'
/**
 * tdzz-m004-001
 * 通过选择的日期和区域查询出区域指标新增情况
 * @param {*} parameter
 */

export function getNewAddIndicators (parameter) {
  return axios({
    url: '/tdzz/tjfx/getNewAddIndicators?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-002
 * 通过选择的日期和区域查询出区域指标使用情况
 * @param {*} parameter
 */
export function getUseIndicators (parameter) {
  return axios({
    url: '/tdzz/tjfx/getUseIndicators?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-003
 * 通过选择的日期和区域查询筛选出正在整治中的工程
 * @param {*} parameter
 */
export function getRenovateProject (parameter) {
  return axios({
    url: '/tdzz/tjfx/getRenovateProject?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-004
 * 通过项目状态和区域进行分组查询
 * @param {*} parameter
 */
export function getProjectAreaByState (parameter) {
  return axios({
    url: '/tdzz/tjfx/getProjectAreaByState?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-005
 * 通过选择的日期和区域查询所有项目的巡查信息进行筛选(分页)
 * @param {*} parameter
 */
export function getProjectPatrol (parameter) {
  return axios({
    url: '/tdzz/tjfx/getProjectPatrol?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-006
 * 通过选择的日期和区域统计各个项目巡查次数
 * @param {*} parameter
 */
export function getProjectPatrolNum (parameter) {
  return axios({
    url: '/tdzz/tjfx/getProjectPatrolNum?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-007
 * 通过选择的日期和区域统计人员巡查次数
 * @param {*} parameter
 */
export function getProjectPatrolPersonNum (parameter) {
  return axios({
    url: '/tdzz/tjfx/getProjectPatrolPersonNum?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-008
 * 通过时间和区域筛选出项目财务信息
 * @param {*} parameter
 */
export function getFinancial (parameter) {
  return axios({
    url: '/tdzz/tjfx/getFinancial?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-009
 * 通过年份和区域，筛选出新增指标情况
 * @param {*} parameter
 */
export function getNewIndicators (parameter) {
  return axios({
    url: '/tdzz/tjfx/getNewIndicators?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-0010
 * 通过年份和区域，筛选出指标使用情况
 * @param {*} parameter
 */
export function getUseIndicatorsByQyAndYear (parameter) {
  return axios({
    url: '/tdzz/tjfx/getUseIndicatorsByQyAndYear?' + qs.stringify(parameter, { arrayFormat: 'repeat' }),
    method: 'post'
  })
}

/**
 * tdzz-m004-0011
 * 通过年份和区域，筛选出指标新增台账
 * @param {*} parameter
 */
export function getNewIndicatorsParameter (parameter) {
  return axios({
    url: '/tdzz/tjfx/getNewIndicatorsParameter',
    method: 'post',
    params: parameter
  })
}

/**
 * tdzz-m004-0012
 * 通过年份和区域，筛选出指标使用台账
 * @param {*} parameter
 */
export function getUseIndicatorsParameter (parameter) {
  return axios({
    url: '/tdzz/tjfx/getUseIndicatorsParameter',
    method: 'post',
    params: parameter
  })
}
