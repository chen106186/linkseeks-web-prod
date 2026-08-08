import React from 'react'
import moment from 'moment'
import deepClone from 'clone'
import type { ISchema } from '@apps/formily'
import { GlobalConfig } from '@/global/config'
import queryString from 'query-string'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { PATTERN_MAPS } from '@/constants/regExp'
import { COMMODITY_TYPE } from '@/constants'
import { getCommodityShopAll } from '@apps/apis'

function isArray(arr: any) {
  return Array.isArray(arr)
}

export function isObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function formatTimeString(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return date ? moment(date).format(format) : ''
}

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

export const arrayGroupsByCount = (array, count) => {
  let index = 0
  const newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += count)))
  }
  return newArray
}

// 判断是否是素数
export function isPrimeNum(num) {
  if (!isNum(num)) {
    return false
  }
  if (!isInteger(num)) {
    return false
  }
  if (num == 2 || num == 3 || num == 5) {
    return true
  }
  if (!isDual(num)) {
    return false
  }
  if (!isThree(num)) {
    return false
  }
  for (let i = 2; i < num / 5 + 1; i++) {
    if (num % i == 0) {
      return false
    }
  }
  return true
}
function isInteger(num) {
  return num == ~~num ? true : false
}
function isNum(num) {
  return num == +num ? true : false
}
function isDual(str: string) {
  const num = str.toString()
  const lastNum = num.substring(num.length - 1, num.length)
  return lastNum % 2 == 0 || lastNum % 5 == 0 ? false : true
}
function isThree(num) {
  const str = num.toString()
  let sum = 0
  for (let i = 0; i < str.length; i++) {
    sum += +str.substring(i, i + 1)
  }
  return sum % 3 == 0 ? false : true
}

export function omit(obj: any, arr: string[]) {
  const tempObj = { ...obj }
  for (let i = 0; i < arr.length; i++) {
    delete tempObj[arr[i]]
  }
  return tempObj
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

// 获取最小的差距值
export const getDistanceNumber = (target, step, min) => {
  // 当递归到只能被1整除时， 直接返回target
  if (step === 1) {
    return {
      [target]: target,
    }
  }
  const value = target / step
  if (value >= min) {
    let num = 0
    const result = {}
    while (num < target) {
      result[num] = num
      num += Math.ceil(value)
    }
    result[target] = target
    return result
  } else {
    // eslint-disable-next-line no-param-reassign
    return getDistanceNumber(target, --step, min)
  }
}

// 将数字拆分成指定区间
export const getStepNumber = (target: number, step?: number) => {
  if (target === 0) {
    return {}
  }
  // 最小相差10
  const minDistance = 4

  // eslint-disable-next-line no-param-reassign
  step = step || 4

  const marks = getDistanceNumber(target, step, minDistance)
  return marks
}

// 遍历树拿到所有key的集合
export const findTreeKeys = (arr: any[], keyword?: any) => {
  const copyArr: any[] = deepClone(arr)
  const results: any[] = []
  while (copyArr.length > 0) {
    const item = copyArr.shift()
    results.push(Number(keyword ? item[keyword] : item.key))
    if (item.children) {
      copyArr.push(...item.children)
    }
  }
  return results
}

// 判断生成带有tooltips的title
const returnRemarkTitle = (item: any) => {
  if (item.fieldRemark) {
    return (
      <Tooltip title={item.fieldRemark}>
        {item.fieldLocalName || item.fieldCNName}
        <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
      </Tooltip>
    )
  } else {
    return item.fieldLocalName || item.fieldCNName
  }
}

// 列表渲染
const listField = (field: any) => {
  const itemsProperties = {}
  ;(field.configs || []).forEach((item) => {
    const fieldType = getFieldType(item, {}, true)
    itemsProperties[item.fieldName] = {
      ...fieldType,
      'x-props': {
        width: item.fieldType === 'area' ? 800 : 280,
      },
    }
  })
  return itemsProperties
}

// 字段校验规则枚举：0-无校验规则，1-邮箱规则，2-手机号码规则，3-身份证规则，4-电话号码规则
const RULE_REG_MAP = {
  1: PATTERN_MAPS.email,
  2: PATTERN_MAPS.phone,
  3: PATTERN_MAPS.identity,
  4: PATTERN_MAPS.tel,
}

// 转化object 成schema
export const transFormSchema = (data: any[], defaultObj: Record<string, unknown>): ISchema => {
  return {
    type: 'object',
    properties: {
      MEGA_LAYOUT2: {
        type: 'object',
        'x-component': 'mega-layout',
        'x-component-props': {
          className: 'formBoxStep2',
        },
        properties: {
          detail: {
            type: 'object',
            properties: data.reduce((prev, next, index) => {
              prev[`NO_SUBMIT_BLOCK${index}`] = {
                type: 'object',
                'x-component': 'MellowCard',
                'x-component-props': {
                  className: 'mr_t-40',
                  title: <span>{next.groupName}</span>,
                },
                properties: {
                  [`NO_SUBMIT_BLOCK_MEGA${index}`]: {
                    type: 'object',
                    'x-component': 'mega-layout',
                    'x-component-props': {
                      columns: 2,
                      grid: true,
                      autoRow: true,
                      size: 'large',
                      className: 'mr_t-24',
                    },
                    properties: next.elements.reduce((subP, subN, subI) => {
                      subP[subN.fieldName] = getFieldType(subN, defaultObj)
                      return subP
                    }, {}),
                  },
                },
              }
              return prev
            }, {}),
          },
        },
      },
    },
  }
}

// 获取字段类型，改为schema可识别的
export const getFieldType = (field, defaultObj: Record<string, unknown>, inputTitle?: boolean) => {
  const intl = getIntl()
  if (field.fieldType === 'upload' || field.fieldType === 'file') {
    return {
      type: 'string',
      'x-component': 'CustomUpload',
      'x-mega-props': {
        span: 2,
      },
      required: field.fieldEmpty === 0,
      title: returnRemarkTitle(field),
      'x-component-props': {
        showDesc: false,
        ...field.attr,
      },
    }
  } else if (field.fieldType === 'radio') {
    return {
      'x-component': 'CustomRadioGroup',
      type: 'string',
      required: field.fieldEmpty === 0,
      title: returnRemarkTitle(field),
      'x-mega-props': {
        span: 2,
      },
      'x-component-props': {
        size: 'large',
        layout: '',
        dataSource: field.fieldEnum,
        ...field.attr,
      },
    }
  } else if (field.fieldType === 'checkbox') {
    return {
      type: 'string',
      'x-component': 'CheckboxGroup',
      required: field.fieldEmpty === 0,
      title: returnRemarkTitle(field),
      'x-mega-props': {
        span: 2,
      },
      'x-component-props': {
        size: 'large',
        dataSource: field.fieldEnum,
        ...field.attr,
      },
    }
  } else if (field.fieldType === 'select') {
    return {
      'x-component': 'CustomSelect',
      type: 'string',
      title: returnRemarkTitle(field),
      required: field.fieldEmpty === 0,
      'x-mega-props': {
        span: 1,
      },
      'x-component-props': {
        size: 'large',
        placeholder: `${intl.formatMessage({ id: 'common.text.pleaseSelect' })}${field.fieldLocalName}`,
        dataSource: field.fieldEnum,
        ...field.attr,
      },
    }
  } else if (field.fieldType === 'area') {
    return {
      'x-component': 'AreaSelect',
      type: 'string',
      title: returnRemarkTitle(field),
      required: field.fieldEmpty === 0,
      'x-mega-props': {
        span: 2,
      },
      'x-rules': field?.ruleEnum
        ? [
            {
              message: field.msg,
              pattern: eval(field.pattern),
            },
          ]
        : [],
      'x-component-props': {
        size: 'large',
        ...field.attr,
      },
    }
  } else if (field.fieldType === 'list') {
    return {
      type: 'array',
      title: returnRemarkTitle(field),
      'x-component': 'ArrayTable',
      required: field.fieldEmpty === 0,
      'x-mega-props': {
        span: 8,
      },
      'x-component-props': {
        renderAddition: () => (
          <div style={{ padding: '2px 0', textAlign: 'center' }}>
            + {intl.formatMessage({ id: 'common.button.addition', defaultMessage: '添加' })}
          </div>
        ),
        scroll: {
          x: 1200,
        },
      },
      items: {
        type: 'object',
        properties: listField(field),
      },
    }
  } else {
    // 回显邀请码信息
    let defaultValue = ''
    if (defaultObj && Object.keys(defaultObj).length > 0) {
      const currentKey = Object.keys(defaultObj).find((key) => key === field.fieldName)
      defaultValue = defaultObj[currentKey] as string
    }
    return {
      type: 'string',
      title: inputTitle && field.fieldLocalName,
      default: defaultValue,
      'x-mega-props': {
        span: 1,
      },
      'x-component': 'CustomInput',
      required: field.fieldEmpty === 0,
      'x-rules': field?.ruleEnum
        ? [
            {
              message: field.msg,
              pattern: RULE_REG_MAP[field.ruleEnum],
            },
          ]
        : [],
      // .concat([{ required: field.fieldEmpty === 0 }, { max: field.fieldLength }]),
      maxLength: field.fieldLength,
      'x-props': {
        itemClassName: field.fieldEmpty === 0 ? 'is_required' : 'no_required',
      },
      'x-component-props': {
        help: field.fieldRemark,
        placeholder: `${intl.formatMessage({ id: 'common.form.input.placeholder' })}${
          field.fieldLocalName || field.fieldCNName
        }`,
        size: 'large',
        ...field.attr,
      },
    }
  }
}

// 过滤掉undefined属性
export const filterUndef = (originObj) => {
  const r = {}
  for (const item in originObj) {
    if (originObj[item] !== undefined) {
      r[item] = originObj[item]
    }
  }
  return r
}

// 树形结构降为一维对象处理
export const treeReduction = (data: any[]) => {
  const hashMaps = {}
  const selfData: any[] = deepClone(data)
  while (selfData.length > 0) {
    const useItem = selfData.shift()

    // 存在子集
    if (useItem.children && useItem.children.length > 0) {
      useItem.children = useItem.children.map((v) => {
        v.parentId = useItem.id
        return v
      })
      selfData.push(...useItem.children)
    }

    hashMaps[useItem.id] = useItem
  }
  return hashMaps
}

// 获取某一节点的title路径
export const getParentTreeTitles = (dataSouce, key) => {
  const hashMaps = treeReduction(dataSouce)
  let targetKey = key
  let targetPath = ''
  while (targetKey !== '') {
    if (!hashMaps[targetKey]) {
      break
    }
    const title = hashMaps[targetKey].name || hashMaps[targetKey].title

    targetPath = targetPath === '' ? title : `${title}-${targetPath}`
    targetKey = hashMaps[targetKey].parentId || ''
  }
  return targetPath
}

export const getQueryStringParams = (url?: string) => {
  const nowUrl = url || window.location.href
  const firstIndex = nowUrl.indexOf('?')
  const searchParam = url ? url.substring(firstIndex) : window.location.search

  return queryString.parse(searchParam)
}

// 填充必填的schema message提示
export const padRequiredMessage = (originSchema: ISchema) => {
  const intl = getIntl()
  const messageSwich = (type) => {
    return type
      ? intl.formatMessage({ id: 'common.text.pleaseSelect' })
      : intl.formatMessage({ id: 'common.form.input.placeholder' })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(originSchema.properties).map(([key, value]) => {
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

export const getDefaultEnterprise = () => {
  const shopInfo = GlobalConfig.web.shopInfo
  const webMallList = shopInfo.filter(
    (item: { environment: number; type: number; memberOperate: number }) =>
      item.environment === 1 && item.type === 1 && !item.isMemberOperate,
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
    (item: { environment: number; type: number }) => item.environment === 1 && item.type === 1 && !item.self !== 1,
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
export const getTopDomainByHost = (url: string, isPort = false): string => {
  if (!url) return ''
  // 如果后缀带有端口号， 可通过第二个参数把端口去掉
  const _indexOf = url.indexOf('.')
  const withPortUrl = url.substring(_indexOf + 1)
  return isPort ? withPortUrl.split(':')[0] : withPortUrl
}

/**
 * 清空当前存储在 sessionStorage 中的筛选参数
 * 适用于重置 模态框筛选数据
 */

export const clearModalParams = () => {
  const currentState = JSON.parse(sessionStorage.getItem('currentState'))
  const result = { ...currentState, queryParams: {}, current: 1 }
  sessionStorage.setItem('currentState', JSON.stringify(result))
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
  // eslint-disable-next-line no-param-reassign
  array = [...array]
  arrayMoveMutable(array, fromIndex, toIndex)
  return array
}

export const getUrlMemberId = (url: string) => {
  const tempParam = url.match(/\/\d{1,}/)
  if (tempParam) {
    const param = tempParam[0] as unknown as string
    if (param) {
      return Number(param.replace('/', ''))
    }
  }
  return undefined
}

export const downloadFile = (url, fileName) => {
  const x = new XMLHttpRequest()
  x.open('GET', url, true)
  x.responseType = 'blob'
  x.onload = function () {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const url = window.URL.createObjectURL(x.response)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }
  x.send()
}

export const isJSONString = (str) => {
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str)
      if (typeof obj == 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}

export const toChinesNum = (num) => {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const unit = ['', '十', '百', '千', '万']
  // eslint-disable-next-line no-param-reassign
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.split('').reverse()
    let newNum = ''
    for (let i = 0; i < strArr.length; i++) {
      newNum =
        (i == 0 && strArr[i] == 0
          ? ''
          : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
          ? ''
          : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) + newNum
    }
    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = (num % 10000) + ''
  if (noWan.toString().length < 4) noWan = '0' + noWan
  return overWan ? getWan(overWan + '') + '万' + getWan(noWan) : getWan(num + '')
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

export const getNameByPriceType = (type: COMMODITY_TYPE) => {
  switch (type) {
    case COMMODITY_TYPE.prompt:
      return 'commodity'
    case COMMODITY_TYPE.inquiry:
      return 'inquiry'
    case COMMODITY_TYPE.integral:
      return 'integral'
    default:
      return 'commodity'
  }
}

/**
 * 获取url中的参数
 * @param field
 * @param url
 * @returns
 */
export const getQueryString = (field: string, url: string) => {
  if (!url) {
    return null
  }
  var href = url
  var reg = new RegExp('[?&]' + field + '=([^&]*)', 'i')
  var string = reg.exec(href)
  return string ? string[1] : null
}

/*
 * url 目标url
 * arg 需要替换的参数名称
 * arg_val 替换后的参数的值
 * return url 参数替换后的url
 */
export const changeURLArg = (url: string, arg: string, argVal: string) => {
  const pattern = arg + '=([^&]*)'
  const replaceText = arg + '=' + argVal
  if (url.match(pattern)) {
    let tmp = '/(' + arg + '=)([^&]*)/gi'
    // tslint:disable-next-line:no-eval
    tmp = url.replace(eval(tmp), replaceText)
    return tmp
  } else {
    if (url.match('[?]')) {
      return url + '&' + replaceText
    } else {
      return url + '?' + replaceText
    }
  }
}

/*
 * url 目标url
 * arg 需要删除的参数名称
 * return url 参数替换后的url
 */
export const removeURLArg = (url: string, key: string) => {
  let baseUrl = url.split('?')[0] + '?'
  let query = url.split('?')[1]
  if (query.indexOf(key) > -1) {
    let obj: any = {}
    let arr: any = query.split('&')
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[key]
    let url =
      baseUrl +
      JSON.stringify(obj)
        .replace(/[\"\{\}]/g, '')
        .replace(/\:/g, '=')
        .replace(/\,/g, '&')
    return url
  } else {
    return url
  }
}

export default {
  isArray,
  isObject,
  omit,
}

export const getLadderPrice = (unitPrice, number) => {
  if (!unitPrice) return 0
  let confirmPrice = 0
  Object.entries(unitPrice).forEach(([key, value]) => {
    const [min, max] = key.split('-').map((v) => Number(v))
    if (min === 0 && max === 0) {
      confirmPrice = Number(value)
      return false
    }
    if ((number >= min && number <= max) || number > max) {
      // 处于该区间或者大于该区间
      confirmPrice = Number(value)
      return false
    }
  })
  return confirmPrice
}
