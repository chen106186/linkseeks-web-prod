import React, { useEffect, useState } from 'react'
import { map, cloneDeep } from 'lodash'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import cx from 'classnames'
import {
  selectComponent,
  PageConfigType,
  PropsType,
  ChildNodesType,
  SelectedInfoBaseType,
  SelectedInfoType,
  clearSelectedStatus,
  STATE_PROPS,
} from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import styles from './index.less'

export interface VirtualDOMType {
  key?: string
  componentName: string
  props?: PropsType
  childNodes?: ChildNodesType
  condition?: string
  isStateDomain?: boolean
  propFields?: string[]
  methods?: {
    [key: string]: string
  }
  loop?: string | any[]
  fileName?: string
  [custom: string]: any
}

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}

const AllComponents = () => {
  const [allComponents, setAllComponents] = useState<VirtualDOMType[]>([])
  const { selectedInfo, pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo', 'pageConfig'])

  useEffect(() => {
    const newList: VirtualDOMType[] = []
    const config = cloneDeep(pageConfig)
    Object.keys(config).forEach((key) => {
      if (config[key].canEdit) {
        if (key !== 'key') {
          config[key].key = key
          newList.push(config[key])
        }
      }
    })
    setAllComponents(newList)
  }, [pageConfig, selectedInfo])

  const handleSelectComponent = (key: string | undefined) => {
    if (!key) return
    if (!selectedInfo || selectedInfo.selectedKey !== key) {
      const specialProps: SelectedInfoBaseType = {
        parentKey: '0',
        key,
        domTreeKeys: ['0', key],
      }
      selectComponent(specialProps)
    } else {
      clearSelectedStatus()
    }
  }

  const renderCompontentItem = (item: VirtualDOMType) => {
    return (
      <div
        className={cx(
          styles.components_item,
          selectedInfo && selectedInfo.selectedKey === item.key ? styles.active : {},
        )}
        key={item.title}
        onClick={() => handleSelectComponent(item.key)}
      >
        <span className={styles.components_item_text}>{item.title}</span>
        {item.canHide &&
          (item.props?.visible !== false ? (
            <EyeOutlined className={cx(styles.components_item_icon)} />
          ) : (
            <EyeInvisibleOutlined className={cx(styles.components_item_icon, styles.disable)} />
          ))}
      </div>
    )
  }

  return (
    <div className={styles.allcomponents_container}>
      <div className={styles.header}>
        <span>我的模块</span>
      </div>
      <div className={styles.components_list}>{map(allComponents, (item) => renderCompontentItem(item))}</div>
    </div>
  )
}

export default AllComponents
