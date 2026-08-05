import React from 'react';
import styles from './index.less';

export interface ListCardProps {
  title?: React.ReactNode,
}
const ListCard: React.FC<ListCardProps> = (props) => {
  return (
    <div className={styles.listCard}>
      <div className={styles.header}>{props.title}</div>
      { props.children }
    </div>
  )
}

ListCard.defaultProps = {
  title: 'header'
}
export default ListCard