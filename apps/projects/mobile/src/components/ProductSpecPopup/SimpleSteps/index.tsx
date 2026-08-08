/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-15 13:42:39
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-15 18:09:18
 * @Description: 简单的步骤条
 */
import React from 'react';
import { Text, View } from '@apps/mobile-ui';
import styles from './index.module.scss';

export interface StepsItem {
  /**
   * 标题文字
   */
  text: string,
  /**
   * 额外的数据
   */
  extra?: { [key: string]: any },
}

interface SimpleStepsProps {
  /**
   * 步骤
   */
  steps: StepsItem[],
  /**
   * 当前步骤，从 0 开始
   */
  active: number,
  /**
   * 自定义渲染文本
   */
  customText?: (item: StepsItem, isActive: boolean) => React.ReactNode,
}

const SimpleSteps: React.FC<SimpleStepsProps> = (props: SimpleStepsProps) => {
  const {
    steps,
    active = 0,
    customText,
  } = props;


  return (
    <View className={styles['steps']}>
      <View className={styles['steps-line']} />
      <View className={styles['steps-container']}>
        {steps.map((item, index) => (
          <View className={styles['steps-item']} key={index}>
            <View
              className={`${styles['steps-item-circle']} ${index === active ? styles['steps-item-circle__active'] : ''}`}
            />
            {!customText ? (
              <Text
                className={`${styles['steps-item-title']} ${index === active ? styles['steps-item-title__active'] : ''}`}
              >
                {item.text}
              </Text>
            ) : (
              customText(item, index === active)
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

SimpleSteps.defaultProps = {
  customText: undefined,
};

export default SimpleSteps;
