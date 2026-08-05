import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { Text, View } from '@tarojs/components'
import { GodTimelineProps } from '../../types/timeline'

export default class GodTimeline extends React.Component<GodTimelineProps> {
  public static defaultProps: GodTimelineProps
  public static propTypes: InferProps<GodTimelineProps>

  public render(): JSX.Element {
    const { pending, items, customStyle } = this.props

    const rootClassName = ['at-timeline']
    if (pending) rootClassName.push('at-timeline--pending')

    const rootClassObject = {
      'at-timeline--pending': pending
    }

    const itemElems = items.map((item, index) => {
      const { title = '', color, icon, content = [] } = item

      const iconClass = classNames({
        'at-icon': true,
        [`at-icon-${icon}`]: icon
      })

      const itemRootClassName = ['at-timeline-item']
      if (color) itemRootClassName.push(`at-timeline-item--${color}`)

      const dotClass: string[] = []
      if (icon) {
        dotClass.push('at-timeline-item__icon')
      } else {
        dotClass.push('at-timeline-item__dot')
      }

      return (
        <View
          className={classNames(itemRootClassName)}
          key={`at-timeline-item-${index}`}
        >
          <View className='at-timeline-item__tail'></View>
          <View className={classNames(dotClass)}>
            {icon && <Text className={iconClass}></Text>}
          </View>
          <View className='at-timeline-item__content'>
            <View className='at-timeline-item__content-item'>{title}</View>
            {content.map((sub, subIndex) => (
              <View
                className='at-timeline-item__content-item at-timeline-item__content--sub'
                key={subIndex}
              >
                {sub}
              </View>
            ))}
          </View>
        </View>
      )
    })
    return (
      <View
        className={classNames(
          rootClassName,
          rootClassObject,
          this.props.className
        )}
        style={customStyle}
      >
        {itemElems}
      </View>
    )
  }
}

GodTimeline.defaultProps = {
  pending: false,
  items: [],
  customStyle: {}
}

GodTimeline.propTypes = {
  pending: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}
