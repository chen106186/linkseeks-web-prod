import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { Text } from '@tarojs/components'
import { GodIconProps } from '../../types/icon'
import { mergeStyle, pxTransform } from '../../common/utils'

export default class GodIcon extends React.Component<GodIconProps> {
  public static defaultProps: GodIconProps
  public static propTypes: InferProps<GodIconProps>

  private handleClick(): void {
    this.props.onClick && this.props.onClick(arguments as any)
  }

  public render(): JSX.Element {
    const { customStyle, className, prefixClass, name, size, color } = this.props

    const rootStyle = {
      fontSize: pxTransform(parseInt(String(size)) * 1),
      color,
    }

    const iconName = name ? `${prefixClass}-${name}` : ''
    return (
      <Text
        className={classNames(prefixClass, iconName, className)}
        style={mergeStyle(rootStyle, customStyle as object)}
        onClick={this.handleClick.bind(this)}
      ></Text>
    )
  }
}

GodIcon.defaultProps = {
  customStyle: '',
  className: '',
  prefixClass: 'icon',
  name: '',
  color: '',
  size: 24,
}

GodIcon.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  prefixClass: PropTypes.string,
  name: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
}
