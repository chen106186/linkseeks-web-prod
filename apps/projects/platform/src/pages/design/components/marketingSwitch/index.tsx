import React, { useCallback, useRef } from 'react'
import { Switch } from 'antd'
import { cloneDeep } from 'lodash'
import {
  updatePageConfig,
  STATE_PROPS,
  getComponentKey,
  SelectedInfoType,
  PageConfigType,
  addComponentByName,
} from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { MARKETING_COMPONENTS_NAMES } from '@apps/design-ui'
import styles from './index.less'

interface MarketingSwitchProps {
  type: number
  key: MARKETING_COMPONENTS_NAMES
  title: string | React.ReactNode
  icon: any
  marketConfigs: any
  layoutType: LAYOUT_TYPE
}

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}

const MarketingSwitch: React.FC<MarketingSwitchProps> = (props: any) => {
  const { type, title, key, icon, marketConfigs, layoutType } = props
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])
  const _checked = Object.keys(pageConfig).indexOf(`11-${type}`) >= 0

  const _onChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        let _pageConfig: any = { ...pageConfig }
        const _marketingConfig = marketConfigs[`marketingConfig_${type}`]
        const insertKey = getComponentKey(
          layoutType === LAYOUT_TYPE.shop ? 'MobileShopCommodity' : 'SuggestProduct',
          pageConfig,
        )
        _pageConfig = cloneDeep({ ..._pageConfig, ..._marketingConfig })
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
