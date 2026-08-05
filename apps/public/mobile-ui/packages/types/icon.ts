import { ComponentClass } from 'react'
import { CommonEventFunction } from '@tarojs/components/types/common'

import GodComponent, { GodIconBaseProps } from './base'

export interface GodIconProps extends GodComponent, GodIconBaseProps {
  onClick?: CommonEventFunction,
}

declare const GodIcon: ComponentClass<GodIconProps>

export default GodIcon
