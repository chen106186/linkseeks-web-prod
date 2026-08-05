/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-09 10:05:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-09 10:13:18
 * @Description: 船票组件
 */
import React from 'react';
import { View } from '@apps/mobile-ui';
import styles from './index.module.scss';

interface IProps {
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties,

  children?: React.ReactNode,
}

const SteamerTicket: React.FC<IProps> = (props: IProps) => {
  const { customStyle, children } = props;

  return (
    <View className={styles['ticket']} style={customStyle}>
      {children}
      <View className={styles['ticket-ribbon']} />
    </View>
  );
};

SteamerTicket.defaultProps = {
  customStyle: {},
  children: null,
};

export default SteamerTicket;
