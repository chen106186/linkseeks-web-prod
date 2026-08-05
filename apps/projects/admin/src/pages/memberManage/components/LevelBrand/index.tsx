import React from 'react'
import p_level1 from '@/assets/level1.png'
import p_level2 from '@/assets/level2.png'
import p_level3 from '@/assets/level3.png'
import p_level4 from '@/assets/level4.png'
import styles from './index.less'

enum levelEnum {
  '青铜会员' = 1,
  '白银会员' = 2,
  '黄金会员' = 3,
  '钻石会员' = 4,
}

export interface LevelBrandProps {
  level: levelEnum
}

const PIC_MAP = {
  1: p_level1,
  2: p_level2,
  3: p_level3,
  4: p_level4,
}

const LevelBrand: React.FC<LevelBrandProps> = ({ level }) => {
  const current = PIC_MAP[level] || ''

  return <div className={styles.brand}>{current && <img src={current} />}</div>
}

export default LevelBrand
