import get from 'lodash/get'
import produce from 'immer'

import { StateType } from '../types'

import { ChangePropsPayload, ChangeStatePropsPayload } from '../actions'

/**
 * 提交属性
 * @param state
 * @param payload
 * @returns {{propsSetting: *, pageConfig: *}}
 */
export function changeProps(state: StateType, payload: ChangePropsPayload): StateType {
  const { pageConfig, selectedInfo, undo, redo } = state
  const { props, title, treeKey, ...other } = payload
  const { selectedKey } = selectedInfo || {}
  const currentKey = treeKey || selectedKey
  if (!currentKey) return state
  undo.push({ pageConfig })
  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig!, (oldConfigs) => {
      const style = get(oldConfigs, [currentKey, 'props', 'style'])
      if (style) {
        oldConfigs[currentKey].props = { ...props, style }
      } else {
        oldConfigs[currentKey].props = props
      }
      if (title) {
        oldConfigs[currentKey].title = title
      }

      const otherKeys = Object.keys(other)
      otherKeys.forEach((_item) => {
        oldConfigs[currentKey][_item] = other[_item]
      })
    }),
    undo,
    redo,
  }
}

/**
 * 样式改变时调用
 * @param state
 * @param payload
 * @returns {{propsSetting: *, pageConfig: *}|*}
 */
export function changePropsByKey(
  state: StateType,
  payload: {
    props: any
    key: string
  },
): StateType {
  const { undo, redo, pageConfig } = state
  const { props, key } = payload
  undo.push({ pageConfig })
  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const config = oldConfigs[key]
      if (config) {
        if (config.props) {
          config.props = props
        } else {
          config['props'] = props
        }
      }
    }),
    undo,
    redo,
  }
}

/**
 * 提交status属性
 * @param state
 * @param payload
 * @returns {{propsSetting: *, pageConfig: *}}
 */
export function changeStatusProps(state: StateType, payload: ChangeStatePropsPayload): StateType {
  const { pageConfig, undo, redo } = state
  const { props, currentKey } = payload
  if (!payload) return state
  undo.push({ pageConfig })
  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig!, (oldConfigs) => {
      const visible = get(oldConfigs, [currentKey, 'props', 'visible'])
      oldConfigs[currentKey].props = { ...props, visible: !visible }
    }),
    undo,
    redo,
  }
}

/**
 * 重置属性
 * @param state
 */
export function resetProps(state: StateType): StateType {
  const { selectedInfo, pageConfig, undo, redo } = state
  if (!selectedInfo) return state
  const { selectedKey, props } = selectedInfo
  undo.push({ pageConfig })
  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      const style = get(oldConfigs, [selectedKey, 'props', 'style'])
      if (style) {
        oldConfigs[selectedKey].props = { ...props, style }
      } else {
        oldConfigs[selectedKey].props = props
      }
    }),
    undo,
    redo,
  }
}
