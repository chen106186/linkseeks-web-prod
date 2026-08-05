import deepClone from 'clone'
import moment from 'moment'
import type { ISchema } from '@apps/formily'
import { GlobalConfig } from '@/global/config'
import { getCommodityShopAll } from '@apps/apis'

export type MenuType = {
  /**
   * 菜单名称
   */
  name: string
  /**
   * 菜单编码
   */
  component: string
  /**
   * 菜单路径
   */
  path: string
  /**
   * 父级编码
   */
  relationParentCode: string
  /**
   * 图标
   */
  icon: string
  /**
   * 是否上移一层，0-否，1-是
   */
  up: number
  /**
   * 是否隐藏菜单
   */
  hideInMenu: boolean
  noMargin: boolean
  /**
   * 按钮 ,ButtonVO
   */
  btns: {
    /**
     * 路径
     */
    path?: string
    /**
     * 名称
     */
    name?: string
    /**
     * 编码
     */
    buttonCode?: string
  }[]
  /**
   * 路由 ,MenuVO
   */
  routes: Record<string, any>[]
  attrs: Record<string, any>[]
}

function isArray(arr: any) {
  return Array.isArray(arr)
}

export const findArrayItem = (arr: any[], flag: any) => {
  const result = arr.find((v) => v.value === flag)
  return result ? result : {}
}

export const normalizeMemu = (menu: MenuType[]): MenuType[] => {
  if (menu && Array.isArray(menu) && menu.length > 0) {
    return menu.map((item) => {
      return {
        ...item,
        ...item.attrs,
        routes:
          item.routes && Array.isArray(item.routes) && item.routes.length > 0
            ? normalizeMemu(item.routes as MenuType[])
            : [],
      }
    })
  }
  return menu
}

/**
 * 找到最后一个可用的工作流状态的索引
 * @param {array} data 数据
 * @param {string} customKey 自定义 key
 */
export const findLastIndexFlowState = (data: any[], customKey = 'isExecute'): number => {
  let index = 0
  if (!Array.isArray(data)) {
    return index
  }
  // 循环数据，找到状态值，一直覆盖
  for (let i = 0; i < data.length; i++) {
    if (data[i][customKey]) {
      index = i
    }
  }
  return index
}

export function formatTimeString(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return date ? moment(date).format(format) : ''
}

export function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function transformDataPre(data: object, key: string): object {
  const trans = {}
  Object.getOwnPropertyNames(data).forEach((k) => {
    trans[`${key}.${k}`] = data[k]
  })
  return trans
}

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export function timeRange(val: number) {
  let st, et
  switch (val) {
    case 0:
      st = et = ''
      break
    case 1:
      st = moment(moment().startOf('days').format('YYYY-MM-DD HH:mm:ss')).valueOf()
      et = moment(moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')).valueOf()
      break
    case 2:
      st = moment(moment().subtract(7, 'days').format('YYYY-MM-DD') + ' 00:00:00').valueOf()
      et = moment(moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')).valueOf()
      break
    case 3:
      st = moment(moment().subtract(29, 'days').format('YYYY-MM-DD') + ' 00:00:00').valueOf()
      et = moment(moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')).valueOf()
      break
    case 4:
      st = moment(moment().subtract(89, 'days').format('YYYY-MM-DD') + ' 00:00:00').valueOf()
      et = moment(moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')).valueOf()
      break
    case 5:
      st = moment(moment().subtract(179, 'days').format('YYYY-MM-DD') + ' 00:00:00').valueOf()
      et = moment(moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')).valueOf()
      break
    case 6:
      st = moment(moment().subtract(364, 'days').format('YYYY-MM-DD') + ' 00:00:00').valueOf()
      et = moment(moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')).valueOf()
      break
    case 7:
      st = moment('1971-01-01', 'YYYY-MM-DD').valueOf() // 或者0
      et = moment().subtract(1, 'year').valueOf()
      break
  }
  return { st, et }
}

export const isUrl = (path: string): boolean => reg.test(path)

/**
 * @description 用于将传入的接口，并行请求，并组装成Select组件可识别的形式返回
 * @param asyncList {Array} 异步函数数组
 */
export const getAsyncSelectList = async (asyncList: any[]) => {
  try {
    const result = await Promise.all(asyncList)
    return result.map((v) =>
      v.data.map((j) => {
        return {
          label: j.name,
          value: j.id,
        }
      }),
    )
  } catch (error) {
    return error
  }
}

// 抽离对象中的某些属性， 并返回一个新对象
export const omit = (obj: any, arr: string[]): any => {
  const newObj = deepClone(obj)
  for (let item = 0; item < arr.length; item++) {
    if (obj[arr[item]] !== undefined) {
      delete newObj[arr[item]]
    }
  }
  return newObj
}

/**
 * @param { Object[] } arr 源数据
 * @param { any } target 目标值 通常是id等主键
 * @param { string } customKey 可选 自定义主键 默认'id'
 */
export const findItemAndDelete = (arr: any[], target: any, customKey?: string) => {
  const newArr = [...arr]
  if (newArr.length > 0 && isObject(newArr[0])) {
    return newArr.filter((v) => v[customKey || 'id'] !== target)
  }
  const targetIndex = arr.indexOf(target)
  if (targetIndex === -1) {
    return newArr
  } else {
    newArr.splice(targetIndex, 1)
    return newArr
  }
}

// 遍历树拿到所有key的集合
export const findTreeKeys = (arr: any[], keyword?: string) => {
  const copyArr: any[] = deepClone(arr)
  const results: any[] = []
  while (copyArr && copyArr.length > 0) {
    const item = copyArr.shift()
    results.push(keyword ? item[keyword] : item.key)
    if (item.children) {
      copyArr.push(...item.children)
    }
  }
  return results
}

// 树形结构降为一维对象处理
export const treeReduction = (data: any[], customKey?: string | undefined) => {
  const hashMaps = {}
  const selfData: any[] = deepClone(data)
  while (selfData.length > 0) {
    const useItem = selfData.shift()

    // 存在子集
    if (useItem.children && useItem.children.length > 0) {
      useItem.children = useItem.children.map((v) => {
        v.parentId = useItem[customKey || 'id']
        return v
      })
      selfData.push(...useItem.children)
    }

    hashMaps[useItem[customKey || 'id']] = useItem
  }
  return hashMaps
}

// 获取某一节点的title路径
export const getParentTreeTitles = (dataSouce, key, customKey?) => {
  const hashMaps = treeReduction(dataSouce, customKey)
  let targetKey = key
  let targetPath = ''
  while (targetKey !== '') {
    if (!hashMaps[targetKey]) {
      break
    }
    const title = hashMaps[targetKey].name

    targetPath = targetPath === '' ? title : `${title}-${targetPath}`
    targetKey = hashMaps[targetKey].parentId || ''
  }
  return targetPath
}

// 数组通过某个key进行去重合并, 并返回一个新数组
export const mergeArrByKey = (preArr: any[], nextArr: any[], target?: string) => {
  const mergeArr = preArr.concat(nextArr)
  if (target) {
    const result: any[] = []
    mergeArr.forEach((v) => {
      const s = result.find((j) => j[target] === v[target])
      if (!s) {
        result.push(v)
      }
    })
    return result
  } else {
    return Array.from(new Set(mergeArr))
  }
}

// 数组去重
export const dupliArr = (arr: any[]) => {
  return Array.from(new Set(arr))
}

// 填充必填的schema message提示
export const padRequiredMessage = (originSchema: ISchema) => {
  const messageSwich = (type) => {
    return type ? '请选择' : '请输入'
  }
  if (originSchema.properties) {
    Object.entries(originSchema.properties).map(([, value]) => {
      if (value.required) {
        const isSelect = value.enum
        const message = messageSwich(isSelect) + (value.title || '')
        value['x-rules'] = Array.isArray(value['x-rules'])
          ? value['x-rules'].concat([{ message, required: true }])
          : [{ message, required: true }]
      }
      if (value.properties) {
        padRequiredMessage(value)
      }
      return value
    })
  }
  return originSchema
}

export interface FileData {
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  url: string
  size: number
  type: string
}

/**
 * 初始化 Upload 数据
 */
export function normalizeFiledata(url: any, name?: string): any {
  if (!url) {
    return {}
  }
  const splited = url.split('/')
  const fileName = splited && splited.length ? splited[splited.length - 1] : ''

  return {
    uid: Math.random().toFixed(16).slice(2, 10),
    name: name || fileName,
    status: 'done',
    size: 0,
    type: '',
    url,
  }
}

/**
 * 检查是否还有更多
 * @param {Number} curPage 当前页码
 * @param {Number} curSize 当前页数
 * @param {Number} dataLen 当前数据长度
 * @param {Number} dataTotal 数据总长度
 */
export const checkMore = (curPage: number, curSize: number, dataLen: number, dataTotal: number) => {
  let hasMore = true

  if (!dataLen || dataLen + (curPage - 1) * curSize >= +dataTotal) {
    hasMore = false
  }
  return hasMore
}

/**
 *
 * @param {string} str 需要判断是否是 JSON字符串的 字符串
 */
export const isJSONStr = (str) => {
  if (typeof str === 'string') {
    try {
      const complete = JSON.parse(str)
      return complete
    } catch (e) {
      return null
    }
  }
  return str
}

/**
 * 给 Table columns 的 filters 赋值
 * @param {array} data 需要赋值的数组
 * @param {string} dataIndex 索引
 * @param {array} item 需要赋值的值
 */
export const coverColFiltersItem = (data: Record<string, any>[], dataIndex: string, item: Record<string, any>) => {
  const index = data.findIndex((i) => i.dataIndex === dataIndex)

  if (index !== -1) {
    data.splice(index, 1, {
      ...data[index],
      filters: item,
    })
  }
}

export const getDefaultEnterprise = () => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number }) => item.environment === 1 && item.type === 1,
  )
  const defaultMall = webMallList.filter((item) => item.isDefault === 1)[0]
  let result: any = undefined
  if (defaultMall) {
    result = defaultMall
  } else {
    if (webMallList && webMallList.length > 0) {
      result = webMallList[0]
    }
  }
  return result
}

export const getDefaultEnterpriseMallInfo = async () => {
  const { data: shopInfo } = await getCommodityShopAll()
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number; self: number }) =>
      item.environment === 1 && item.type === 1 && item.self === 0,
  )
  const defaultMall = webMallList.filter((item) => item.isDefault)[0]
  let result: any = undefined
  if (defaultMall) {
    result = defaultMall
  } else {
    if (webMallList && webMallList.length > 0) {
      result = webMallList[0]
    }
  }
  return result
}

export const getInfoAndSrmUrl = async (): Promise<{ mallUrl: string; infoUrl: string; srmUrl: string }> => {
  const { data: shopInfo } = await getCommodityShopAll()
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number; self: number }) =>
      item.environment === 1 && item.type === 1 && item.self === 0,
  )
  const defaultMall = webMallList.filter((item) => item.isDefault)[0]
  let mallItem: any = {}
  if (defaultMall) {
    mallItem = defaultMall
  } else {
    if (webMallList && webMallList.length > 0) {
      mallItem = webMallList[0]
    }
  }
  const infoItem = shopInfo.find((item) => item.environment === 1 && item.type === 9)
  const srcItem = shopInfo.find((item) => item.environment === 1 && item.type === 6)
  let mallUrl = 'b2b'
  let infoUrl = 'info'
  let srmUrl = 'srm'
  if (mallItem) {
    mallUrl = mallItem.url
  }

  if (infoItem) {
    infoUrl = infoItem.url
  }
  if (srcItem) {
    srmUrl = srcItem.url
  }
  return {
    mallUrl,
    infoUrl,
    srmUrl,
  }
}

export const getChannelInfo = () => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number }) => item.environment === 1 && item.type === 3,
  )
  return webMallList[0]
}

export const getIChannelInfo = () => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number }) => item.environment === 1 && item.type === 4,
  )
  return webMallList[0]
}

/**
 * 根据host获取当前一级域名
 * @param url 链接
 * @returns
 */
export const getTopDomainByHost = (url: string | undefined, isPort = false): string => {
  if (!url) return ''
  // 如果后缀带有端口号， 可通过第二个参数把端口去掉
  const splitUrl = url.replace(/(http|https)\:\/\//, '').split(':')
  if (splitUrl.length > 1 && isPort) {
    return `${splitUrl[0].split('.').slice(-2).join('.')}`
  }
  return url.split('.').slice(-2).join('.')
}

/** 数组转对象 */
export function arrayToMap<T>(list: T[], primaryKey: keyof T) {
  const result: Record<string, T> = {}
  list.forEach((_item: T) => {
    const key = _item[primaryKey]
    ;(result as any)[key] = _item
  })
  return result
}

export function arrayMoveMutable<T>(array: T[], fromIndex: number, toIndex: number) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}
/**
 * 将数组项移动到不同的位置
 * @param array 源数组
 * @param fromIndex 起始项索引
 * @param toIndex 移动到目标位置索引
 * @returns
 */
export function arrayMoveImmutable<T>(array: T[], fromIndex: number, toIndex: number) {
  const newArray = [...array]
  arrayMoveMutable(newArray, fromIndex, toIndex)
  return newArray
}

export const isFunction = (value: unknown): value is (...args: any) => any => typeof value === 'function'

export default {
  isArray,
  isObject,
  transformDataPre,
}

export const downFileByBuffer = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob)
  const downloadElement = document.createElement('a')
  downloadElement.style.display = 'none'
  downloadElement.href = url
  downloadElement.download = fileName
  document.body.appendChild(downloadElement)
  downloadElement.click()
  document.body.removeChild(downloadElement)
  window.URL.revokeObjectURL(url)
}
