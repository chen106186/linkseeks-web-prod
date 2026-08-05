/**
 * 企业采购-首页卡片
 */
import React from 'react'
import { Button, Modal, message } from 'antd'
import { ShoppingCartOutlined, HistoryOutlined } from '@ant-design/icons'
import { integrationTime, LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import { postPurchasePurchaseInquiryCheckMemberLifecycleRuleSetting } from '@apps/apis'
import styles from './index.module.less'
import { getLoginDomainFn, MEMBER_CENTER_URL } from '@/constants/domain'
import { useGlobalConext } from '@/context/globalProvider'

export enum PAGETYPES {
  /** 采购询价 */
  INQUIRY_ORDER = 1,
  /** 采购竞价 */
  BIDDING_ORDER,
  /** 采购招标 */
  TENDER_ORDER,
}

interface Props {
  cardWidth: number
  cardTitle?: string
  cardType?: string
  cardAddress?: string
  deliverData?: string
  cardFrom?: string
  commodity?: number
  lostDay?: number
  company?: string
  date?: string
  topBorderColor?: string
  creditScore?: any
  id?: any
  jumpUrl?: string
  btnTitle?: string
  purchaseInquiryNo?: string
  isSign?: boolean // 是否登录
  canRegister?: boolean // 改用户能否报价
  isSignUp?: number //  是否已报名
  isType?: PAGETYPES.BIDDING_ORDER | PAGETYPES.INQUIRY_ORDER | PAGETYPES.TENDER_ORDER
  shopId?: string
  isMePublish?: number // 是否是自己发布的竞价单 1:是; 0:否;
  isSubMember?: boolean // 是否下级会员
  memberRoleId?: string
  memberId?: string
}
/**
 * @cardTitle 卡片标题
 */
const InquiryCard: React.FC<Props> = (props) => {
  const translate = getWebIntl()
  const {
    cardWidth,
    cardTitle,
    cardType,
    cardAddress,
    deliverData,
    cardFrom,
    commodity,
    lostDay,
    company,
    date,
    topBorderColor,
    creditScore,
    id = 1,
    jumpUrl = 'biddingDetail',
    btnTitle = translate('web.resource.mall.lijixunjia'),
    purchaseInquiryNo,
    isSign = false,
    canRegister = true,
    isSignUp,
    isType,
    shopId,
    isMePublish,
    isSubMember,
    memberRoleId,
    memberId,
  } = props
  const { url } = useGlobalConext()
  // 登录域名
  const LOGIN_DOMAIN = getLoginDomainFn(url)

  /**
   * 获取跳转报名的链接
   */
  const fnGetsignUpUrl = () => {
    if (jumpUrl.indexOf('InquiryDetail') > -1) {
      // 询价
      return `${MEMBER_CENTER_URL}/procurementAbility/offter/addOffter/add?id=${id}&number=${purchaseInquiryNo}&type=quote`
    } else if (jumpUrl.indexOf('competeDetail') > -1) {
      // 竞价
      return `${MEMBER_CENTER_URL}/procurementAbility/onlineBid/readySignUp/signUp?id=${id}&number=${purchaseInquiryNo}`
    } else if (jumpUrl.indexOf('biddingDetail') > -1) {
      // 招标
      return `${MEMBER_CENTER_URL}/procurementAbility/tender/readyBidRegister/add?id=${id}`
    }
    return ''
  }

  /* 校验会员是否允许参与寻源 */
  const checkMemberLifeCycle = () => {
    const param: any = {
      memberId,
      roleId: memberRoleId,
      lifeCycleStageRuleId: 1,
    }
    postPurchasePurchaseInquiryCheckMemberLifecycleRuleSetting(param).then((res) => {
      if (res.code === 1000) {
        const { data } = res
        message.destroy()
        if (!data) {
          Modal.warning({
            content: `您目前阶段暂不允许进行${
              jumpUrl.indexOf('InquiryDetail') > -1 ? '报价' : '报名'
            }，请咨询您的采购商！`,
          })
        } else {
          window.open(fnGetsignUpUrl())
        }
      }
    })
  }

  const handleLink = (flag: any) => {
    /* 复制之前判断逻辑 */
    if ((btnTitle === '立即报价' || btnTitle === '立即报名') && flag) {
      /* 未登录 */
      if (!isSign) {
        LinkTo(LOGIN_DOMAIN, 'replace')
        return
      }
      /** 未成为下级会员提示 */
      if (!isSubMember) {
        Modal.warning({
          content: `您还未申请成为入库供应商，请先申请后再${jumpUrl.indexOf('InquiryDetail') > -1 ? '报价' : '报名'}!`,
        })
        return
      }
      // /* 未参与寻源提示 */
      checkMemberLifeCycle()
    }
  }

  return (
    <ul
      className={styles['inquiry-main']}
      style={{ width: props.cardWidth, borderColor: topBorderColor ? topBorderColor : '#ffffff' }}
    >
      {cardWidth === 470 && (
        <li className={styles['card-tips']}>
          <span>{'采购询价'}</span>
        </li>
      )}
      <li className={styles['card-title']}>{cardTitle}</li>

      <li className={styles['card-type']}># {cardType}</li>
      {cardAddress && (
        <li className={styles['card-item']}>
          <span className={styles['address-key']}>{'交付地址'}：</span>
          <span className={styles['address-value']}>{cardAddress}</span>
        </li>
      )}
      {creditScore && (
        <li className={styles['card-item']}>
          <span className={styles['address-key']}>{'信用积分'}：</span>
          <span className={styles['address-value']}>{creditScore}</span>
        </li>
      )}
      <li className={styles['card-item']}>
        <span className={styles['address-key']}>{'交付日期'}：</span>
        <span className={styles['address-value']}>{integrationTime(deliverData || '', 'YMD')}</span>
      </li>
      {cardFrom && (
        <li className={styles['card-item']}>
          <span className={styles['address-key']}>{'适用地市'}：</span>
          <span className={styles['address-value']}>{cardFrom}</span>
        </li>
      )}
      <li className={styles['card-item-time']}>
        <div>
          <ShoppingCartOutlined className={styles['icon-sign']} />
          <span>{`物料${commodity || '-'}种`}</span>
        </div>
        <div>
          <HistoryOutlined className={styles['icon-sign']} />
          {lostDay && lostDay > 0 ? <span>{`不足${lostDay}天`}</span> : <span>{'已经截止'}</span>}
        </div>
      </li>
      <li className={styles['card-content']}>{integrationTime(date || '', 'YMD')}</li>
      {isType === PAGETYPES.INQUIRY_ORDER && canRegister && (
        <li className={styles['sign-btn-warp']}>
          <>
            <Button
              onClick={() => handleLink(canRegister)}
              className={`${styles['sign-btn']} ${
                (btnTitle === '立即报价' || btnTitle === '立即报名') && canRegister ? '' : styles['sign-btn-gery']
              }`}
              block
            >
              {btnTitle}
            </Button>
          </>
        </li>
      )}
      {isType === PAGETYPES.TENDER_ORDER && canRegister && (
        <li className={styles['sign-btn-warp']}>
          <>
            <Button
              onClick={() => handleLink(canRegister)}
              className={`${styles['sign-btn']} ${
                (btnTitle === '立即报价' || btnTitle === '立即报名') && canRegister ? '' : styles['sign-btn-gery']
              }`}
              block
            >
              {btnTitle}
            </Button>
          </>
        </li>
      )}
      {isType === PAGETYPES.BIDDING_ORDER && !!!!!isMePublish && (
        <li className={styles['sign-btn-warp']}>
          <>
            <Button
              onClick={() => handleLink(!!!isSignUp)}
              className={`${styles['sign-btn']} ${
                (btnTitle === '立即报价' || btnTitle === '立即报名') && !!!isSignUp ? '' : styles['sign-btn-gery']
              }`}
              block
            >
              {btnTitle}
            </Button>
          </>
        </li>
      )}
      <li>
        <a href={`${shopId ? `/${shopId}` : ''}/${jumpUrl}/${id}?inShop=true`} className="all-jump"></a>
      </li>
    </ul>
  )
}

export default InquiryCard
