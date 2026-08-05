import { PageConfigType, SelectedInfoType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import PropsSettings from './propsSettings'

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
  adornId: number
  type: 'shop' | 'own'
  shopId: number
}
const SettingPanel = (props) => {
  const { selectedInfo } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo', 'pageConfig'])

  return (
    <PropsSettings
      layoutType={props.layoutType}
      type={props.type}
      selectedInfo={selectedInfo}
      adornId={props.adornId}
      shopId={props.shopId}
    />
  )
}

export default SettingPanel
