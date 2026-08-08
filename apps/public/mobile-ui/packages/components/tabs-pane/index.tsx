import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { View } from '@tarojs/components'
import { GodTabsPaneProps } from '../../types/tabs-pane';

export default class GodTabsPane extends React.Component<GodTabsPaneProps> {
  public static defaultProps: GodTabsPaneProps
  public static propTypes: InferProps<GodTabsPaneProps>

  public render(): JSX.Element {
    const { customStyle, className, tabDirection, index, current, display } = this.props

    return (
      <View
        className={classNames(
          {
            'at-tabs-pane': true,
            'at-tabs-pane--vertical': tabDirection === 'vertical',
            'at-tabs-pane--active': index === current,
            'at-tabs-pane--display':  (index === current && display),
            'at-tabs-pane--inactive': index !== current,
            'at-tabs-pane--indisplay':  (index !== current && display),
          },
          className
        )}
        style={customStyle}
      >
        {this.props.children}
      </View>
    )
  }
}

GodTabsPane.defaultProps = {
  customStyle: '',
  className: '',
  tabDirection: 'horizontal',
  index: 0,
  current: 0
}

GodTabsPane.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  tabDirection: PropTypes.oneOf(['horizontal', 'vertical']),
  index: PropTypes.number,
  current: PropTypes.number
}
