/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-31 17:52:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-18 10:20:13
 * @Description: 状态 tag
 */
import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export const STATUS_TYPE = ['success', 'warning', 'default', 'danger', 'primary', 'nobility', 'active']

export type StatusTagProps = {
  type: 'success' | 'warning' | 'default' | 'danger' | 'primary' | 'nobility' | 'active';
  title: React.ReactNode;
  style?: React.CSSProperties,
  className?: string,
};

const StatusTag: React.FC<StatusTagProps> = ({ type, title, style, className }) => {
  const cls = classNames(styles.tag, className, styles[`tag__${type}`]);
  return (
    <span className={cls} style={style}>{title}</span>
  );
};

export default StatusTag;
