import React from 'react'

import stars from './stars.png'
import grade from './grade.png'
import authentication from './authentication.png'
import styles from './index.module.less'
import StarRate from '@/components/StarRate'

interface Props {
  id?: number
  cardTitle?: string
  starsCard?: number
  cardAddress?: string
  business?: string
  identification?: string
  companyLogo?: any
  levelTag?: string
}

function EnterprisesLeft(props: Props) {
  const {
    id,
    companyLogo = { grade }, // 公司Logo
    cardTitle = '', // 公司名称
    starsCard = 5, // 评价等级
    cardAddress = '', // 公司地址
    business = '', // 主营
    identification = '', // 满意程度
    levelTag = '',
  } = props

  const arrList = [0, 1, 2, 3, 4]

  return (
    <ul className={styles['enterprises-left']}>
      <li className={styles['enterprises-title']}>
        <div className={styles['enterprises-title-left']}>
          <div className={styles['enterprises-logo']} style={{ backgroundImage: `url(${companyLogo})` }}></div>
          <div className={styles['enterprises-name']}>
            <div style={{ display: 'flex' }}>
              <a href={`/shopIndex/${id}`} className={styles['company-title']}>
                {cardTitle}
              </a>
            </div>
            <div>
              {arrList.map((item: any, index: number) => {
                if (index < starsCard) {
                  return <img key={index + 'stars'} src={stars} alt="" />
                }
              })}
            </div>
          </div>
        </div>
        <div className={styles['enterprises-address']}>{cardAddress}</div>
      </li>
      <li className={styles['enterprises-identification']}>
        <span className={styles['enterprises-key']}>{'满意度'}：</span>
        <span className={styles['enterprises-value']}>
          <StarRate value={Number(identification || 0)} />
        </span>
      </li>
      <li style={{ marginBottom: '13px', display: 'flex' }}>
        <span className={styles['enterprises-key']}>{'主营'}：</span>
        <span className={`${styles['enterprises-value']} ${styles['has-hover']}`}>{business || '-'}</span>
      </li>
      <li style={{ display: 'flex' }}>
        <img src={authentication} alt="" />
        <span className={styles['enterprises-key']}>{'以上信息已通过会员认证'}｜</span>
        <div className={styles['enterprises-value']}>
          <span className={styles['has-hover']}>{'资质证书'} &gt;</span>
          <span className={styles['has-hover']}>{'公司信息'} &gt;</span>
        </div>
      </li>
    </ul>
  )
}

export default EnterprisesLeft
