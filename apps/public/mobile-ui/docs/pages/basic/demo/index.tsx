import { CountDown, Input } from '@apps/mobile-ui'
import { Input as TaroInput } from '@tarojs/components'
import { View } from '@tarojs/components'
import React from 'react'

export interface DemoProps {}

const Demo: React.FC<DemoProps> = (props) => {
  return (
    <View>
      <CountDown count={60}>{() => <View>123</View>}</CountDown>
    </View>
  )
}

Demo.defaultProps = {}

export default Demo
