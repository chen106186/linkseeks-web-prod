import { useMemo } from 'react';
import React from 'react';
import styles from './payItem.less';
import classnames from 'classnames';

interface Iprops {
  icon?: string,
  label: string,
  value: number,
  isActive: boolean,
  onClick?: (data: {value: number}) => void
}
const PayItem: React.FC<Iprops> = (props: Iprops) => {
  const { icon, label, value, isActive, onClick } = props;

  const handleClick = () => {
    onClick?.({ value })
  }

  return (
    <div
      className={classnames(styles.container, {
        [styles.active]: isActive
      })}
      onClick={handleClick}
    >
      <img className={styles.img} src={icon} />
      <div>{label}</div>
    </div>
  )
}

export default PayItem;
