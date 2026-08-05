import classNames from 'classnames'
import React from 'react'
import { View } from '@tarojs/components'
import { GodModalHeaderProps } from '../../../types/modal'

export default class GodModalHeader extends React.Component<GodModalHeaderProps> {
  public render(): JSX.Element {
    const rootClass = classNames('at-modal__header', this.props.className)
    return <View className={rootClass}>{this.props.children}</View>
  }
}
