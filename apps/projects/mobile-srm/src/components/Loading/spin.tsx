/*
 * @Author: XieZhiXiong
 * @Date: 2021-04-25 14:34:23
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-04-25 14:34:25
 * @Description: 菊花
 */
import React, { useEffect, useRef, CSSProperties } from 'react'
// import { Animated, Easing, ViewStyle } from 'react-native';
import { View, Icons } from '@apps/mobile-ui'
// import useAppStyle from '../../hooks/useAppStyle';
import './index.scss'

interface IProps {
  /**
   * 颜色，默认 #C0C4CC
   */
  color?: string
  /**
   * 加载图标大小，默认 24
   */
  size?: number
  /**
   * 自定义样式
   */
  customStyle?: CSSProperties
}

const Spin: React.FC<IProps> = (props: IProps) => {
  const { color, size = 14, customStyle } = props
  // const myStyle = useAppStyle(styles);

  // const rotate = useRef(new Animated.Value(0)).current;

  // const spin = () => {
  //   Animated.loop(
  //     Animated.timing(rotate, {
  //       toValue: 1,
  //       duration: 800,
  //       useNativeDriver: false,
  //       easing: Easing.ease,
  //     }),
  //   ).start();
  // };

  useEffect(() => {
    // spin();
    return () => {
      // rotate.stopAnimation();
    }
  }, [])

  // const spinValue = rotate.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '360deg'],
  // });

  return (
    <View
      className="components-loading-icon"
      // style={{
      //   transform: [
      //     {
      //       rotate: spinValue,
      //     },
      //   ],
      // }}
    >
      <Icons name="loading2" size={size} color={color} />
    </View>
  )
}

Spin.defaultProps = {
  color: '#C0C4CC',
  size: 14,
  customStyle: {},
}

export default Spin
