/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-23 17:36:23
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 14:25:17
 * @Description: 描述列表
 */
import React, { CSSProperties } from 'react';
import { View, Text } from '@apps/mobile-ui';
import { DescriptionsContextProvider } from './context';
import DescriptionsItem from './Item';
import './index.scss';

interface DescriptionsProps {
  /**
   * 列数，默认 两列
   */
  column?: number,
  /**
   * 冒号
   */
  colon?: string,
  /**
   * 标题
   */
  title?: React.ReactNode,
  /**
   * Item label 宽度
   */
  labelWidth?: string | number,
  /**
   * 自定义内容样式
   */
  customContentStyle?: CSSProperties,

  children?: React.ReactNode,
}

const Descriptions = (props: DescriptionsProps) => {
  const {
    column,
    colon,
    title,
    labelWidth,
    customContentStyle,
    children,
  } = props;
  const itemWidth = `${(100 / (column as number)).toFixed(3)}%`;

  return (
    <View className='descriptions'>
      {!!title && (
        <Text className='descriptions-title'>
          {title}
        </Text>
      )}
      <View className='descriptions-view' style={customContentStyle}>
        <DescriptionsContextProvider value={{ colon, labelWidth, width: itemWidth }}>
          {children}
        </DescriptionsContextProvider>
      </View>
    </View>
  );
};

Descriptions.defaultProps = {
  column: 2,
  colon: ':',
  title: '',
  labelWidth: 'auto',
  customContentStyle: undefined,
  children: null,
};

Descriptions.Item = DescriptionsItem;

export default Descriptions;
