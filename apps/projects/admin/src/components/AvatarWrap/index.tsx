/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-22 11:48:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-09-22 11:53:03
 * @Description: 详情页头像与名字结合组件
 */
import React from 'react'
import styles from './index.less'

export interface AvatarWrapProps {
  info: {
    aloneTxt?: string // 单独显示在头像中间的文件，不传的话从 name 从截取第一个字符
    name: string
    level?: number
  }
  extra?: React.ReactNode
}

const AvatarWrap: React.FC<AvatarWrapProps> = ({ info = {}, extra }) => (
  <div className={styles.head}>
    <div className={styles['head-prefix']}>
      {info.aloneTxt ? info.aloneTxt : info.name && info.name.length ? info.name[0] : ''}
    </div>
    <div className={styles['head-name']}>{info.name || ''}</div>
    {extra}
  </div>
)

export default AvatarWrap
