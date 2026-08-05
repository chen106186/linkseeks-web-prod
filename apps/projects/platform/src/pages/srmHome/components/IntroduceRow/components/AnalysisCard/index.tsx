/**
 * @Description 统计行
 */
import React from 'react';
import { Statistic } from 'antd';
import MellowCard from '@/components/MellowCard';
import AnalysisTag from '../AnalysisTag';
import styles from './index.less';

export interface AnalysisCardProps {
  /**
   * 标题
   */
  title: string,
  /**
   * 标题
   */
  count: number,
  /**
   * 图标
   */
  icon: string,
  /**
   * 增长值
   */
  growthValue: number,
}

const AnalysisCard: React.FC<AnalysisCardProps> = (props) => {
  const { title, count, icon, growthValue } = props;
  return (
    <MellowCard
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles['analysis-card']}>
        <div className={styles['analysis-card-content']}>
          <div className={styles['analysis-card-content-left']}>
            <Statistic
              title={title}
              value={count}
            />
          </div>
          <div className={styles['analysis-card-content-right']}>
            <img src={icon} width={48} height={48} />
          </div>
        </div>
        <div className={styles['analysis-card-foot']}>
          <AnalysisTag value={growthValue} />
        </div>
      </div>
    </MellowCard>
  );
};

export default AnalysisCard;