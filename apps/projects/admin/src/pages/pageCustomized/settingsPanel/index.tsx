import React from 'react'
import { SelectedInfoType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import PropsSettings from './propsSettings'

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  adornId: number
  layoutType: LAYOUT_TYPE
}
const SettingPanel = (props) => {
  const { selectedInfo } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo'])

  return <PropsSettings selectedInfo={selectedInfo} adornId={props.adornId} layoutType={props.layoutType} />
}

export default SettingPanel
