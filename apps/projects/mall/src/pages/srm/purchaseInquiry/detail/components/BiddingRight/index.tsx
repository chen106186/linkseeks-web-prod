import React from 'react'
import { getQueryString } from '@/utils/getUrlParam'
import { useLocation } from 'react-router-dom'
import InquiryCard from '@/pages/srm/components/InquiryCard'
import CompanyCard from '@/pages/srm/components/CompanyCard'
import styles from '../../index.module.less'
import { integrationTime } from '@/utils'

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
  const { search } = useLocation()
  const inShop = getQueryString('inShop', search)

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
   * 获取归属地
   */
  const fnGetInviteTenderAreaList = (areas: any) => {
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
      <div className={styles['inquiry-tips']}>{'该采购商还在采购询价'}：</div>
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
                cardFrom={fnGetInviteTenderAreaList(item.areas)}
                commodity={item.count}
                lostDay={fnGetDayTips(item.days, item.hours, item.minutes)}
                company={item.memberName}
                date={integrationTime(item.createTime, 'YMDMS') || '-'}
                jumpUrl={`/inquiryDetail/${item.id}?inShop=${inShop}`}
              />
            </li>
          )
        })}
    </>
  )
}

export default BiddingRight
