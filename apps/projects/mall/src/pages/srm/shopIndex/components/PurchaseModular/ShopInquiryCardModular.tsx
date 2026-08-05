import React from 'react'
import { RightOutlined } from '@ant-design/icons'
import SkeletonCard from '@/components/SkeletonCard'
import { getWebIntl } from '@/utils/locales'
import InquiryCard, { PAGETYPES } from '../InquiryCard'
import styles from './index.module.less'

interface Props {
  modular?: string
  messageList?: Array<any>
  loading?: boolean
  isSign?: boolean // 是否登录了
  /* */
  pageType?: PAGETYPES.BIDDING_ORDER | PAGETYPES.INQUIRY_ORDER | PAGETYPES.TENDER_ORDER
}

const ShopInquiryCardModular: React.FC<Props> = (props) => {
  const translate = getWebIntl()
  const {
    modular = translate('web.resource.order.caigouxunjia'),
    messageList = [],
    loading = true,
    isSign = false,
    pageType,
  } = props
  const shopId = 0
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
      return (item.province || '') + '/' + (item.city || '')
    })
    return areasDesc.join(',')
  }
  const _modular = {
    采购询价: PAGETYPES.INQUIRY_ORDER,
    采购竞价: PAGETYPES.BIDDING_ORDER,
    采购招标: PAGETYPES.TENDER_ORDER,
  }

  return (
    // 企业采购-首页卡片
    <div>
      <div className={styles['card-title']}>
        <div>{modular}</div>
        <div className={styles['see-more']}>
          {'查看更多'}
          <RightOutlined translate={undefined} className={styles['see-more-icon']} />
          <a
            href={
              modular === '采购询价'
                ? `${shopId ? `/${shopId}` : ''}/procurementSourcing`
                : `${shopId ? `/${shopId}` : null}/procurementCompete`
            }
            className="all-jump"
          ></a>
        </div>
      </div>
      <ul className={styles['card-warp']}>
        {!loading ? (
          messageList.map((item: any, index: number) => {
            if (!item.id) {
              return
            }
            return (
              <li key={index + modular} className={styles['card-item']}>
                <InquiryCard
                  cardWidth={227}
                  cardTitle={item.details}
                  cardType={item.category}
                  cardAddress={item.address}
                  deliverData={item.deliveryTime}
                  cardFrom={fnGetArea(item.areas)}
                  commodity={item.count}
                  lostDay={fnGetDayTips(item.days, item.hours, item.minutes)}
                  company={item.memberName}
                  date={item.createTime}
                  creditScore={item.memberIntegral}
                  id={item.id}
                  purchaseInquiryNo={item.purchaseInquiryNo}
                  jumpUrl={
                    modular === '采购询价'
                      ? `${shopId ? `${shopId}/` : ''}InquiryDetail`
                      : `${shopId ? `${shopId}/` : ''}competeDetail`
                  }
                  btnTitle={fnGetBtnText(
                    modular === '采购竞价' ? item.isSignUp : item.isRegister > 0,
                    item.days,
                    item.hours,
                    item.minutes,
                    modular,
                  )}
                  isSign={isSign}
                  canRegister={item.canRegister}
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
          <SkeletonCard></SkeletonCard>
        )}
      </ul>
    </div>
  )
}

export default ShopInquiryCardModular
