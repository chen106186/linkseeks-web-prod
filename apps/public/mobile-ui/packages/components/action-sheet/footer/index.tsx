import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { GodActionSheetFooterProps } from '../../../types/action-sheet'

export default class GodActionSheetFooter extends React.Component<
  GodActionSheetFooterProps
> {
  public static defaultProps: GodActionSheetFooterProps
  public static propTypes: InferProps<GodActionSheetFooterProps>

  private handleClick = (...args: any[]): void => {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(...args)
    }
  }

  public render(): JSX.Element {
    const rootClass = classNames(
      'at-action-sheet__footer',
      this.props.className
    )

    return (
      <View onClick={this.handleClick} className={rootClass}>
        {this.props.children}
      </View>
    )
  }
}

GodActionSheetFooter.propTypes = {
  onClick: PropTypes.func
}
