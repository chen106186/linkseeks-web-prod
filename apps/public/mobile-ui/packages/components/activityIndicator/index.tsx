import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { Text, View } from '@tarojs/components'
import { GodActivityIndicatorProps } from '../../types/activity-indicator'
import GodLoading from '../Loading'

export default class GodActivityIndicator extends React.Component<
  GodActivityIndicatorProps
> {
  public static defaultProps: GodActivityIndicatorProps
  public static propTypes: InferProps<GodActivityIndicatorProps>

  public render(): JSX.Element {
    const { color, size, mode, content, isOpened } = this.props

    const rootClass = classNames(
      'at-activity-indicator',
      {
        'at-activity-indicator--center': mode === 'center',
        'at-activity-indicator--isopened': isOpened
      },
      this.props.className
    )

    return (
      <View className={rootClass}>
        <View className='at-activity-indicator__body'>
          <GodLoading size={size} color={color} />
        </View>
        {content && (
          <Text className='at-activity-indicator__content'>{content}</Text>
        )}
      </View>
    )
  }
}

GodActivityIndicator.defaultProps = {
  size: 0,
  mode: 'normal',
  color: '',
  content: '',
  className: '',
  isOpened: true
}

GodActivityIndicator.propTypes = {
  size: PropTypes.number,
  mode: PropTypes.string,
  color: PropTypes.string,
  content: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  isOpened: PropTypes.bool
}
