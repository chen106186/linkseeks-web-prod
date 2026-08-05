/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-03 20:08:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-03 21:01:02
 * @Description: 列表书架
 */
import React from 'react';
import { View, Text, Icons } from '@apps/mobile-ui';
import styles from './index.module.scss';

interface BookshelfProps {
  /**
   * 标题
   */
  title: React.ReactNode,
  /**
   * 头部拓展
   */
  extra?: React.ReactNode,
  /**
   * 底部左侧内容
   */
  footLeft?: React.ReactNode,
  /**
   * 底部右侧内容
   */
  footRight?: React.ReactNode,
  /**
   * 是否展示右侧箭头
   */
  hasArrow?: boolean,
  /**
   * 点击事件触发
   */
  onPress?: () => void,
  /**
   * 内容
   */
  children?: React.ReactNode,
  /**
   * 自定义内容区块样式
   */
  customContentStyle?: React.CSSProperties,
  /**
   * 自定义头部样式
   */
  customHeadStyle?: React.CSSProperties,
  /**
   * 标题左侧边框
   */
  ribbon?: boolean;
}

const Bookshelf: React.FC<BookshelfProps> = (props: BookshelfProps) => {
  const {
    title,
    extra,
    footLeft,
    footRight,
    hasArrow,
    onPress,
    children,
    customContentStyle,
    customHeadStyle,
    ribbon,
  } = props;

  const isTextTitle = typeof title === 'string' || typeof title === 'number';

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <View
      className={styles['bookshelf']}
      onClick={handlePress}
    >
      <View className={styles['bookshelf-left']}>
        <View className={styles['bookshelf-head']} style={customHeadStyle}>
          <View className={styles['bookshelf-head-titleWrap']}>
            {ribbon ? (
              <View className={styles['bookshelf-head-ribbon']} />
            ) : null}
            {isTextTitle ? (
              <Text className={styles['bookshelf-head-title']}>
                {title}
              </Text>
            ) : (
              title
            )}
          </View>
          {extra ? (
            <View className={styles['bookshelf-head-extra']}>
              {extra}
            </View>
          ) : null}
        </View>
        <View className={styles['bookshelf-body']} style={customContentStyle}>
          {children}
        </View>
        {(footLeft || footRight) ? (
          <View className={styles['bookshelf-foot']}>
            <View className={styles['bookshelf-foot-left']}>
              {footLeft}
            </View>
            <View className={styles['bookshelf-foot-right']}>
              {footRight}
            </View>
          </View>
        ) : null}
      </View>
      {hasArrow ? (
        <View className={styles['bookshelf-right']}>
          <Icons name='ChevronRight' size={14} color='#C0C4CC' />
        </View>
      ) : null}
    </View>
  );
};

Bookshelf.defaultProps = {
  extra: null,
  footLeft: null,
  footRight: null,
  onPress: undefined,
  hasArrow: false,
  children: null,
  customContentStyle: {},
  customHeadStyle: {},
  ribbon: true,
};

export default Bookshelf;
