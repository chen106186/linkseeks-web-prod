import React from 'react'
import { integrationTime } from '@/utils'
import InquiryCard from '@/pages/srm/components/InquiryCard'
import CompanyCard from '@/pages/srm/components/CompanyCard'
import styles from '../../index.module.less'

interface Props {
  companyTitle?: string
  cpmpanyMoney?: string
  inquiryNumber?: string
  creditPoint?: string
  recommendList?: []
  inquiryNum?: string // 询价次数
  inviteTenderNum?: string // 招标次数
  biddingNum?: string // 竞价次数
  purchaseAmount?: string // 采购金额
}

const BiddingRight: React.FC<Props> = (props) => {
  const {
    companyTitle = '-',
    inquiryNum = '0',
    inviteTenderNum = '0',
    biddingNum = '0',
    purchaseAmount = '0',
    creditPoint = '0',
    recommendList = [],
  } = props

  /**
   * 获取剩余时间天数
   */
  const fnGetDayTips = (days: number, hours: number, minutes: number) => {
    if (days > 0) {
      return days + 1
    } else if (days == 0 && hours > 0) {
      return 1
    } else if (days == 0 && hours == 0 && minutes == 0) {
      return 0
    } else {
      return 1
    }
  }

  /**
   *
   * @param areas 适用地区数组
   * 获取适用地区字符串
   */
  const fnGetArea = (areas: Array<any>) => {
    if (!areas || areas.length == 0) {
      return ''
    }
    const areasDesc = areas.map((item: any) => {
      return item.province + '/' + item.city
    })
    return areasDesc.join(',')
  }

  return (
    <>
      <CompanyCard
        companyTitle={companyTitle}
        inquiryNum={inquiryNum}
        inviteTenderNum={inviteTenderNum}
        biddingNum={biddingNum}
        purchaseAmount={purchaseAmount}
        creditPoint={creditPoint}
      />
      <div className={styles['inquiry-tips']}>{'该采购商还在采购竞价'}:</div>
      {recommendList &&
        recommendList.map((item: any) => {
          return (
            <li style={{ marginBottom: '16px' }} key={item.id + 'recom'}>
              <InquiryCard
                cardWidth={227}
                cardTitle={item.details}
                cardType={item.category}
                cardAddress={item.address}
                deliverData={integrationTime(item.deliveryTime, 'YMD')}
                cardFrom={fnGetArea(item.areas)}
                commodity={item.count}
                lostDay={fnGetDayTips(item.days, item.hours, item.minutes)}
                company={item.memberName}
                date={integrationTime(item.createTime, 'YMDMS')}
                jumpUrl={`/competeDetail/${item.id}`}
              />
            </li>
          )
        })}
    </>
  )
}

export default BiddingRight
