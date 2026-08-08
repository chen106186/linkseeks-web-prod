// 公共组装类工具

import moment from 'moment'

/**
 * 数组转对象 默认赋值 0
 * - 原数组: ['$04-01','$04-02']
 * - 转换后: { '$04-01': {}, '$04-02': {} }
 * @param arr
 * @returns
 */
const convertArrToObj = (arr) => {
  return arr?.reduce((obj, currVal) => {
    return {
      ...obj,
      [currVal]: {
        day: currVal.substr(1),
        planCount: 0,
        createNotice: false,
        createDelivery: false,
      },
    }
  }, {})
}

/**
 *  整合对象成所需使用格式
 *  - 原对象: { 04-01: 20, 04-02: 30 }
 *  - 整合后: { $04-01: 20, $04-02: 30 }
 * @param obj
 * @returns
 */
const integrationOjb = (obj) => {
  return Object.keys(obj).reduce((prev, currVal) => {
    return {
      ...prev,
      [`$${currVal}`]: obj[currVal],
    }
  }, {})
}

/**
 *  整合数组成所需使用格式对象
 *  - 原数组: [{ day: '04-01', planCount: 0, createNotice: false, createDelivery: false }]
 *  - 整合后: { $04-01: { day: '04-01', planCount: 0, createNotice: false, createDelivery: false }}
 * @param arr
 * @returns
 */
const integrationArrToObj = (arr) => {
  return arr.reduce((obj, currVal, idx) => {
    return {
      ...obj,
      [`$${currVal.day}`]: arr[idx],
    }
  }, {})
}

// -用于浏览器url参数传递或其他传递参数做一次编译，忽悠一下门外汉，称之为 神 函数，没试过大数据量测试(关键点: 涉及url带参限制)，id, name, phone等私密信息等可使用
/**
 * 比较无聊的工具类 神-加密
 * @param str
 * @returns
 */
const godBtoa = (str: string) => {
  return str ? window.btoa(encodeURIComponent(str)) : str
}

/**
 * 比较无聊的工具类 神-解密
 * @param str
 * @returns
 */
const godAtob = (str: string) => {
  return str ? decodeURIComponent(window.atob(str)) : str
}

/**
 *  new Map() value 取出
 *  - new Map([[key1, value1], [key2, value2]])=> [value1,value2]
 * @param newMapArr
 * @param isFlat
 * @returns
 */
const newMapValues = (newMapArr: Map<any, any>, isFlat?: boolean, depth?: number) => {
  const values = []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_key, value] of newMapArr) {
    values.push(value)
  }
  return isFlat ? values.flat(depth ?? 1) : values
}

/**
 * InputNumber 属性 parser
 * @param value
 * @returns
 */
const limitDecimalsP = (value: any) => {
  const reg = /^(\d+)\.(\d{4}).*$/
  return value.replace(/\s?|(,*)/g, '').replace(reg, '$1$2.$3')
}

/**
 * InputNumber 属性 formatter
 * @param value
 * @returns
 */
const limitDecimalsF = (value: moment.Moment) => {
  const reg = /^(\d+)\.(\d{4}).*$/
  return `${value}`.replace(reg, '$1$2.$3$4')
  // return `${value}`.replace(/\B(?=(\d{6})+(?!\d))/g, ',').replace(reg, '$1$2.$3') // 三位一个逗号 有bug
}

/**
 * 不能选择今天之前的日期但不包括今天
 * @param current
 * @returns
 */
const disabledDate = (current: moment.Moment) => {
  // return current && current < moment().endOf('day') // 包括今天判断
  return current && current < moment().startOf('day')
}

const year = new Date().getFullYear()
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).getTime()
/**
 * 判断是否在今天之前，不包含今天
 * - 例：today = 2022-04-18，2022-04-18之前但是不包含今天返回 true
 * @param day
 */
const afterToday = (day: string) => {
  // return new Date(`${year}-${day}`).getTime() < today // 包含今天判断
  return new Date(`${year}-${day}`).getTime() < yesterday
}

export {
  convertArrToObj,
  integrationOjb,
  integrationArrToObj,
  godBtoa,
  godAtob,
  newMapValues,
  limitDecimalsP,
  limitDecimalsF,
  disabledDate,
  afterToday,
}
