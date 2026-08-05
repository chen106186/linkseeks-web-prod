/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-12 14:00:38
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-12 14:37:54
 * @Description: 带描述信息的进度条
 */
import React from 'react';
import { Progress } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import styles from './index.less';

export interface DescriptionsItem {
  /**
   * 标题
   */
  title: React.ReactNode,
  /**
   * 值
   */
  value: React.ReactNode,
  /**
   * 自定义渲染
   */
  customRender?: React.ReactNode, 
}

interface IProps extends ProgressProps {
  /**
   * 描述列表
   */
  descriptions: DescriptionsItem[],
}

const DescProgress: React.FC<IProps> = (props: IProps) => {
  const {
    descriptions,
    ...rest
  } = props;

  return (
    <div className={styles['desc-progress']}>
      <div className={styles['desc-progress-statistic']}>
        {descriptions.map((item, index) => (
          !item.customRender ? (
            <div key={index} className={styles['desc-progress-statistic-item']}>
              <div className={styles['desc-progress-statistic-item-title']}>
                {item.title}
              </div>
              <div className={styles['desc-progress-statistic-item-content']}>
                {item.value}
              </div>
            </div>
          ) : (
            item.customRender
          )
        ))}
      </div>
      <Progress strokeColor="#6B778C" showInfo={false} {...rest} />
    </div>
  );
};

export default DescProgress;
