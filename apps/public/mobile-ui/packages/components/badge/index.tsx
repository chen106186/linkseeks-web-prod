import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { GodBadgeProps } from '../../types/badge'
import { isPresetColor } from './utils';

export default class GodBaged extends React.Component<
  GodBadgeProps
> {
  public static defaultProps: GodBadgeProps
  public static propTypes: InferProps<GodBadgeProps>

  public render(): JSX.Element {
    const { color, count, overflowCount, showZero } = this.props

    const numberedDisplayCount = (
      (count as number) > (overflowCount as number) ? `${overflowCount}+` : count
    ) as string | number | null;

    const isZero = numberedDisplayCount === '0' || numberedDisplayCount === 0;

    const isHidden = isZero && !showZero;

    const rootClass = classNames(
      'at-badge',
      'at-badge__count',
      {
        [`at-badge-status-${color}`]: isPresetColor(color),
      },
      this.props.className
    )

    const statusStyle: React.CSSProperties = {};
    if (color && !isPresetColor(color)) {
      statusStyle.background = color;
    }

    if (isHidden) {
      return <View />
    }


    return (
      <View className={rootClass} style={statusStyle}>
        {numberedDisplayCount}
      </View>
    )
  }
}

GodBaged.defaultProps = {
  color: '#ff4d4f',
  count: null,
  overflowCount: 99,
  showZero: false
}

GodBaged.propTypes = {
  color: PropTypes.string,
  count: PropTypes.node,
  overflowCount: PropTypes.number,
  showZero: PropTypes.bool
}
