import React, { memo, useEffect, useState } from 'react'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import map from 'lodash/map'
import {
  ChildNodesType,
  PageConfigType,
  getComponentConfig,
  NodeProps,
  NodePropsConfigType,
  SelectedInfoBaseType,
  SelectedInfoType,
  STATE_PROPS,
} from '@apps/design-core'
import Collapse, { Panel } from 'rc-collapse'
import classNames from 'classnames'
import SortTree from './SortTree'
import styles from './index.less'
import AddBtn from './components/AddBtn'
import Header from './components/Header'
import { useSelector } from '../../hooks/useSelector'
import { isEqualKey, usePrevious } from '../../utils'

interface SortItemPropsType {
  isFold?: boolean
  propChildNodes?: string[]
  specialProps: SelectedInfoBaseType
  propName?: string
  nodeProps?: NodeProps
  index: number
  level: number
}

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: any
}

/**
 * 渲染子组件或者属性节点
 * @returns {Array|*}
 */
function renderSortTree(
  props: SortItemPropsType,
  isUnfold: boolean,
  componentName: string,
  level: number,
  nodePropsConfig?: NodePropsConfigType,
  childNodes?: ChildNodesType,
) {
  const { specialProps, propName, nodeProps } = props

  if (isArray(childNodes) || (!childNodes && !nodePropsConfig)) {
    return (
      <SortTree
        isFold={!isUnfold}
        level={level}
        childNodes={childNodes ? (childNodes as string[]) : []}
        propName={propName}
        specialProps={specialProps}
        nodeProps={nodeProps}
        componentName={componentName}
      />
    )
  }

  /**
   * 处理属性节点子组件
   */
  return map(nodePropsConfig, (nodeProps, propName) => {
    return (
      <SortItem
        {...props}
        propChildNodes={get(childNodes, propName, [])}
        specialProps={specialProps}
        propName={propName}
        key={propName}
        nodeProps={nodeProps}
      />
    )
  })
}

/**
 * 获取组件选中状态
 * @param key
 * @param hoverKey
 * @param selectedKey
 */
export function selectedStatus(key: string, hoverKey: string | null, selectedKey?: string) {
  const isSelected = isEqualKey(key, selectedKey)
  /** 是否hover到当前组件 */
  const isHovered = isEqualKey(key, hoverKey)
  return { isHovered, isSelected }
}

export type HookState = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}

export const stateSelector: STATE_PROPS[] = ['selectedInfo', 'pageConfig']

function SortItem(props: SortItemPropsType) {
  const {
    index,
    specialProps,
    specialProps: { key, parentPropName, parentKey },
    isFold,
    propName,
    propChildNodes,
    level,
  } = props
  const { selectedInfo, pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(stateSelector)
  const { domTreeKeys: nextSDTKeys } = selectedInfo || {}
  const newLevel = level + 1

  const vDom = pageConfig[key]
  const isAddBtn = vDom ? (vDom.addBtnText ? true : false) : false
  const { childNodes: vDomChildNodes, componentName, title } = vDom || {}
  const childNodes: ChildNodesType | undefined = propChildNodes || vDomChildNodes
  const [isUnfold, setIsUnfold] = useState(key === '0' ? true : isEmpty(childNodes))
  const [newKey, setNewKey] = useState<string>('')
  const [maxLimit, setMaxLimit] = useState<boolean>(false)

  // 保存子组件dom
  const prevChildNodes = usePrevious<ChildNodesType>(childNodes)

  const prevSDTKeys = usePrevious(nextSDTKeys)

  const getMaxChild = (list: string[]): string => {
    if (list.length > 0) {
      const sortList = [...list].sort((a, b) => {
        if (b.indexOf('-') > -1) {
          const bArry = b.split('-')
          const aArry = a.split('-')
          const lastB = Number(bArry[bArry.length - 1])
          const lastA = Number(aArry[aArry.length - 1])
          return lastB > lastA ? -1 : 1
        } else {
          return Number(b) > Number(a) ? -1 : 1
        }
      })
      return sortList[sortList.length - 1]
    }
    return ''
  }

  const getNewKey = () => {
    const _parentChildNodes: any = vDom.childNodes
    const maxChild = getMaxChild(_parentChildNodes)
    let lastKey: string = `${key}-1`
    if (maxChild) {
      if (maxChild.indexOf('-') > -1) {
        const maxArry = maxChild.split('-')
        maxArry[maxArry.length - 1] = Number(maxArry[maxArry.length - 1]) + 1 + ''
        lastKey = maxArry.join('-')
      }
    }
    return lastKey
  }

  useEffect(() => {
    if (childNodes && vDom.childComponentName && vDom.addBtnText) {
      setNewKey(getNewKey())
      if (vDom.maxLength) {
        setMaxLimit(childNodes.length >= vDom.maxLength)
      }
    }
  }, [childNodes, pageConfig, vDom])

  //新添加组件展开
  useEffect(() => {
    if (!isUnfold && prevChildNodes && !isEqual(prevChildNodes, childNodes)) {
      setIsUnfold(true)
    }
  }, [prevChildNodes, childNodes, isUnfold])

  // 父节点折叠当前节点是展开的就折叠当前节点
  useEffect(() => {
    if (isFold && isUnfold) setIsUnfold(false)
  }, [isFold, isUnfold])

  useEffect(() => {
    if (!isEqual(prevSDTKeys, nextSDTKeys) && nextSDTKeys && isUnfold && !nextSDTKeys.includes(key)) {
      setIsUnfold(false)
    }
  }, [prevSDTKeys, nextSDTKeys, isUnfold])

  if (!componentName) return null

  if (!isEqual(prevSDTKeys, nextSDTKeys) && nextSDTKeys && !isUnfold && nextSDTKeys.includes(key)) {
    setIsUnfold(true)
  }

  // const isContainerComponent = isContainer(componentName);
  const { fatherNodesRule, nodePropsConfig } = getComponentConfig(componentName)

  return (
    <div
      className={classNames(styles['sort-item'])}
      id={key}
      data-special={JSON.stringify({
        key,
        parentPropName,
        parentKey,
        isAddBtn,
      })}
      data-farules={fatherNodesRule && JSON.stringify(fatherNodesRule)}
      data-name={componentName}
    >
      <Collapse>
        <Panel
          showArrow={false}
          key={key}
          style={{ border: 0, backgroundColor: '#fff' }}
          header={
            <Header
              index={index}
              level={newLevel}
              isUnfold={isUnfold}
              specialProps={specialProps}
              propName={propName}
              setIsUnfold={setIsUnfold}
              hasChildNodes={!isEmpty(childNodes) || isAddBtn}
              title={title}
              componentName={propName || componentName}
              isHide={false}
            />
          }
        >
          <>
            {renderSortTree(props, isUnfold, componentName, newLevel, nodePropsConfig, childNodes)}
            {vDom.childComponentName && vDom.addBtnText && !maxLimit && (
              <AddBtn
                title={vDom.addBtnText}
                newKey={newKey}
                componentName={vDom.childComponentName}
                parentKey={key}
                parentPropName={propName}
              />
            )}
          </>
        </Panel>
      </Collapse>
    </div>
  )
}

export default memo<SortItemPropsType>(SortItem)
