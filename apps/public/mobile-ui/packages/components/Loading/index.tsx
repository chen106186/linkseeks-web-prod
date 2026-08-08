import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { pxTransform } from '../../common/utils'

interface GodLoadingProps {
  size?: string | number
  color?: string | number
}

export default class GodLoading extends React.Component<GodLoadingProps> {
  public static defaultProps: GodLoadingProps
  public static propTypes: InferProps<GodLoadingProps>

  public render(): JSX.Element {
    const { color, size } = this.props
    const loadingSize = typeof size === 'string' ? size : String(size)
    const sizeStyle = {
      width: size ? `${pxTransform(parseInt(loadingSize))}` : '',
      height: size ? `${pxTransform(parseInt(loadingSize))}` : ''
    }
    const colorStyle = {
      border: color ? `1px solid ${color}` : '',
      borderColor: color ? `${color} transparent transparent transparent` : ''
    }
    const ringStyle = Object.assign({}, colorStyle, sizeStyle)
    return (
      <View className='at-loading' style={sizeStyle}>
        <View className='at-loading__ring' style={ringStyle}></View>
        <View className='at-loading__ring' style={ringStyle}></View>
        <View className='at-loading__ring' style={ringStyle}></View>
      </View>
    )
  }
}

GodLoading.defaultProps = {
  size: 0,
  color: ''
}

GodLoading.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
