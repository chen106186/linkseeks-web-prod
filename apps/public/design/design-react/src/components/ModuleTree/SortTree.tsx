import React, { memo, useCallback } from 'react'
import map from 'lodash/map'
import {
  NodeProps,
  onLayoutSortChange,
  PageConfigType,
  SelectedInfoBaseType,
  SelectedInfoType,
  STATE_PROPS,
} from '@apps/design-core'
import styles from './index.less'
import SortItem from './SortItem'
import ReactSortable from './components/ReactSortable'
import { useSelector } from '../../hooks/useSelector'

interface SortTreePropsType {
  isFold?: boolean
  childNodes: string[]
  currentName?: string
  disabled?: boolean
  specialProps: SelectedInfoBaseType
  propName?: string
  nodeProps?: NodeProps
  componentName: string
  level: number
}

/**
 * 渲染排序节点
 * @param key
 * @param props
 */
function renderSortItems(key: string, props: SortTreePropsType, index, level: number) {
  const {
    isFold,
    propName: parentPropName,
    specialProps: { domTreeKeys = [], key: parentKey },
  } = props

  return (
    <SortItem
      isFold={isFold}
      key={key}
      index={index}
      level={level}
      specialProps={{
        domTreeKeys: [...domTreeKeys, key],
        key,
        parentKey,
        parentPropName,
      }}
    />
  )
}

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}

const SortTree = (props: SortTreePropsType) => {
  const {
    childNodes,
    disabled,
    specialProps: { key },
    propName,
    level = 1,
  } = props
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])
  /**
   * 拖拽排序
   * @param sortKeys
   * @param evt
   * @param props
   */
  const layoutSortChange = useCallback(
    function (sortKeys: string[], evt) {
      console.log(sortKeys, 'sortKeys')
      // if (isEqual(childNodes, sortKeys) || sortKeys.length < childNodes.length)
      //   return;
      /**
       * 获取拖住节点的信息
       * @type {any}
       */
      let dragInfo: any
      if (sortKeys.length > childNodes.length) {
        dragInfo = JSON.parse(evt.clone.dataset.special)
      }
      // console.log(dragInfo, 'dragInfo');
      if (dragInfo && dragInfo.isAddBtn) return
      onLayoutSortChange({
        sortKeys,
        parentKey: key,
        parentPropName: propName!,
        dragInfo,
      })
    },
    [childNodes],
  )

  return (
    <ReactSortable
      options={{
        animation: 200,
        disabled,
        dataIdAttr: 'id',
        ghostClass: styles['item-background'],
        handle: '.drag_item',
        swapThreshold: 0.5,
      }}
      onChange={layoutSortChange}
    >
      {map(childNodes, (key, index) => {
        if (!pageConfig[key]) {
          return null
        }
        return renderSortItems(key, props, index, level)
      })}
    </ReactSortable>
  )
}

export default memo(SortTree)
