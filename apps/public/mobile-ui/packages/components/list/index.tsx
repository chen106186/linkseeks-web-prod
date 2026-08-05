import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { GodListProps } from '../../types/list'

export default class GodList extends React.Component<GodListProps> {
  public static defaultProps: GodListProps
  public static propTypes: InferProps<GodListProps>

  public render(): JSX.Element {
    const rootClass = classNames(
      'at-list',
      {
        'at-list--no-border': !this.props.hasBorder
      },
      this.props.className
    )

    return <View className={rootClass}>{this.props.children}</View>
  }
}

GodList.defaultProps = {
  hasBorder: true
}

GodList.propTypes = {
  hasBorder: PropTypes.bool
}
