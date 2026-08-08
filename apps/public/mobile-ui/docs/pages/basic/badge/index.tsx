import React from 'react'
import { Button, Fab, Form, View, Text } from '@apps/mobile-ui'
import { CommonEvent } from '@tarojs/components/types/common'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import DocsHeader from '../../../components/doc-header'
import Badge from '../../../../packages/components/badge'

import './index.scss'

interface BadgePageState {
  isWEAPP: boolean
  isALIPAY: boolean
}

export default class BadgePage extends React.Component<{}, BadgePageState> {
  public config: Taro.PageConfig = {
    navigationBarTitleText: 'God UI',
  }

  public constructor(props: any) {
    super(props)
    this.state = {
      isWEAPP: getEnv() === ENV_TYPE.WEAPP,
      isALIPAY: getEnv() === ENV_TYPE.ALIPAY,
    }
  }

  public render(): JSX.Element {
    const { isWEAPP, isALIPAY } = this.state

    return (
      <View className="page">
        {/* S Header */}
        <DocsHeader title="Badge 角标"></DocsHeader>
        {/* E Header */}
        {/* S Body */}
        <View className="doc-body">
          {/* 主操作 */}
          <View className="panel">
            <View className="panel__title">主操作</View>
            <View className="panel__content">
              <Badge count={50} />
            </View>
          </View>
          {/* count 0 showZero 为true仍然显示 */}
          <View className="panel">
            <View className="panel__title">count 0 showZero 为true仍然显示</View>
            <View className="panel__content">
              <Badge count={0} showZero />
            </View>
          </View>
          {/* count 超出overflowCount限制显示  */}
          <View className="panel">
            <View className="panel__title">count 超出overflowCount限制显示</View>
            <View className="panel__content">
              <Badge count={100} />
            </View>
          </View>
          {/* 自定义背景色  */}
          <View className="panel">
            <View className="panel__title">自定义背景色</View>
            <View className="panel__content">
              <Badge count={100} color="#00a98f" />
            </View>
          </View>
          {/* 预设颜色  */}
          <View className="panel">
            <View className="panel__title">预设颜色</View>
            <View className="panel__content">
              <Badge count={100} color="info" />
            </View>
          </View>
        </View>
        {/* E Body */}
      </View>
    )
  }
}
