/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-26 17:32:45
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-12 11:45:32
 * @Description: 基于 antd Card 封装的适合项目 UI 的 Card，使用方式跟 antd Card 一样，这里只是修改了样式
 */
import React from 'react';
import { Card } from 'antd';
import classNames from 'classnames';
import { CardProps } from 'antd/lib/card';
import styles from './index.less';

export interface MellowCardProps extends CardProps {
  /**
   * 是否占满父级的高度，一般用于多列使用改组件的情况
   */
  fullHeight?: boolean;
}

const MellowCard: React.FC<MellowCardProps> = props => {
  const { children, fullHeight, ...rest } = props;
  const cls = classNames(styles['mellow-card'], {
    [styles.fullHeight]: fullHeight,
    [styles['mellow-card-hasTitle']]: !!rest.title,
  });

  return (
    <div className={cls}>
      <Card bordered={false} {...rest}>
        {children}
      </Card>
    </div>
  )
};

export default MellowCard;
