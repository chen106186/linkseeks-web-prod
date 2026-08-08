import React from 'react'
import InquiryCard, { PAGETYPES } from '../InquiryCard'
import { RightOutlined } from '@ant-design/icons'
import SkeletonCard from '@/components/SkeletonCard'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  modular?: string
  messageList?: Array<any>
  loading?: boolean
  isSign?: boolean
  pageType?: PAGETYPES.BIDDING_ORDER | PAGETYPES.INQUIRY_ORDER | PAGETYPES.TENDER_ORDER
}

const PurchaseModular: React.FC<Props> = (props) => {
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
      return item.provinceName + '/' + item.cityName
    })
    return areasDesc.join(',')
  }

  return (
    // 企业采购-首页卡片

    <>
      <div className={styles['card-title']}>
        <div>{modular}</div>
        <div className={styles['see-more']}>
          {'查看更多'}
          <RightOutlined translate={undefined} className={styles['see-more-icon']} />
          <a href={`${shopId ? `/${shopId}` : ''}/procurementBidding`} className="all-jump"></a>
        </div>
      </div>
      {!loading ? (
        <div>
          <ul className={styles['card-warp']}>
            {messageList.map((item: any, index: number) => {
              return (
                <li key={item.id + modular} className={styles['card-item']}>
                  <InquiryCard
                    cardWidth={227}
                    cardTitle={item.projectName}
                    cardType={item.categoryName}
                    cardAddress={item.deliverAddress || '-'}
                    deliverData={item.hopeDate}
                    cardFrom={fnGetArea(item.inviteTenderAreaList)}
                    commodity={item.inviteTenderMaterielCount}
                    lostDay={fnGetDayTips(item.days, item.hours, item.minutes)}
                    date={item.createTime}
                    creditScore={item.memberIntegral}
                    btnTitle={fnGetBtnText(item.isRegister > 0, item.days, item.hours, item.minutes, modular)}
                    isSign={isSign}
                    canRegister={item.canRegister}
                    id={item.id}
                    shopId={shopId}
                    isType={pageType}
                    isSubMember={item.isSubMember}
                    memberRoleId={item.memberRoleId}
                    memberId={item.memberId}
                  ></InquiryCard>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <SkeletonCard></SkeletonCard>
      )}
    </>
  )
}

export default PurchaseModular
