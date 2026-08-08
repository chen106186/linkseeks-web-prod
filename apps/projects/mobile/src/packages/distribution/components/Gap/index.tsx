/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-02 15:32:01
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-02 15:32:01
 * @Description: 间距
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View } from '@apps/mobile-ui'

interface GapProps {
  /**
   * 高度
   */
  height?: number
}

const Gap: React.FC<GapProps> = (props: GapProps) => {
  const { height = 8 } = props
  return <View style={{ height: pxTransform(height) }} />
}

Gap.defaultProps = {
  height: 8,
}

export default Gap
