/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-29 15:03:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-08 14:58:11
 * @Description:
 */
import React from 'react';
import { View } from '@tarojs/components';
// import { GridContextProvider } from './context';
import GridItem from './Item';
import './index.scss';

interface GridProps {
  /**
   * 列数
   */
  column?: number;
  /**
   * 格子之间的间距
   */
  gutter?: number;
  /**
   * 是否显示边框
   */
  border?: boolean;
  /**
   * 格子内容排列的方向，可选值为 horizontal / vertical
   */
  direction?: 'vertical' | 'horizontal';

  children?: React.ReactNode,
}

const Grid = (props: GridProps) => {
  const {
    column,
    gutter,
    border,
    direction,
    children,
  } = props;
  const childrenCount = React.Children.count(children);
  const itemWidth = direction === 'vertical' ? `${(100 / (column as number)).toFixed(3)}%` : `${(100 / childrenCount).toFixed(3)}%`;
  const isHasBorder = border && !gutter;
  const gutterHalf = gutter ? Number.parseInt(`${(gutter as number) / 2}`, 10) : 0;

  const childNodes = React.Children.map(children, (child: any, index: number) => {
    if (child) {
      const childProps = child.props || {};
      if (child.type.displayName === 'GridItem') {
        return React.cloneElement(child, {
          ...childProps,
          width: itemWidth,
          // 当前索引取余不等于 1 或者 布局方向是 水平 方向，
          // 且索引值 不等于 0 的时候设置 左边框
          borderLeft: (isHasBorder && (index + 1) % (column as number) !== 1) || (isHasBorder && direction === 'horizontal' && index !== 0),
          // 布局方向是 垂直 方向 且 索引值加 1 大于
          // column列数 的时候设置 上边框
          // borderTop: isHasBorder && direction === 'vertical' && (index + 1) > (column as number),
          style: {
            padding: gutter ? gutterHalf : 0,
            ...child.props.style,
          },
        });
      }
    }
    return child;
  });

  return (
    <View
      className='grid'
      style={{
        flexWrap: direction === 'vertical' ? 'wrap' : 'nowrap',
        margin: gutter ? -gutterHalf : 0,
      }}
    >
      {childNodes}
    </View>
  );
};

Grid.defaultProps = {
  column: 3,
  gutter: 0,
  border: true,
  direction: 'vertical',
  children: null,
};

Grid.Item = GridItem;

export default Grid;
