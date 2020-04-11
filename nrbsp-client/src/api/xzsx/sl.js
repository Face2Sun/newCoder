import { get } from '@/utils/request'

/**
 * 行政事项受理
 */
export function getXzsxFl (query) { return get('xzsx/sl/getXzsxFl', query) }

// export default {
//   getXzsxFl
// }
