import classNames from 'classnames'
import React from 'react'
import { View } from '@tarojs/components'
import { GodActionSheetBodyProps } from '../../../types/action-sheet'

export default class GodActionSheetBody extends React.Component<GodActionSheetBodyProps> {
  public render(): JSX.Element {
    const rootClass = classNames('at-action-sheet__body', this.props.className)
    return (
      <View className={rootClass} style={this.props.bodyStyle}>
        {this.props.children}
      </View>
    )
  }
}
