import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { CommonEvent } from '@tarojs/components/types/common'
import View from '../view'
import Icons from '../icons'
import { GodRateProps } from '../../types/rate'
import { pxTransform } from '../../common/utils'

export default class GodRate extends React.Component<GodRateProps> {
  public static defaultProps: GodRateProps
  public static propTypes: InferProps<GodRateProps>

  private handleClick(event: CommonEvent): void {
    this.props.onChange && this.props.onChange(event)
  }

  public render(): JSX.Element {
    const { customStyle, className, value = 0, max = 5, isFill, size, margin = 5 } = this.props

    const iconStyle = {
      marginRight: pxTransform(margin),
    }

    const iconName = isFill ? 'StarFill' : 'Star'

    // 生成星星颜色 className 数组，方便在jsx中直接map
    const classNameArr: string[] = []
    const floorValue = Math.floor(value)
    const ceilValue = Math.ceil(value)
    for (let i = 0; i < max; i++) {
      if (floorValue > i) {
        classNameArr.push('at-rate__icon at-rate__icon--on')
      } else if (ceilValue - 1 === i) {
        classNameArr.push('at-rate__icon at-rate__icon--half')
      } else {
        classNameArr.push('at-rate__icon at-rate__icon--off')
      }
    }

    return (
      <View className={classNames('at-rate', className)} style={customStyle}>
        {classNameArr.map((cls, i) => (
          <View
            className={cls}
            key={`at-rate-star-${i}`}
            style={iconStyle}
            onClick={this.handleClick.bind(this, i + 1)}
          >
            <Icons name={iconName} size={size} />
            <View className="at-rate__left">
              <Icons name={iconName} size={size} />
            </View>
          </View>
        ))}
      </View>
    )
  }
}

GodRate.defaultProps = {
  customStyle: '',
  className: '',
  size: 12,
  value: 0,
  max: 5,
  margin: 5,
  isFill: true,
}

GodRate.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isFill: PropTypes.bool,
  value: PropTypes.number,
  max: PropTypes.number,
  margin: PropTypes.number,
  onChange: PropTypes.func,
}
