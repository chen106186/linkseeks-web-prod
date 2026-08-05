/*
 * @Author: XieZhiXiong
 * @Date: 2021-03-15 18:17:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-11 15:13:56
 * @Description: 售后评价
 */
import React, { CSSProperties } from 'react';
import { useIntl } from '@linkseeks/i18n';
import {  View, Text, Rate } from '@apps/mobile-ui';
import MellowCard from '@/components/MellowCard';
import Cell from '@/components/Cell';
import styles from './index.module.scss';

interface IProps {
  /**
   * 评分
   */
  level: number,
  /**
   * 评论内容
   */
  content: string,
  /**
   * 自定义外部样式
   */
  customStyle?: CSSProperties,
}

const Evaluation: React.FC<IProps> = (props: IProps) => {
  const { level, content, customStyle } = props;

  const intl = useIntl()

  return (
    <MellowCard
      title={intl.formatMessage({id: 'afterRecords.components.evaluation.title',  defaultMessage: '售后评价' })}
      style={customStyle}
      bodyStyle={{
        padding: 0,
      }}
    >
      <Cell>
        <Cell.Item
          title={intl.formatMessage({id: 'afterRecords.components.evaluation.level.title',  defaultMessage: '售后满意度' })}
          value={(
            <View className={styles['as-evaluation-rate']}>
              <Rate value={level} size={20} />
              <Text className={styles['as-evaluation-rate-text']}>{`${level}${intl.formatMessage({id: 'afterRecords.components.evaluation.level',  defaultMessage: '分' })}`}</Text>
            </View>
          )}
        />
        <Cell.Item
          title={intl.formatMessage({id: 'afterRecords.components.evaluation.content',  defaultMessage: '售后评价' })}
          value={content}
        />
      </Cell>
    </MellowCard>
  );
};

Evaluation.defaultProps = {
  customStyle: {},
};

export default Evaluation;
