import React, { useCallback } from 'react'
import { Switch } from 'antd'
import { cloneDeep } from 'lodash'
import { updatePageConfig, STATE_PROPS, SelectedInfoType, PageConfigType, getComponentKey } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import * as MarketingConfigs from './config'
import styles from './index.less'

interface MarketingSwitchProps {
  type: number
  title: string
  icon: any
}

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}

const MarketingSwitch: React.FC<MarketingSwitchProps> = (props: any) => {
  const { type, title, icon } = props
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])
  const _checked = Object.keys(pageConfig).indexOf(`11-${type}`) >= 0

  const _onChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        let _pageConfig: any = { ...pageConfig }
        const _marketingConfig = MarketingConfigs[`marketingConfig${type}`]
        _pageConfig = cloneDeep({ ..._pageConfig, ..._marketingConfig })
        const insertKey = getComponentKey('SuggestProduct', pageConfig)
        const _insertIndex = _pageConfig['0'].childNodes.indexOf(insertKey)
        _pageConfig['0'].childNodes?.splice(_insertIndex, 0, `11-${type}`)
        updatePageConfig(_pageConfig)
      } else {
        const _type = `11-${type}`
        const _pageConfig: any = cloneDeep({ ...pageConfig })
        const _deleteType = _type.split('-')
        for (const key in _pageConfig) {
          const _deteleKey = key.split('-')
          if (_deleteType[0] === _deteleKey[0] && _deleteType[1] === _deteleKey[1]) {
            delete _pageConfig[key]
          }
        }
        _pageConfig['0'].childNodes.splice(_pageConfig['0'].childNodes.indexOf(_type), 1)
        updatePageConfig(_pageConfig)
      }
    },
    [pageConfig],
  )
  return (
    <div className={styles.marketingSwitch}>
      <img src={icon} className={styles.marketingSwitch_img} />
      <div className={styles.marketingSwitch_text}>{title}</div>
      <Switch size="small" onChange={_onChange} checked={_checked} />
    </div>
  )
}

export default MarketingSwitch
