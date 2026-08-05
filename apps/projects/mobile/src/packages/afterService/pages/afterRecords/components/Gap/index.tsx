/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-11 19:50:12
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-03-11 19:55:58
 * @Description: 空白占位组件
 */
import React from 'react';
import { View } from '@apps/mobile-ui';

interface IProps {
  /**
   * 高度，默认 112
   */
  height?: number,
}

const Gap: React.FC<IProps> = (props: IProps) => {
  const { height = 112 } = props;

  return (
    <View
      style={{
        height: `${height}px`,
      }}
    />
  )
};

Gap.defaultProps = {
  height: 112,
};

export default Gap;
