import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { GodModalActionProps } from '../../../types/modal'

export default class GodModalAction extends React.Component<GodModalActionProps> {
  public static defaultProps: GodModalActionProps
  public static propTypes: InferProps<GodModalActionProps>

  public render(): JSX.Element {
    const rootClass = classNames(
      'at-modal__footer',
      {
        'at-modal__footer--simple': this.props.isSimple
      },
      this.props.className
    )

    return (
      <View className={rootClass}>
        <View className='at-modal__action'>{this.props.children}</View>
      </View>
    )
  }
}

GodModalAction.defaultProps = {
  isSimple: false
}

GodModalAction.propTypes = {
  isSimple: PropTypes.bool
}
