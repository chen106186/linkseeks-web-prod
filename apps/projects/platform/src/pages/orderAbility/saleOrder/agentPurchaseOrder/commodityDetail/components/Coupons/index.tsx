import React, { useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import { CaretDownOutlined, CaretUpOutlined, CheckCircleFilled } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { formatTimeString } from '@/utils'
import { postMarketingWebAgentCouponReceive } from '@apps/apis'
import { CouponDataType } from '../../types'
import { useIntl } from '@linkseeks/i18n'
import TagList from '../../../components/TagList'
import styles from './index.less'

interface CouponsProps {
  data: CouponDataType[] | undefined
  mallId: number
  agentMemberId: number
  agentRoleId: number
}

const Coupons: React.FC<CouponsProps> = (props) => {
  const { data, mallId, agentMemberId, agentRoleId } = props
  const intl = useIntl()
  const [couponsList, setCouponsList] = useState<CouponDataType[]>()
  const [expand, setExpand] = useState<boolean>(false)
  const SHOW_COUNT = 2 // 默认显示数量

  useEffect(() => {
    if (data) {
      setCouponsList(data)
    }
  }, [data])

  const showUseTime = (couponInfo: CouponDataType) => {
    if (couponInfo.effectiveType === 1) {
      return `${formatTimeString(couponInfo.effectiveTimeStart, 'YYYY-MM-DD')}${intl.formatMessage({
        id: 'mall.text.to',
        defaultMessage: '至',
      })}${formatTimeString(couponInfo.effectiveTimeEnd, 'YYYY-MM-DD')}`
    } else {
      return intl.formatMessage({
        id: 'mall.activity.coupon.invalidDay',
        defaultMessage: `至领取{invalidDay}天后失效`,
        invalidDay: couponInfo.invalidDay,
      })
    }
  }

  const receiveCoupon = async (couponInfo: CouponDataType) => {
    try {
      const param: any = {
        shopId: mallId,
        belongType: couponInfo.belongType,
        couponId: couponInfo.couponId,
      }

      const headers: any = {
        agentMemberId,
        agentRoleId,
      }
      const res = await postMarketingWebAgentCouponReceive(param, { headers })
      if (res.code === 1000 && res.data) {
        message.destroy()
        if (res.data?.canReceive !== 1) {
          const newCoupons = couponsList
            ? couponsList.map((item) => {
                return {
                  ...item,
                  completeReceive: item.couponId === couponInfo.couponId ? 3 : item.completeReceive,
                }
              })
            : []

          setCouponsList(newCoupons)
          Modal.confirm({
            maskClosable: true,
            width: 600,
            className: styles.receive_modal,
            closable: true,
            centered: true,
            icon: <CheckCircleFilled translate={undefined} className={styles.success_icon} />,
            title: intl.formatMessage({ id: 'mall.Modal.success.title', defaultMessage: '恭喜，领取成功' }),
            cancelButtonProps: {
              style: {
                display: 'none',
              },
            },
            okButtonProps: {
              className: styles.receive_modal_confirm,
              ghost: true,
            },
            content: (
              <div className={styles.receive_modal_content}>
                <div className={styles.receive_modal_content_line}>
                  {intl.formatMessage({ id: 'mall.receive.success', defaultMessage: '您已成功领取' })}
                  <span className={styles.coupon_title}>{couponInfo?.name}</span>
                  {intl.formatMessage({ id: 'mall.text.coupon', defaultMessage: '优惠券' })}
                </div>
                <div className={styles.receive_modal_content_line}>
                  {intl.formatMessage({ id: 'mall.activity.coupon.type', defaultMessage: '优惠券类型' })}：
                  {couponInfo?.typeName}
                </div>
                <div className={styles.receive_modal_content_line}>
                  {intl.formatMessage({ id: 'mall.activity.coupon.usetime', defaultMessage: '使用时间' })}：
                  {showUseTime(couponInfo)}
                </div>
              </div>
            ),
          })
        } else {
          message.info(intl.formatMessage({ id: 'coupons.incompatible' }))
        }
      }
    } catch (error) {
      throw new Error('error=' + error)
    }
  }

  const useCoupon = (couponInfo: CouponDataType) => {
    history.push(
      `/orderAbility/saleOrder/agentPurchaseOrder/makeUp?id=${couponInfo?.couponId}&belongType=${couponInfo?.belongType}`,
    )
  }

  /** 可领取状态0-未登录1-不符合条件2-可领取3-已领取 */
  const showReceiveBtnByType = (couponInfo: CouponDataType) => {
    switch (couponInfo.completeReceive) {
      case 2:
        return (
          <div className={styles.receive_btn} onClick={() => receiveCoupon(couponInfo)}>
            {intl.formatMessage({ id: 'mall.activity.coupon.receive', defaultMessage: '领取' })}
          </div>
        )
      case 3:
        return (
          <div className={styles.receive_btn} onClick={() => useCoupon(couponInfo)}>
            {intl.formatMessage({ id: 'mall.activity.coupon.use', defaultMessage: '立即使用' })}
          </div>
        )
      default:
        return null
    }
  }

  return couponsList && couponsList.length > 0 ? (
    <div className={styles.product_info_coupons_line}>
      <div className={styles.product_info_coupons_line_label}>
        {intl.formatMessage({ id: 'mall.text.coupon', defaultMessage: '优惠券' })}
      </div>
      <div className={styles.product_info_coupons_line_brief}>
        <div className={styles.product_coupon_list}>
          {couponsList.map(
            (item, index) =>
              (index < SHOW_COUNT || expand) && (
                <div className={styles.product_coupon_list_item} key={item.couponId}>
                  <TagList.Item isCoupon />
                  <span>
                    {item.name}，
                    {intl.formatMessage({
                      id: 'mall.activity.coupon.condition',
                      defaultMessage: '满{{money}}元可用',
                      money: item.useConditionMoney,
                    })}
                  </span>
                  {showReceiveBtnByType(item)}
                </div>
              ),
          )}
          {couponsList.length > SHOW_COUNT && (
            <div className={styles.product_promotion_expand} onClick={() => setExpand(!expand)}>
              <span>
                {expand
                  ? intl.formatMessage({ id: 'order.index.payway.PutAway', defaultMessage: '收起' })
                  : intl.formatMessage({ id: 'order.index.payway.open', defaultMessage: '展开' })}
              </span>
              {expand ? (
                <CaretUpOutlined className={styles.product_promotion_expand_icon} />
              ) : (
                <CaretDownOutlined className={styles.product_promotion_expand_icon} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default Coupons
