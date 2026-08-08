import classNames from 'classnames'
import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import { Image, OpenData, Text, View } from '@tarojs/components'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import { GodAvatarProps, GodAvatarState } from '../../types/avatar'

const SIZE_CLASS = {
  large: 'large',
  normal: 'normal',
  small: 'small',
}

export default class GodAvatar extends React.Component<GodAvatarProps, GodAvatarState> {
  public static defaultProps: GodAvatarProps
  public static propTypes: InferProps<GodAvatarProps>

  public constructor(props: GodAvatarProps) {
    super(props)
    this.state = {
      isWEAPP: getEnv() === ENV_TYPE.WEAPP,
    }
  }

  public render(): JSX.Element {
    const { size, circle, image, text, openData, customStyle } = this.props
    const rootClassName = ['at-avatar']
    const iconSize = SIZE_CLASS[size || 'normal']
    const classObject = {
      [`at-avatar--${iconSize}`]: iconSize,
      'at-avatar--circle': circle,
    }

    let letter = ''
    if (text) letter = text[0]

    let elem: React.ReactNode
    if (openData && openData.type === 'userAvatarUrl' && this.state.isWEAPP) {
      elem = <OpenData type={openData.type}></OpenData>
    } else if (image) {
      elem = <Image className="at-avatar__img" src={image} />
    } else {
      elem = <Text className="at-avatar__text">{letter}</Text>
    }
    return (
      <View className={classNames(rootClassName, classObject, this.props.className)} style={customStyle}>
        {elem}
      </View>
    )
  }
}

GodAvatar.defaultProps = {
  size: 'normal',
  circle: false,
  text: '',
  image: '',
  customStyle: {},
  className: '',
}

GodAvatar.propTypes = {
  size: PropTypes.oneOf(['large', 'normal', 'small']),
  circle: PropTypes.bool,
  text: PropTypes.string,
  image: PropTypes.string,
  openData: PropTypes.object,
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
}
