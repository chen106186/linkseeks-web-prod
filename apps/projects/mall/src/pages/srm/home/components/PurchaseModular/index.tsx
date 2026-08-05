import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import { Skeleton } from 'antd'
import { getWebIntl } from '@/utils/locales'
import InquiryCard, { PAGETYPES } from '../InquiryCard'
import styles from './index.module.less'

interface Props {
  modular?: string
  messageList?: Array<any>
  topBorderColor?: string
  loading?: boolean
  isSign?: boolean
  shopId?: string
  pageType?: PAGETYPES.BIDDING_ORDER | PAGETYPES.INQUIRY_ORDER | PAGETYPES.TENDER_ORDER
}

function PurchaseModular(props: Props) {
  const translate = getWebIntl()
  const {
    modular = '采购询价',
    messageList = [{}],
    topBorderColor = '#2266EE',
    loading = false,
    isSign = false,
    shopId,
    pageType,
  } = props

  /**
   * 获取所在地区
   * @param area
   */
  const fnGetArea = (area: any) => {
    let descArea = ''
    if (!area) {
      return ''
    }
    area.map((item: any) => {
      if (descArea) {
        descArea = `${descArea}、${item.provinceName}/${item.cityName}`
      } else {
        descArea = `${item.provinceName}/${item.cityName}`
      }
    })
    return descArea
  }
  const skeletonList = [1, 2, 3, 4, 5]

  /**
   *
   * @param already 是否申请了
   * @param days  剩余天
   * @param hours 剩余小时
   * @param minutes 剩余分
   */
  const fnGetBtnText = (already: boolean, days: number, hours: number, minutes: number, modular: string) => {
    if (already) {
      return '已经报名'
    } else if (days === 0 && hours === 0 && minutes === 0) {
      return '已经截止'
    }
    return '立即报名'
  }

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

  return (
    // 企业采购-首页卡片
    messageList.length != 0 ? (
      <div>
        <div className={styles['card-title']}>
          <div>{modular}</div>
          <div className={styles['see-more']}>
            {'查看更多'}
            <RightOutlined translate={undefined} className={styles['see-more-icon']} />
            <a href={`${shopId ? `/${shopId}` : ''}/purchaseBidding?priceTypeList=2`} className="all-jump"></a>
          </div>
        </div>
        <ul className={styles['card-warp']}>
          {!loading ? (
            messageList.map((item: any, index: number) => {
              return (
                <li key={index + modular} className={styles['card-item']}>
                  <InquiryCard
                    cardWidth={index === 0 ? 470 : 227}
                    cardTitle={item.projectName}
                    cardType={item.categoryName}
                    cardAddress={item.deliverAddress}
                    deliverData={item.hopeDate}
                    cardFrom={fnGetArea(item.inviteTenderAreaList)}
                    commodity={item.inviteTenderMaterielCount}
                    lostDay={fnGetDayTips(item.days, item.hours, item.minutes)}
                    canRegister={item.canRegister}
                    company={item.memberName}
                    date={item.registerStartTime}
                    creditScore={item.creditScore}
                    createTime={item.createTime}
                    id={item.id}
                    topBorderColor={topBorderColor}
                    cardTitleType={'查看更多'}
                    btnText={fnGetBtnText(item.isRegister > 0, item.days, item.hours, item.minutes, modular)}
                    isSign={isSign}
                    shopId={shopId}
                    isType={pageType}
                    isSubMember={item.isSubMember}
                    memberRoleId={item.memberRoleId}
                    memberId={item.memberId}
                  ></InquiryCard>
                </li>
              )
            })
          ) : (
            <ul className={styles['skeleton-main']}>
              {skeletonList.map((key: number) => {
                return (
                  <li className={styles['skeleton-warp']} key={key}>
                    <Skeleton paragraph={{ rows: 8 }} active />
                  </li>
                )
              })}
            </ul>
          )}
        </ul>
      </div>
    ) : null
  )
}

export default PurchaseModular
