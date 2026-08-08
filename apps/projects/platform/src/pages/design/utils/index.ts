import { useEffect, useRef } from 'react'
import { get, isEmpty, each, isObject, flattenDeep, isUndefined, map, isEqual, keys } from 'lodash'
import { PROPS_TYPES, produce } from '@apps/design-core'
import { CategoryType } from '@apps/design-core'

export const SPECIAL_STRING_CONSTANTS: any = {
  null: null,
}

export const formatSpecialProps = (props: any, propsConfig: any) => {
  const nextProps = props
  each(props, (v, k) => {
    if (get(propsConfig, k)) {
      if (!isObject(v)) {
        if (SPECIAL_STRING_CONSTANTS[v] !== undefined) {
          nextProps[k] = SPECIAL_STRING_CONSTANTS[v]
        } else if (propsConfig[k].type === PROPS_TYPES.function) {
          const funcTemplate = get(propsConfig, `${k}.placeholder`)
          if (funcTemplate) {
            nextProps[k] = () => eval(funcTemplate)
          } else {
            // nextProps[k] = () => {
            // };
          }
        }
      } else if (
        isObject(v) &&
        !isEmpty(propsConfig[k].childPropsConfig) &&
        isEqual(keys(v), keys(propsConfig[k].childPropsConfig))
      ) {
        formatSpecialProps(v, propsConfig[k].childPropsConfig)
      }
    } else if (isUndefined(v)) {
      delete nextProps[k]
    }
  })
  return nextProps
}

/**
 * 用于获取组件名字数组
 * @param data
 * @returns {Array}
 */
export function flattenDeepArray(data: CategoryType) {
  return flattenDeep(
    map(data, (v, k) => {
      if (v && v.components) return map(v.components, (_, subK) => subK)
      return k
    }),
  )
}

/**
 * 过滤掉值为undefined的字段
 * @param value
 * @returns {undefined}
 */
export const filterProps = (value: any) => {
  const props: any = {}
  each(value, (v, k) => {
    if (v !== undefined) {
      props[k] = v
    }
  })

  return isEmpty(props) ? undefined : props
}

/**
 * 过滤掉值为函数的字段
 * @param value
 * @returns {undefined}
 */
export const filterPropsFunction = (value: any) => {
  const props: any = {}
  each(value, (v, k) => {
    if (typeof v !== 'function') {
      props[k] = v
    }
  })

  return isEmpty(props) ? undefined : props
}

/**
 * 获取字段在props中的位置
 * @param fieldConfigLocation
 * @returns {string}
 */
export const getFieldInPropsLocation = (fieldConfigLocation: string) => {
  return fieldConfigLocation
    .split('.')
    .filter((location) => location !== 'childPropsConfig')
    .join('.')
}
/**
 * 格式化字段在属性配置中的路径
 * @param type
 * @param field
 * @param fatherFieldLocation
 * @param tabIndex
 * @returns {string|string}
 */
export const formatPropsFieldConfigLocation = (
  type: PROPS_TYPES,
  field: string,
  fatherFieldLocation: string,
  tabIndex?: number,
) => {
  let fieldConfigLocation = fatherFieldLocation ? `${fatherFieldLocation}.` : ''
  if (type === PROPS_TYPES.object) {
    fieldConfigLocation = `${fieldConfigLocation}${field}.childPropsConfig`
  } else if (type === PROPS_TYPES.objectArray) {
    fieldConfigLocation = `${fieldConfigLocation}${field}.childPropsConfig${
      tabIndex !== undefined ? `.[${tabIndex}]` : ''
    }`
  }
  return fieldConfigLocation
}

/**
 * form 方法受控组件减少不必要渲染
 * @param prevProps
 * @param nextProps
 */
export const propsAreEqual = (prevProps: any, nextProps: any) => isEqual(prevProps.value, nextProps.value)

/**
 * 处理父级属性与组件属性的异同
 */
export const diffProps = (restProps: any, props: any) => {
  each(restProps, (v, k) => {
    if (!isEqual(props[k], v)) {
      props[k] = v
    }
  })

  return props
}

export function usePrevious<T>(value: any) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

/**
 * 获取广告类型对应编号
 */
export const getAdvertType = (type) => {
  switch (type) {
    case 'banner':
      return 1
    case 'interact':
      return 2
    case 'service':
      return 3
  }
}

/**
 * 往数组添加模板id字段
 * @param list
 */
export const addTempalteIdToList = (list, templateId) => {
  const newList = produce(list, (oldList) => {
    oldList.map((item) => {
      item['templateId'] = templateId
      return item
    })
    return oldList
  })
  return newList
}

/**
 * 重置列表排序值
 */
export const resetListSort = (list: any[], sortKey = 'sort') => {
  if (Array.isArray(list) && list.length > 0) {
    return list.map((item, index) => ({
      ...item,
      [sortKey]: index + 1,
    }))
  }
  return list
}
