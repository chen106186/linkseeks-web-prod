/*
 * @Description: 穿梭机
 */
import React from 'react'
import { View, Text, Icons } from '@apps/mobile-ui'
import './index.scss'

interface ShuttleProps {
  /**
   * 描述
   */
  describe: string
  /**
   * 点击跳转触发
   */
  onJump: () => void
  /**
   * 自定义描述样式
   */
  customDescribeStyle?: Object
}

const Shuttle: React.FC<ShuttleProps> = (props: ShuttleProps) => {
  const { describe, onJump, customDescribeStyle = {} } = props

  const handleJump = () => {
    if (onJump) {
      onJump()
    }
  }

  return (
    <View className="shuttle" onClick={handleJump}>
      <Text className="shuttle-describe" style={customDescribeStyle}>
        {describe}
      </Text>
      <Icons name="ChevronRight" size={12} color="#C0C4CC" />
    </View>
  )
}

export default Shuttle
