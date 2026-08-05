/*
 * @Description: Switch，统一处理样式
 */
import React from 'react'
import { Switch } from '@apps/mobile-ui'
import { GodSwitchProps } from '@apps/mobile-ui/packages/types/switch'
import { COLOR, PRIMARY } from '@/constants/theme'
import './index.scss'

interface CustomSwitchProps extends GodSwitchProps {}

class CustomSwitch extends React.Component<CustomSwitchProps, any> {
  render() {
    return <Switch className="custom-switch" color={COLOR[PRIMARY]} {...this.props} />
  }
}

export default CustomSwitch
