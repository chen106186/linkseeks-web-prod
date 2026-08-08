/**
 * 名企采购--卡片
 */
import React from 'react'

import EnterprisesLeft from '../EnterprisesLeft'
import EnterprisesTime from './EnterprisesTime'
import styles from './index.module.less'

interface Props {
  cardTitle?: string
  starsCard?: number
  cardAddress?: string
  business?: string
  identification?: string
  inquiryNum?: string
  inviteTenderNum?: string
  biddingNum?: string
  purchaseAmount?: string
  companyLogo?: any
  levelTag?: string
  id?: number
}

function EnterprisesCard(props: Props) {
  const {
    id,
    cardTitle = '', // 公司名称
    starsCard = 5, // 评价等级
    cardAddress = '', // 公司地址
    business = '', // 主营
    identification = '', // 满意程度
    inquiryNum = '0', // 累计询价(次)
    inviteTenderNum = '0', // 累计招标
    biddingNum = '0', // 累计竞价
    purchaseAmount = '0', // 累计采购金额
    companyLogo = '', // 公司logo
    levelTag = '',
  } = props

  return (
    <div className={styles['enterprises-main']}>
      <EnterprisesLeft
        id={id}
        cardTitle={cardTitle}
        starsCard={starsCard}
        cardAddress={cardAddress}
        business={business}
        identification={identification}
        companyLogo={companyLogo}
        levelTag={levelTag}
      />
      <EnterprisesTime
        inquiryNum={inquiryNum}
        inviteTenderNum={inviteTenderNum}
        biddingNum={biddingNum}
        purchaseAmount={purchaseAmount}
      />
    </div>
  )
}

export default EnterprisesCard
