/**
 * 采购商机-筛选的报价组件
 */
import React, { useState, useEffect } from 'react'
import { ShoppingCartOutlined, HistoryOutlined } from '@ant-design/icons'
import { Modal, message } from 'antd'
import { integrationTime } from '@/utils'
import { postPurchasePurchaseInquiryCheckMemberLifecycleRuleSetting } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { getQueryString } from '@/utils/getUrlParam'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import { validateLoginWrapper } from '@/utils/validateLogin'
import styles from './index.module.less'

interface Props {
  cardTitle?: string // 标题
  cardType?: string // 类型
  commodity?: number // 商品
  lostDay?: number // 剩余
  cardAddress?: string // 交付地址
  deliverData?: string // 交付日期
  cardFrom?: string // 发货地
  company?: string // 公司名
  id?: string // ID
  creatTime?: string // 创建时间
  btnText?: string // 按钮的文字,
  purchaseInquiryNo?: string // 编号
  isSign?: boolean // 是否登录状态
  canRegister?: boolean // 是否可以报价/报名
  mallId?: number // 链接上带的商城id
  isSubMember?: boolean // 是否下级会员
  memberRoleId?: string
  memberId?: string
}

const OfferCard: React.FC<Props> = (props) => {
  const {
    cardTitle = '-',
    commodity = '-',
    lostDay = '-',
    cardType = '-',
    cardAddress = '-',
    deliverData = '-',
    cardFrom = '-',
    company = '-',
    id = '-',
    creatTime = '-',
    btnText = '-',
    purchaseInquiryNo,
    isSign = false,
    canRegister = true,
    mallId,
    isSubMember,
    memberRoleId,
    memberId,
  } = props

  const translate = getWebIntl()
  const { search } = location || {}
  const [priceTypeList, setPriceTypeList] = useState('1')

  useEffect(() => {
    if (search) {
      const priceTypeListDesc = getQueryString('priceTypeList', search)
      if (priceTypeListDesc) {
        setPriceTypeList(priceTypeListDesc)
      }
    }
  }, [])

  /* 校验会员是否允许参与寻源 */
  const checkMemberLifeCycle = (linkseeks?: string) => {
    const param = {
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
            content: translate('web.resource.mall.ninmuqianjieduanzanbuyunxujinxingtype', { type: '报价' }),
          })
        } else {
          window.open(
            `${MEMBER_CENTER_URL}/procurementAbility/offter/addOffter/add?id=${id}&number=${purchaseInquiryNo}&type=quote`,
          )
        }
      }
    })
  }

  const handleLink = validateLoginWrapper(() => {
    if (btnText === translate('web.resource.mall.lijibaojia') && !!canRegister) {
      /** 未成为下级会员提示 */
      if (!isSubMember) {
        Modal.warning({
          content: translate('web.resource.mall.ninhaiweishenqingchengweirukugongyingshang'),
        })
        return
      }
      checkMemberLifeCycle()
    }
  })

  return (
    <ul className={styles['offer-main']}>
      <li className={styles['card-title']}>{cardTitle}</li>
      <li className={styles['card-item']}>
        <div>
          <ShoppingCartOutlined className={styles['icon-sign']} />
          <span>{translate('web.resource.mall.wuliaojizhong', { count: commodity || '-' })}</span>
        </div>
        <div>
          <HistoryOutlined className={styles['icon-sign']} />
          {Number(lostDay) > 0 ? (
            <span>{translate('web.resource.mall.buzujitian', { count: lostDay })}</span>
          ) : (
            <span>{translate('web.resource.mall.yijinjiezhi')}</span>
          )}
        </div>
      </li>
      <li className={styles['card-type']}>#{cardType}</li>

      <li className={styles['card-item']}>
        <span className={styles['card-key']}>{translate('web.resource.mall.jiaofudizhi')}：</span>
        <span className={styles['card-value']}>{cardAddress}</span>
      </li>
      <li className={styles['card-item']}>
        <span className={styles['card-key']}>{translate('web.resource.mall.faburiqi')}：</span>
        <span className={styles['card-value']}>{integrationTime(creatTime, 'YMD')}</span>
      </li>
      <li className={styles['card-item']}>
        <span className={styles['card-key']}>{translate('web.resource.mall.jiaofuriqi')}：</span>
        <span className={styles['card-value']}>{integrationTime(deliverData, 'YMD')}</span>
      </li>
      <li className={styles['card-item']}>
        <span className={styles['card-key']}>{translate('web.resource.mall.shiyongdishi')}：</span>
        <span className={styles['card-value']}>{cardFrom}</span>
      </li>
      <li className={styles['card-content']} style={{ marginTop: '24px' }}>
        {company}
      </li>
      {!!canRegister && (
        <li className={styles['offer-btn']}>
          <div
            onClick={handleLink}
            className={`${
              btnText === translate('web.resource.mall.lijibaojia') && !!canRegister ? '' : styles['offer-btn-grey']
            }`}
          >
            {btnText}
          </div>
        </li>
      )}
      <li>
        <a href={`/inquiryDetail/${id}`} className="all-jump"></a>
      </li>
    </ul>
  )
}

export default OfferCard
