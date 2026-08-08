import React, { ReactNode } from 'react';
import styles from './index.less';

interface TradeItemProps {
  width?: number | string; 
  children?: ReactNode;
};

const TradeItem: React.FC<TradeItemProps> = ({
  width = '50%', 
  children, 
}) => {
  return (
    <li 
      className={styles['tradeWrap-item']}
      style={{
        width, 
      }}
    >
      <div className={styles['tradeWrap-item-content']}>
        {children}
      </div>
    </li>
  );
};

class TradeWrap extends React.Component {
  static TradeItem = TradeItem;

  render() {
    const { children } = this.props;

    return (
      <ul className={styles.tradeWrap}>
        {children}
      </ul>
    );
  };
}

export default TradeWrap;