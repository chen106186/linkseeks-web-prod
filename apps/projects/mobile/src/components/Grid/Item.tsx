import React from 'react';
import { View } from '@tarojs/components';
import { Icons } from '@apps/mobile-ui';
import './index.scss';

interface GridItemProps {
  /**
   * Icon: https://oblador.github.io/react-native-vector-icons/
   */
  icon?: string,
  /**
   * Icon 大小
   */
  iconSize?: number,
  /**
   * 标题
   */
  title?: React.ReactNode,
  /**
   * Item 宽度
   */
  width?: string | number,
  /**
   * 是否显示左边框
   */
  borderLeft?: boolean,
  /**
   * 是否显示上边框
   */
  borderTop?: boolean,
  /**
   * 外部容器自定义样式
   */
  style?: any,
  /**
   * 内部自定义样式
   */
  contentStyle?: any,
  /**
   * 点击事件
   */
  onClick?: () => void | undefined,

  children?: React.ReactNode,
}

const GridItem: React.FC<GridItemProps> = (props: GridItemProps) => {
  const {
    icon,
    iconSize,
    title,
    width,
    borderLeft,
    borderTop,
    style,
    contentStyle,
    onClick,
    children,
  } = props;

  // 这里包括一层，方便控制样式，如果传入的是非 string，则需要在外边自己编写样式
  const contentNode = typeof children === 'string' ? (
    <View
      className='grid-item-title'
    >
      {children}
    </View>
  ) : children;

  const isHasChildren = !!children;

  const handlePress = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <View
      className='grid-item'
      style={{
        width,
        ...style,
      }}
    >
      <View
        style={{height:'100%'}}
        onClick={handlePress}
      >
        <View
          className='grid-item-wrap'
          style={{
            borderTopWidth: borderTop ? 1 : 0,
            height:'100%',
            ...contentStyle,
          }}
        >
          {!isHasChildren && (
            <View className='grid-item-icon'>
              <Icons name={icon} size={iconSize} color='#303133' />
            </View>
          )}
          {!isHasChildren && (
            <View className='grid-item-title'>
              {title}
            </View>
          )}
          {contentNode}
          {borderLeft && (
            <View className='grid-item-left-border' />
          )}
        </View>
      </View>
    </View>
  );
};

GridItem.defaultProps = {
  icon: 'smileo',
  iconSize: 28,
  title: '标题',
  width: '100%',
  borderLeft: true,
  borderTop: false,
  style: {},
  contentStyle: {},
  onClick: undefined,
  children: null,
};

GridItem.displayName = 'GridItem';

export default GridItem;
