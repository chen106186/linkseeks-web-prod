import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { CommonEvent } from '@tarojs/components/types/common'
import { GodFabProps } from '../../types/fab'

export default class GodFab extends React.Component<GodFabProps> {
  public static defaultProps: GodFabProps
  public static propTypes: InferProps<GodFabProps>

  private onClick(e: CommonEvent): void {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e)
    }
  }

  public render(): JSX.Element {
    const { size, className, children } = this.props

    const rootClass = classNames('at-fab', className, {
      [`at-fab--${size}`]: size
    })

    return (
      <View className={rootClass} onClick={this.onClick.bind(this)}>
        {children}
      </View>
    )
  }
}

GodFab.propTypes = {
  size: PropTypes.oneOf(['normal', 'small']),
  onClick: PropTypes.func
}

GodFab.defaultProps = {
  size: 'normal'
}
