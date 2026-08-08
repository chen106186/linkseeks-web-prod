import classNames from 'classnames'
import React from 'react'
import { View } from '@tarojs/components'
import { GodActionSheetHeaderProps } from '../../../types/action-sheet'

export default class GodActionSheetHeader extends React.Component<
  GodActionSheetHeaderProps
> {
  public render(): JSX.Element {
    const rootClass = classNames(
      'at-action-sheet__header',
      this.props.className
    )

    return <View className={rootClass}>{this.props.children}</View>
  }
}
