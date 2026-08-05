import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatisticProps {
  /**
   * 标题
   */
  title: string,
  /**
   * 内容
   */
  value: string | number,
  /**
   * 内容前缀
   */
  prefix?: React.ReactNode,
  /**
   * 内容后缀
   */
  suffix?: React.ReactNode,
  /**
   * body style
   */
  bodyStyle?: any,
  /**
   * 标题 style
   */
  titleStyle?: any,
  /**
   * 内容 style
   */
  valueStyle?: any,
}

const Statistic: React.FC<StatisticProps> = (props: StatisticProps) => {
  const {
    title,
    value,
    prefix,
    suffix,
    bodyStyle,
    titleStyle,
    valueStyle,
  } = props;
  return (
    <View className={styles.statistic} style={bodyStyle}>
      <Text
        className={styles['statistic-title']}
        style={{
          ...titleStyle,
        }}
      >
        {title}
      </Text>
      <View className={styles['statistic-wrap']}>
        {prefix && (
          <View className={styles['statistic-prefix']}>
            {prefix}
          </View>
        )}
        <Text
          className={styles['statistic-content']}
          style={{
            ...valueStyle,
          }}
        >
          {value}
        </Text>
        {suffix && (
          <View className={styles['statistic-suffix']}>
            {suffix}
          </View>
        )}
      </View>
    </View>
  )
};

Statistic.defaultProps = {
  prefix: null,
  suffix: null,
  titleStyle: {},
  valueStyle: {},
};

export default Statistic;
