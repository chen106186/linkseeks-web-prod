/*
 * @Description: Inputs输入框，统一处理样式
 */
import React from 'react'
import { Input, View } from '@apps/mobile-ui'
import { GodInputProps } from '@apps/mobile-ui/packages/types/input'
import './index.scss'

interface CustomInputProps extends Omit<GodInputProps, 'name' | 'onChange'> {
  name?: string
  onChange?: (value: string) => void
  /**
   * 预览模式，默认 false
   */
  preview?: boolean
}

class CustomInput extends React.Component<CustomInputProps, any> {
  render() {
    const { preview } = this.props

    if (preview) {
      return (
        <View className="custom-input-text" style={this.props.style}>
          {this.props.value}
        </View>
      )
    }

    return <Input className="custom-input" border={false} {...this.props} />
  }
}

export default CustomInput
