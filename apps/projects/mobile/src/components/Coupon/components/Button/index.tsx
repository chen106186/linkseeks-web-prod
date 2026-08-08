/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-25 14:44:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-04-25 15:00:28
 * @Description: 自定义按钮
 */
import React, { CSSProperties } from 'react';
import {
  View,
  Text,
  Loading
} from '@apps/mobile-ui';
import styles from './index.module.scss';

interface ButtonProps {
  /**
   * 按钮类型，可选值有 primary
   */
  type?: 'danger',
  /**
   * 按钮大小，可选值有 small
   */
  size?: 'small',
  /**
   * 是否圆角
   */
  round?: boolean,
  /**
   * 是否为朴素按钮
   */
  plain?: boolean,
  /**
   * 是否是块级元素
   */
  block?: boolean,
  /**
   * 是否加载中
   */
  loading?: boolean,
  /**
   * 是否禁用
   */
  disabled?: boolean,
  /**
   * 点击事件
   */
  onPress?: () => void,
  /**
   * 自定义样式
   */
  customStyle?: CSSProperties,

  children?: React.ReactNode,
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const {
    type,
    size,
    round,
    plain,
    block,
    loading,
    disabled,
    onPress,
    customStyle,
    children,
  } = props;

  const handlePress = () => {
    if (onPress && !loading && !disabled) {
      onPress();
    }
  };

  // 这里包括一层，方便控制样式，如果传入的是非 string，则需要在外边自己编写样式
  const isTextChild = typeof children === 'string' || typeof children === 'number';

  return (
    <View
      onClick={handlePress}
      className={block ? styles['button-wrap__block'] : ''}
    >
      <View
        className={`${styles['button']} ${styles[`button-${type}`]} ${styles[`button-${size}`]} ${plain ? styles['button__plain'] : ''} ${round ? styles['button__round'] : ''} ${block ? styles['button__block'] : ''} ${disabled ? styles['button__disabled'] : ''}`}
        style={customStyle}
      >
        {loading && (
          <Loading color='#FFFFFF' />
        )}
        {isTextChild ? (
          <Text
            className={`${styles['button-text']} ${styles[`button-${type}-text`]} ${styles[`button-${size}-text`]} ${plain ? styles[`button-${type}-text__plain`] : ''} ${disabled ? styles[`button-text__disabled`] : ''}`}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  )
};

Button.defaultProps = {
  type: undefined,
  size: undefined,
  round: false,
  plain: false,
  block: false,
  loading: false,
  disabled: false,
  onPress: undefined,
  customStyle: {},
  children: null,
};

export default Button;
