/**
 * 企业采购-首页卡片
 */
import React from 'react'
import { Button, Modal, message } from 'antd'
import { MEMBER_CENTER_URL, getLoginDomainFn } from '@/constants/domain'
import { ShoppingCartOutlined, HistoryOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import { LinkTo, integrationTime } from '@/utils'
import { postPurchasePurchaseInquiryCheckMemberLifecycleRuleSetting } from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import styles from './index.module.less'

export enum PAGETYPES {
  /** 采购询价 */
  INQUIRY_ORDER = 1,
  /** 采购竞价 */
  BIDDING_ORDER,
  /** 采购招标 */
  TENDER_ORDER,
}
interface Props {
  cardWidth: number // 卡片宽度
  cardTitle: string // 卡片标题
  cardTitleType?: string // 卡片标题类型
  cardType?: string // 卡片类型
  cardAddress?: string // 地址
  deliverData?: string // 交付日期
  cardFrom?: string // 所在地区
  commodity?: number // 商品个数
  lostDay?: number // 剩余天书
  company?: string // 公司名称
  date?: string // 日期
  topBorderColor?: string // 顶部边框原色
  creditScore?: any // 信用积分
  id?: any
  jumpUrl?: string
  createTime?: string
  btnText?: string
  purchaseInquiryNo?: string
  isSign?: boolean
  canRegister?: boolean
  shopId?: string
  isSignUp?: number //  是否已报名
  isType?: PAGETYPES.BIDDING_ORDER | PAGETYPES.INQUIRY_ORDER | PAGETYPES.TENDER_ORDER
  isMePublish?: number // 是否是自己发布的竞价单 1:是; 0:否;
  isSubMember?: boolean // 是否下级会员
  memberRoleId?: string
  memberId?: string
}
/**
 * @cardTitle 卡片标题
 */
function InquiryCard(props: Props) {
  const translate = getWebIntl()
  const { url } = useGlobalConext()
  const {
    cardWidth,
    cardTitleType = '采购询价',
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
    createTime,
    btnText = '立即报价',
    purchaseInquiryNo,
    isSign,
    canRegister = true,
    shopId,
    isSignUp,
    isType,
    isMePublish,
    isSubMember,
    memberRoleId,
    memberId,
  } = props

  const LOGIN_DOMAIN = getLoginDomainFn(url)

  /**
   * 获取跳转报名的链接
   */
  const fnGetsignUpUrl = () => {
    if (jumpUrl === 'InquiryDetail') {
      // 询价
      return `${MEMBER_CENTER_URL}/procurementAbility/offter/addOffter/add?id=${id}&number=${purchaseInquiryNo}&type=quote`
    } else if (jumpUrl === 'competeDetail') {
      // 竞价
      return `${MEMBER_CENTER_URL}/procurementAbility/onlineBid/readySignUp/signUp?id=${id}&number=${purchaseInquiryNo}`
    } else if (jumpUrl === 'biddingDetail') {
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
            content: '您目前阶段暂不允许进行{data}，请咨询您的采购商！', // getMessage('locales.purchase.error', '您目前阶段暂不允许进行{data}，请咨询您的采购商！', { data: jumpUrl === 'InquiryDetail' ? getMessage('locales.baojia', '报价') : getMessage('locales.baoming', '报名') })
          })
        } else {
          window.open(fnGetsignUpUrl())
        }
      }
    })
  }

  const handleLink = (flag: any) => {
    /* 复制之前判断逻辑 */
    if ((btnText === '立即报价' || btnText === '立即报名') && flag) {
      /* 未登录 */
      if (!isSign) {
        LinkTo(LOGIN_DOMAIN, 'replace')
        return
      }
      /** 未成为下级会员提示 */
      if (!isSubMember) {
        Modal.warning({
          content: '您还未申请成为入库供应商，请先申请后再{data}!', // getMessage('locales.warning', '您还未申请成为入库供应商，请先申请后再{data}!', { data: jumpUrl === 'InquiryDetail' ? getMessage('locales.baojia', '报价') : getMessage('locales.baoming', '报名') })
        })
        return
      }
      /* 未参与寻源提示 */
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
          <span>{cardTitleType}</span>
        </li>
      )}
      <li className={`${styles['card-title']} ${cardWidth === 470 ? styles['card-title-long'] : ''}`}>{cardTitle}</li>

      <li className={styles['card-type']}> # {cardType}</li>

      {creditScore != 0 && creditScore && (
        <li className={styles['card-item']}>
          <span className={styles['address-key']}>{'信用积分'}：</span>
          <span className={styles['address-value']}>{creditScore}</span>
        </li>
      )}
      <li
        style={{ height: props.cardWidth === 470 ? '18px' : '' }}
        className={`${styles['card-item']} ${styles['card-item-address']}`}
      >
        <span className={styles['address-key']}>{'交付地址'}：</span>
        <span className={styles['address-value']}>{cardAddress}</span>
      </li>

      <li className={styles['card-item']}>
        <span className={styles['address-key']}>{'发布日期'}：</span>
        <span className={styles['address-value']}>{integrationTime(createTime || '', 'YMD')}</span>
      </li>

      <li className={styles['card-item']}>
        <span className={styles['address-key']}>{'交付日期'}：</span>
        <span className={styles['address-value']}>{integrationTime(deliverData || '', 'YMD')}</span>
      </li>

      <li className={styles['card-item']}>
        <span className={styles['address-key']}>{'适用地市'}：</span>
        <span className={styles['address-value']}>{cardFrom}</span>
      </li>

      <li className={styles['card-item-time']}>
        <div>
          <ShoppingCartOutlined translate={undefined} className={styles['icon-sign']} />
          {/* <span>{getMessage('locales.wuliaozhong', '物料{{data}}种', { data: <span className={styles['other-color']}>{commodity || '-'}</span> })}</span> */}
        </div>
        <div>
          <HistoryOutlined translate={undefined} className={styles['icon-sign']} />
          {/* {
            (lostDay && lostDay > 0) ?
              <span>{getMessage('locales.buzutian', '不足{{data}}天', { data: <span className={styles['other-color']}>{lostDay}</span> })}</span>
              :
              <span>{getMessage('locales.yijingjiezhi', '已经截止')}</span>
          } */}
        </div>
      </li>
      <li className={styles['card-content']}>{company}</li>

      <li className={styles['card-content']}>{integrationTime(date || '', 'YMDMS')}</li>
      {isType === PAGETYPES.INQUIRY_ORDER && !!canRegister && (
        <li className={`${styles['sign-btn-warp']}`} style={{ left: cardWidth === 470 ? '25%' : '' }}>
          <>
            <Button
              onClick={() => handleLink(!!canRegister)}
              className={`${styles['sign-btn']} ${
                (btnText === '立即报价' || btnText === '立即报名') && !!canRegister ? '' : styles['sign-btn-grey']
              }`}
              block
            >
              {btnText}
            </Button>
          </>
        </li>
      )}
      {isType === PAGETYPES.TENDER_ORDER && !!canRegister && (
        <li className={`${styles['sign-btn-warp']}`} style={{ left: cardWidth === 470 ? '25%' : '' }}>
          <>
            <Button
              onClick={() => handleLink(!!canRegister)}
              className={`${styles['sign-btn']} ${
                (btnText === '立即报价' || btnText === '立即报名') && !!canRegister ? '' : styles['sign-btn-grey']
              }`}
              block
            >
              {btnText}
            </Button>
          </>
        </li>
      )}
      {isType === PAGETYPES.BIDDING_ORDER && !!!isMePublish && (
        <li className={`${styles['sign-btn-warp']}`} style={{ left: cardWidth === 470 ? '25%' : '' }}>
          <>
            <Button
              onClick={() => handleLink(!!!isSignUp)}
              className={`${styles['sign-btn']} ${
                (btnText === '立即报价' || btnText === '立即报名') && !!!isSignUp ? '' : styles['sign-btn-grey']
              }`}
              block
            >
              {btnText}
            </Button>
          </>
        </li>
      )}
      <li>
        <a href={`${shopId ? `/${shopId}` : ''}/${jumpUrl}/${id}`} className="all-jump"></a>
      </li>
    </ul>
  )
}

export default InquiryCard
