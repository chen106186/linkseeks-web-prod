import React, { memo } from 'react'
// import isEqual from 'lodash/isEqual';
import map from 'lodash/map'
import classNames from 'classnames'
import {
  addChildComponent,
  changeProps,
  NodeProps,
  // onLayoutSortChange,
  SelectedInfoBaseType,
} from '@apps/design-core'
import Collapse, { Panel } from 'rc-collapse'
import styles from './index.less'
import ReactSortable from './components/ReactSortable'
import PanelHeader from './components/PanelHeader'
import { AddBtnIcon } from '../ModuleTree/components/Icons'
import { useSelector } from '../../hooks/useSelector'

// interface SortTreePropsType {
//   isFold?: boolean;
//   childNodes: string[];
//   currentName?: string;
//   disabled?: boolean;
//   specialProps: SelectedInfoBaseType;
//   propName?: string;
//   nodeProps?: NodeProps;
//   componentName: string;
// }

const CollapseItem = (props) => {
  const { pageConfig } = useSelector<any, any>(['pageConfig'])

  const generateNewChildProps = () => {
    const childNodes = [...props.childNodes]
    childNodes.sort((a, b) => {
      const formatA = a.split('-')
      const formatB = b.split('-')
      return formatA[formatA.length - 1] - formatB[formatB.length - 1]
    })
    const lastItem = childNodes.length > 0 ? childNodes[childNodes.length - 1] : '0'
    const formatLastItem = lastItem.split('-')
    const lastKey = formatLastItem[formatLastItem.length - 1]
    const newKey = `${props.currentKey}-${+lastKey + 1}`
    console.log(newKey)
    return {
      componentName: props.childComponentName,
      newKey: newKey,
      parentKey: props.currentKey,
      childProps: props.childProps,
      parentPropName: null,
    }
  }

  const onAddChild = () => {
    const newChildProps = generateNewChildProps()
    addChildComponent(newChildProps)
  }

  const handleEnd = (evt, ref) => {
    const parentKey = props.currentKey
    changeProps({
      treeKey: parentKey,
      props: pageConfig[parentKey].props,
      childNodes: ref.toArray(),
    })
  }

  return (
    <>
      <ReactSortable
        options={{
          group: {
            name: `nested-group`,
            put: false,
          },
          animation: 200,
          dataIdAttr: 'data-id',
          // ghostClass: styles['item-background'],
          handle: '.drag_item',
          swapThreshold: 0.5,
        }}
        onMoveEnd={handleEnd}
      >
        <SortTree childNodes={props.childNodes} specialProps={{ key: props.currentKey }} />
      </ReactSortable>
      {props.childComponentName && props.addBtnText && (
        <div onClick={onAddChild} className={classNames(styles['add-btn'], 'ignore-elements')}>
          <AddBtnIcon style={{ marginRight: 8 }} />
          {props.addBtnText}
        </div>
      )}
    </>
  )
}

interface Iprops {
  childNodes: string[]
  specialProps: {
    /** 当前key */
    key: string | number
  }
}

const SortTree = (props: Iprops) => {
  const {
    childNodes,
    specialProps: { key },
  } = props
  const { pageConfig } = useSelector<any, any>(['pageConfig'])
  // const parentConfig = pageConfig[parentKey] || {};
  const currentConfig = pageConfig[key] || {}

  return (
    <>
      {map(childNodes, (_itemKey) => {
        if (!pageConfig[_itemKey]) {
          return null
        }
        const { title = '', childNodes = [], childComponentName, addBtnText } = pageConfig[_itemKey]
        const canCreateChildElement = childComponentName && addBtnText

        return (
          <div data-id={`${_itemKey}`} key={_itemKey}>
            <Collapse style={{ background: '#fff' }}>
              <Panel
                header={
                  <PanelHeader
                    currentKey={`${_itemKey}`}
                    title={title}
                    hasChildNodes={childNodes.length > 0 || canCreateChildElement}
                  />
                }
                key={key}
              >
                <CollapseItem {...pageConfig[`${_itemKey}`]} currentKey={`${_itemKey}`} />
              </Panel>
            </Collapse>
          </div>
        )
      })}
    </>
  )
}

export default memo(SortTree)
