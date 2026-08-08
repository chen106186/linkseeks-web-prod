import React from 'react'
import { Image } from '@linkseeks/ui'
import styles from './index.less'

interface PicWrapProps {
  pics: string[]
}

const PicWrap: React.FC<PicWrapProps> = ({ pics = [] }) => (
  <ul className={styles.list}>
    {pics.map((item, index) => (
      <li key={index} className={styles['list-item']}>
        <Image width={88} height={56} src={item} />
      </li>
    ))}
  </ul>
)

export default PicWrap
