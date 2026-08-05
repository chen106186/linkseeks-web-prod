import React, { useMemo } from 'react'
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
  pageType?: PAGETYPES.BIDDING_ORDER | PAGETYPES.INQUIRY_ORDER | PAGETYPES.TENDER_ORDER
}

function InquiryCardModular(props: Props) {
  const translate = getWebIntl()
  const { modular, messageList = [{}], topBorderColor = '', loading = false, isSign = false, pageType } = props

  const modularText = useMemo(() => {
    return modular || '采购询价'
  }, [modular])

  /**
   * 获取所在地区
   * @param area
   */
  const fnGetArea = (area: any) => {
    let descArea = ''
    if (!area) {
      return '-'
    }
    area.map((item: any) => {
      if (descArea) {
        descArea = `${descArea}、${item.province}/${item.city}`
      } else {
        descArea = `${item.province}/${item.city}`
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
      return modular === '采购竞价' ? '已经报名' : '已经报价'
    } else if (days === 0 && hours === 0 && minutes === 0) {
      return '已经截止'
    }
    return modular === '采购竞价' ? '立即报名' : '立即报价'
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
      <>
        <div>
          <div className={styles['card-title']}>
            <div>{modularText}</div>
            <div className={styles['see-more']}>
              {translate('web.resource.mall.chakangengduo')}
              <RightOutlined translate={undefined} className={styles['see-more-icon']} />
              {modularText === '采购询价' ? (
                <a href={`/purchaseInquiry?priceTypeList=1`} className="all-jump"></a>
              ) : (
                <a href={`/purchaseCompete?priceTypeList=3`} className="all-jump"></a>
              )}
            </div>
          </div>
          <ul className={styles['card-warp']}>
            {!loading ? (
              messageList.map((item: any, index: number) => {
                return (
                  <li key={index + modularText} className={styles['card-item']}>
                    <InquiryCard
                      cardWidth={index === 0 ? 470 : 227}
                      cardTitle={item.details}
                      cardType={item.category}
                      cardAddress={item.address}
                      deliverData={item.deliveryTime}
                      cardFrom={fnGetArea(item.areas)}
                      commodity={item.count}
                      lostDay={fnGetDayTips(item.days, item.hours, item.minutes)}
                      canRegister={item.canRegister}
                      company={item.memberName}
                      date={item.createTime}
                      creditScore={item.memberIntegral}
                      id={item.id}
                      purchaseInquiryNo={item.purchaseInquiryNo}
                      createTime={item.createTime}
                      jumpUrl={modularText === '采购询价' ? `InquiryDetail` : `competeDetail`}
                      topBorderColor={topBorderColor}
                      cardTitleType={modularText === '采购询价' ? '采购询价' : '采购竞价'}
                      btnText={fnGetBtnText(
                        modularText === '采购竞价' ? item.isSignUp : item.isRegister > 0,
                        item.days,
                        item.hours,
                        item.minutes,
                        modularText,
                      )}
                      isSign={isSign}
                      isSignUp={item.isSignUp}
                      isType={pageType}
                      isMePublish={item.isMePublish}
                      isSubMember={item.isSubMember}
                      memberRoleId={item.memberRoleId}
                      memberId={item.memberId}
                    />
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
      </>
    ) : null
  )
}

export default InquiryCardModular
