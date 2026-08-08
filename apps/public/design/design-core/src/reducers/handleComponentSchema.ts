import get from 'lodash/get'
import update from 'lodash/update'
import isEqual from 'lodash/isEqual'
import { produce } from 'immer'
import { VirtualDOMType } from '@apps/design-utils'
import { StateType } from '../types'
import {
  copyConfig,
  copyCurrentConfig,
  deleteChildNodes,
  deleteChildNodesKey,
  getLocation,
  // getNewCopyKey,
  getNewKey,
  handleRules,
  restObject,
  ROOT,
  warn,
  // resetChildNodes,
} from '../utils'
import {
  LayoutSortPayload,
  AddChildPayload,
  ResetCurrentComponentPayload,
  DeleteComponentByKeyPayload,
  CopyCurrentType,
  AddType,
} from '../actions'

/**
 * 往画板或者容器组件添加子组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function addChildComponent(state: StateType, payload: AddChildPayload): StateType {
  const { undo, redo, pageConfig } = state
  const { newKey, componentName, parentKey, parentPropName, childProps } = payload
  // console.log(state, 'state');
  // console.log(payload, 'payload');

  if (newKey === ROOT) {
    warn('Prohibit copying root node')
    return state
  }

  undo.push({ pageConfig })
  redo.length = 0
  const { template = {}, ...rest } = childProps

  const newVDom: VirtualDOMType & { [key: string]: any } = {
    key: newKey,
    componentName,
    title: '',
    props: {},
    childNodes: [],
    ...rest,
  }

  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      oldState = update(oldState, getLocation(parentKey!, parentPropName), (childNodes) => [
        ...(childNodes || []),
        `${newKey}`,
      ])

      oldState[newKey] = newVDom
      // copyConfig(oldState, selectedKey, newKey);
      /** 根据模板生成对应的子节点 */
      const templateKey = Object.keys(template)
      if (templateKey.length > 0) {
        const { newTemplate, unMountedKeys } = generate(newKey, template, templateKey)
        oldState[newKey].childNodes = (oldState[newKey].childNodes as string[]).concat(unMountedKeys)
        Object.keys(newTemplate).forEach((_item) => {
          oldState[_item] = newTemplate[_item]
        })

        // oldState = {
        //   ...oldState,
        //   ...newTemplate
        // };
        console.log(oldState)
      }
    }),
    undo,
    redo,
  }
}

/**
 * 提供一个template,  template 比如是 { "6-1": { childNode: [6-1-1] }, "6-1-1": { title: '123' }, "6-2": { childNodes: [] } } 会变成
 *  { "7-1": { childNode: [7-1-1] }, "7-1-1": { title: '123' }, "7-2": { childNodes: [] } }
 * 即变成新子组件的key, 返回没被挂载的key, 这些没被挂载的key应该挂载在他父级上
 * @param result
 * @param prefix
 * @param template
 * @param keys
 */

const generate = (prefix: string, template: { [key: string]: any }, keys: string[]) => {
  const result: { [key: string]: any } = {}
  const hasMountKeys = new Set()
  keys.forEach((_item) => {
    const [, ...rest] = _item.split('-')
    const currentKey = [prefix, ...rest].join('-')
    result[currentKey] = template[_item]
    if (template[_item].childNodes && template[_item].childNodes.length > 0) {
      result[currentKey].childNodes = template[_item].childNodes.map((_row: string, _rowKey: number) => {
        const childNodeKey = `${currentKey}-${_rowKey + 1}`
        hasMountKeys.add(childNodeKey)
        return childNodeKey
      })
    }
  })
  const resultKeys = Object.keys(result)
  const noMountedKeys: string[] = resultKeys.map((_item) => {
    if (!hasMountKeys.has(_item)) {
      return _item
    }
  })
  return {
    newTemplate: result,
    unMountedKeys: noMountedKeys,
  }
}

/**
 * 往画板或者容器组件添加组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function addComponent(state: StateType): StateType {
  const { undo, redo, pageConfig, dragSource, dropTarget, dragSort } = state

  /**
   * 如果没有拖拽的组件不做添加动作, 如果没有
   */
  if (!dragSource || (!dropTarget && pageConfig[ROOT])) return { ...state, dragSource: null, dragSort: null }
  const { vDOMCollection, dragKey, parentKey, parentPropName } = dragSource
  /**
   * 如果没有root根节点，新添加的组件添加到root
   */
  if (!pageConfig[ROOT]) {
    undo.push({ pageConfig })
    redo.length = 0
    return {
      ...state,
      pageConfig: vDOMCollection!,
      dragSource: null,
      dropTarget: null,
      dragSort: null,
      undo,
      redo,
    }
  }
  // eslint-disable-next-line prefer-const
  let { selectedKey, propName, childNodeKeys } = dropTarget
  /**
   * 如果有root根节点，并且即没有选中的容器组件也没有drop的目标，那么就要回退到drag目标，
   * 添加之前的页面配置
   */
  if (!selectedKey) {
    /**
     * 如果有parentKey说明是拖拽的是新添加的组件，
     * 返回原先的state状态
     */
    if (!parentKey) {
      return { ...state, ...undo.pop(), dragSource: null, dragSort: null }
    } else {
      return { ...state, dragSource: null, dragSort: null }
    }
  }

  if (
    !dragSort ||
    (parentKey === selectedKey && isEqual(childNodeKeys, dragSort)) ||
    handleRules(pageConfig, dragKey!, selectedKey, propName)
  ) {
    return { ...state, dragSource: null, dropTarget: null, dragSort: null }
  }

  parentKey && undo.push({ pageConfig })
  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      //添加新组件到指定容器中
      update(oldConfigs, getLocation(selectedKey!, propName), () => dragSort)
      //如果有父key说明是跨组件的拖拽，原先的父容器需要删除该组件的引用
      if (parentKey && (parentKey !== selectedKey || parentPropName !== propName)) {
        update(oldConfigs, getLocation(parentKey), (childNodes) =>
          deleteChildNodesKey(childNodes, dragKey!, parentPropName),
        )
      }
    }),
    dragSource: null,
    dropTarget: null,
    dragSort: null,
    undo,
    redo,
  }
}

/**
 * 往画板或者容器组件添加指定组件
 * @param state
 * @param payload
 * @returns {{pageConfig: *}}
 */
export function addComponentByName(state: StateType, payload: AddType): StateType {
  const { undo, redo, pageConfig } = state
  if (!payload.componentName) {
    return { ...state }
  }

  const sortChildNodes: any = Array.isArray(Object.keys(pageConfig))
    ? Object.keys(pageConfig)
        .sort((a, b) => (Number(b) > Number(a) ? -1 : 1))
        .filter((item) => `${Number(item)}` !== 'NaN')
    : []

  const key = payload.parentKey || ROOT
  const pageChildNodes: any = produce(pageConfig[key].childNodes, (oldState) => {
    return oldState || []
  })
  const positionIndex = pageChildNodes.indexOf(`${payload.position}`)
  const newKey = Number(sortChildNodes[sortChildNodes.length - 1]) + 1

  const newchildNodes = produce(pageConfig[key].childNodes, (oldState: string[]) => {
    oldState.splice(positionIndex + (payload.addBefore ? 0 : 1), 0, String(newKey))
  }) as string[]

  undo.push({ pageConfig })
  redo.length = 0

  let componentLength = 0
  Object.keys(pageConfig).forEach((key) => {
    const pageItem = pageConfig[key]
    if (pageItem.componentName === payload.componentName) {
      componentLength += 1
    }
  })

  if (payload.maxLength && componentLength >= payload.maxLength) {
    return { ...state }
  }

  if (payload.callback) {
    payload.callback(String(newKey))
  }

  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      //添加新组件到指定容器中
      update(oldState, `${key}.childNodes`, () => newchildNodes)
      oldState[newKey] = {
        componentName: payload.componentName,
        props: payload.componentProps,
        ...payload.reset,
      }
    }),
    undo,
    redo,
  }
}

/**
 * 复制组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function copyComponent(state: StateType): StateType {
  const { undo, redo, pageConfig, selectedInfo } = state
  /**
   * 未选中组件不做任何操作
   */
  if (!selectedInfo) {
    warn('Please select the node you want to copy')
    return state
  }
  if (selectedInfo.selectedKey === ROOT) {
    warn('Prohibit copying root node')
    return state
  }
  const { selectedKey, parentPropName, parentKey } = selectedInfo
  undo.push({ pageConfig })
  redo.length = 0
  const newKey = getNewKey(pageConfig)
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      update(oldState, getLocation(parentKey!, parentPropName), (childNodes) => [...childNodes, `${newKey}`])
      copyConfig(oldState, selectedKey, newKey)
    }),
    undo,
    redo,
  }
}

/**
 * 复制组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function copyCurrentComponent(state: StateType, payload: CopyCurrentType): StateType {
  const { undo, redo, pageConfig } = state
  /**
   * 未传入复制的组件不做任何操作
   */
  if (!payload) {
    warn('Please select the node you want to copy')
    return state
  }
  if (payload.key === ROOT) {
    warn('Prohibit copying root node')
    return state
  }

  const { key, parentKey, parentPropName } = payload
  undo.push({ pageConfig })
  redo.length = 0

  const sortChildNodes: any = produce(pageConfig[ROOT].childNodes, (oldState) => {
    if (Array.isArray(oldState)) {
      return oldState.sort((a, b) => (Number(b) > Number(a) ? -1 : 1))
    }
    return oldState || []
  })
  let newKey = Number(key) + 1
  if (sortChildNodes.length > 0) {
    newKey = Number(sortChildNodes[sortChildNodes.length - 1]) + 1
  }
  const pageChildNodes: any = produce(pageConfig[ROOT].childNodes, (oldState) => {
    return oldState || []
  })
  const currentIndex = pageChildNodes.indexOf(`${key}`)

  const tempList = produce(pageConfig[ROOT].childNodes, (oldState: string[]) => {
    oldState.splice(currentIndex, 0, String(newKey))
  }) as string[]

  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      update(oldState, getLocation(parentKey!, parentPropName), () => tempList)
      copyCurrentConfig(oldState, key, newKey)
    }),
    undo,
    redo,
  }
}

/**
 * 当domTree中拖拽节点调整顺序时触发
 * @param state
 * @param payload
 * @returns {{pageConfig: *}}
 */
export function onLayoutSortChange(state: StateType, payload: LayoutSortPayload): StateType {
  const { sortKeys, parentKey, parentPropName, dragInfo } = payload
  const { undo, redo, pageConfig } = state
  undo.push({ pageConfig })
  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      update(oldConfigs, getLocation(parentKey, parentPropName), () => sortKeys)
      /**
       * dragInfo有值说明为跨组件排序，需要删除拖拽组件原先父组件中的引用
       */
      if (dragInfo && (dragInfo.parentKey !== parentKey || dragInfo.parentPropName !== parentPropName)) {
        const { key, parentKey, parentPropName } = dragInfo
        update(oldConfigs, getLocation(parentKey), (childNodes) => deleteChildNodesKey(childNodes, key, parentPropName))
      }
    }),
    undo,
    redo,
  }
}

/**
 * 删除组件
 * @param state
 * @returns {{propsSetting: *, pageConfig: *, selectedInfo: *}}
 */
export function deleteComponent(state: StateType): StateType {
  const { undo, redo, pageConfig, selectedInfo } = state
  /**
   * 未选中组件将不做任何操作
   */
  if (!selectedInfo) {
    warn('Please select the components you want to delete')
    return state
  }
  const { selectedKey, parentKey, parentPropName } = selectedInfo
  undo.push({ pageConfig, selectedInfo })

  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      /**
       * 如果选中的是根节点说明要删除整个页面
       */
      if (selectedKey === ROOT) {
        return {}
      } else {
        // 删除选中组件在其父组件中的引用
        update(oldState, getLocation(parentKey), (childNodes) =>
          deleteChildNodesKey(childNodes, selectedKey, parentPropName),
        )
        const childNodes = oldState[selectedKey].childNodes
        /**
         * 如果childNodes有值，就遍历childNodes删除其中的子节点
         */
        if (childNodes) {
          deleteChildNodes(oldState, childNodes)
        }
        delete oldState[selectedKey]
      }
    }),
    selectedInfo: null,
    undo,
    redo,
  }
}

/**
 * 删除组件
 * @param state
 * @returns {{propsSetting: *, pageConfig: *, selectedInfo: *}}
 */
export function deleteComponentByKey(state: StateType, payload: DeleteComponentByKeyPayload): StateType {
  const { undo, redo, pageConfig } = state

  if (!payload) {
    return state
  }

  const { key, parentKey, parentPropName } = payload
  undo.push({ pageConfig })

  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      /**
       * 如果选中的是根节点说明要删除整个页面
       */
      if (key === ROOT) {
        return {}
      } else {
        // 删除选中组件在其父组件中的引用
        update(oldState, getLocation(parentKey), (childNodes) => deleteChildNodesKey(childNodes, key, parentPropName))
        const childNodes = oldState[key].childNodes
        /**
         * 如果childNodes有值，就遍历childNodes删除其中的子节点
         */
        if (childNodes) {
          deleteChildNodes(oldState, childNodes)
        }
        delete oldState[key]
      }
    }),
    selectedInfo: null,
    undo,
    redo,
  }
}

/**
 * 清除所有子节点
 * @param state
 * @returns {{undo: *, pageConfig, redo: *}}
 */

export function clearChildNodes(state: StateType): StateType {
  const { pageConfig, selectedInfo, undo, redo } = state
  if (!selectedInfo) {
    warn('Please select the component or property you want to clear the child nodes')
    return state
  }
  const { selectedKey, propName } = selectedInfo
  const childNodes = get(pageConfig, getLocation(selectedKey))
  if (!childNodes) return state
  undo.push({ pageConfig })

  redo.length = 0
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      deleteChildNodes(oldState, childNodes, propName)
      update(oldState, getLocation(selectedKey), (childNodes) => {
        /**
         * 如果 没有propName说明要清除组件的所有子节点
         */
        if (!propName) {
          return undefined
        } else {
          return restObject(childNodes, propName)
        }
      })
    }),
    undo,
    redo,
  }
}

/**
 * 重置当前节点，包括子节点，title, props 等
 */

export function resetCurrentComponent(state: StateType, payload: ResetCurrentComponentPayload): StateType {
  const { pageConfig, selectedInfo, undo, redo } = state
  const { parentKey, childrenNode, ...rest } = payload
  const { selectedKey } = selectedInfo
  if (!selectedKey || !parentKey) {
    warn('Please select the component or property you want to clear the child nodes')
    return state
  }
  undo.push({ pageConfig })
  redo.length = 0

  const newDomKeys = []
  const newVDom = {}
  childrenNode.forEach((_item) => {
    const { key, componentName, title, ...other } = _item
    newDomKeys.push(key)
    newVDom[key] = {
      componentName: componentName,
      title: title,
      ...other,
    }
  })
  const currentParentKey = parentKey || selectedKey
  const prevChildrenNode = get(pageConfig, [currentParentKey, 'childNodes'], [])

  return {
    ...state,
    pageConfig: produce(pageConfig, (newConfig) => {
      ;(prevChildrenNode as any).forEach((_item) => {
        delete newConfig[_item]
      })
      newConfig[currentParentKey].childNodes = newDomKeys

      const otherKeys = Object.keys(rest)
      otherKeys.forEach((_item) => {
        newConfig[currentParentKey][_item] = rest[_item]
      })

      Object.keys(newVDom).forEach((_item) => {
        newConfig[_item] = newVDom[_item]
      })
    }),
    undo,
    redo,
  }
}
