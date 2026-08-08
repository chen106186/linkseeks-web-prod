/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-24 15:45:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-06 13:52:32
 * @Description: 描述列表项
 */
import React from 'react';
import { View, Text } from '@apps/mobile-ui';
import classNames from 'classnames';
import descriptionsContext from './context';
import './index.scss';

interface DescriptionsItemProps {
  /**
   * label 文本
   */
  label: string,
  /**
   * label 宽度
   */
  labelWidth?: string | number,
  /**
   * 冒号
   */
  colon?: string,
  /**
   * 自定义外部样式
   */
  customStyle?: React.CSSProperties,
  /**
   * 自定义label样式
   */
  customLabelStyle?: React.CSSProperties,
  /**
   * 自定义label className
   */
  customLabelClassName?: string,
  /**
   * 自定义content样式
   */
  customContentStyle?: React.CSSProperties,
  /**
   * 自定义content className
   */
  customContentClassName?: string,
  /**
   * 自定义content外部容器样式
   */
  customContentWrapStyle?: React.CSSProperties,

  children?: React.ReactNode,
}

const DescriptionsItem: React.FC<DescriptionsItemProps> = (props: DescriptionsItemProps) => {
  const {
    label,
    colon,
    labelWidth,
    customStyle,
    customLabelStyle,
    customLabelClassName,
    customContentStyle,
    customContentClassName,
    customContentWrapStyle,
    children,
  } = props;

  const context = React.useContext(descriptionsContext);

  // 这里包括一层，方便控制样式，如果传入的是非 string，则需要在外边自己编写样式
  const contentNode = typeof children !== 'object' ? (
    <View
      className={classNames('descriptions-item-content', customContentClassName)}
      style={customContentStyle}
    >
      {children}
    </View>
  ) : children;

  const finalColon = colon && colon !== ':' ? colon : context?.colon;
  const finalLabelWidth = labelWidth && labelWidth !== 'auto' ? labelWidth : context?.labelWidth;

  return (
    <View
      className='descriptions-item'
      style={{
        width: context?.width,
        flexBasis: context?.width,
        ...(customStyle || {}),
      }}
    >
      <View
        className='descriptions-item-left'
        style={{
          width: finalLabelWidth,
        }}
      >
        <Text className={classNames('descriptions-item-label', customLabelClassName)} style={customLabelStyle}>
          {label}
        </Text>
        <Text className={classNames('descriptions-item-colon', customLabelClassName)} style={customLabelStyle}>{finalColon}</Text>
      </View>
      <View className='descriptions-item-right' style={customContentWrapStyle}>
        {contentNode}
      </View>
    </View>
  );
};

DescriptionsItem.defaultProps = {
  colon: ':',
  labelWidth: undefined,
  customStyle: {},
  customLabelStyle: {},
  customContentStyle: {},
  customContentWrapStyle: {},
  customLabelClassName: '',
  customContentClassName: '',
  children: null,
};

DescriptionsItem.displayName = 'DescriptionsItem';

export default DescriptionsItem;
