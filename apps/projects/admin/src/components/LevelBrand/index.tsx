/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:48:08
 * @Description: 会员等级标签
 */
import React from 'react'
import IMG_LEVEL1 from '@/assets/level1.png'
import IMG_LEVEL2 from '@/assets/level2.png'
import IMG_LEVEL3 from '@/assets/level3.png'
import IMG_LEVEL4 from '@/assets/level4.png'
import styles from './index.less'

enum levelEnum {
  '青铜会员' = 1,
  '白银会员' = 2,
  '黄金会员' = 3,
  '钻石会员' = 4,
}
export interface LevelBrandProps {
  /**
   * 等级
   */
  level: levelEnum
}

const PIC_MAP = {
  1: IMG_LEVEL1,
  2: IMG_LEVEL2,
  3: IMG_LEVEL3,
  4: IMG_LEVEL4,
}

const LevelBrand: React.FC<LevelBrandProps> = ({ level }) => {
  const current = PIC_MAP[level] || ''

  return <div className={styles.brand}>{current && <img src={current} />}</div>
}

export default LevelBrand
