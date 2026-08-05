import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { GodActionSheetItemProps } from '../../../../types/action-sheet'

export default class GodActionSheetItem extends React.Component<
  GodActionSheetItemProps
> {
  public static defaultProps: GodActionSheetItemProps
  public static propTypes: InferProps<GodActionSheetItemProps>

  private handleClick = (args: any): void => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(args)
    }
  }

  public render(): JSX.Element {
    const rootClass = classNames('at-action-sheet__item', this.props.className)

    return (
      <View className={rootClass} onClick={this.handleClick}>
        {this.props.children}
      </View>
    )
  }
}

GodActionSheetItem.propTypes = {
  onClick: PropTypes.func
}
