import React, { useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import { CaretDownOutlined, CaretUpOutlined, CheckCircleFilled } from '@ant-design/icons'
import { LinkTo } from '@/utils'
import moment from 'moment'
import { postMarketingWebCouponReceive } from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import { TagItem } from '@/components/ActivityTags'
import { CouponDataType } from '../../types'
import styles from './index.module.less'
import { validateLoginWrapper } from '@/utils/validateLogin'
import useLink from '@/hooks/useLink'

interface CouponsProps {
  data: CouponDataType[] | undefined
}

const Coupons: React.FC<CouponsProps> = (props) => {
  const { data } = props
  const { userInfo, mallInfo, url } = useGlobalConext()
  const [couponsList, setCouponsList] = useState<CouponDataType[]>()
  const [expand, setExpand] = useState<boolean>(false)
  const translate = getWebIntl()
  const SHOW_COUNT = 2 // 默认显示数量
  const { linkPrefix } = useLink()

  useEffect(() => {
    if (data) {
      setCouponsList(
        data.map((item) => ({
          ...item,
          // 平台优惠券和商家优惠券id可能重复
          key: `${item.couponId}${item.belongType}`,
        })),
      )
    }
  }, [data])

  const showUseTime = (couponInfo: CouponDataType) => {
    if (couponInfo.effectiveType === 1) {
      return `${moment(couponInfo.effectiveTimeStart).format('YYYY-MM-DD')}${translate('web.common.zhi')}${moment(
        couponInfo.effectiveTimeEnd,
      ).format('YYYY-MM-DD')}`
    } else {
      return translate('web.resource.mall.zhilingqutianhoushixiao', { invalidDay: couponInfo.invalidDay })
    }
  }

  const receiveCoupon = validateLoginWrapper(async (_, couponInfo: CouponDataType) => {
    try {
      const param: any = {
        shopId: mallInfo?.id,
        belongType: couponInfo.belongType,
        couponId: couponInfo.couponId,
      }
      const res = await postMarketingWebCouponReceive(param)
      if (res.code === 1000 && res.data) {
        message.destroy()
        if (res.data?.canReceive !== 1) {
          const newCoupons = couponsList
            ? couponsList.map((item) => {
                return {
                  ...item,
                  completeReceive: item.key === couponInfo.key ? 3 : item.completeReceive,
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
            title: translate('web.resource.mall.gongxilingquchenggong'),
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
                  {translate('web.resource.mall.ninyichenggonglingqu')}
                  <span className={styles.coupon_title}>{couponInfo?.name}</span>
                  {translate('web.resource.mall.coupon')}
                </div>
                <div className={styles.receive_modal_content_line}>
                  {translate('web.resource.mall.youhuiquanleixing')}：{couponInfo?.typeName}
                </div>
                <div className={styles.receive_modal_content_line}>
                  {translate('web.resource.mall.shiyongshijian')}：{showUseTime(couponInfo)}
                </div>
              </div>
            ),
          })
        } else {
          message.info(translate('web.resource.mall.ninbufuheyouhuiquanlingqutiaojian'))
        }
      }
    } catch (error) {
      throw new Error('error=' + error)
    }
  })

  const useCoupon = (couponInfo: CouponDataType) => {
    LinkTo(linkPrefix(`/makeUpList/${couponInfo?.couponId}?belongType=${couponInfo?.belongType}`))
  }

  /** 可领取状态0-未登录1-不符合条件2-可领取3-已领取 */
  const showReceiveBtnByType = (couponInfo: CouponDataType) => {
    switch (couponInfo.completeReceive) {
      case 2:
        return (
          <div className={styles.receive_btn} onClick={() => receiveCoupon(couponInfo)}>
            {translate('web.resource.mall.lingqu')}
          </div>
        )
      case 3:
        return (
          <div className={styles.receive_btn} onClick={() => useCoupon(couponInfo)}>
            {translate('web.resource.mall.lijishiyong')}
          </div>
        )
      default:
        return null
    }
  }

  return couponsList && couponsList.length > 0 ? (
    <div className={styles.product_info_coupons_line}>
      <div className={styles.product_info_coupons_line_label}>{translate('web.resource.mall.coupon')}</div>
      <div className={styles.product_info_coupons_line_brief}>
        <div className={styles.product_coupon_list}>
          {couponsList.map(
            (item, index) =>
              (index < SHOW_COUNT || expand) && (
                <div className={styles.product_coupon_list_item} key={`${item.couponId}_${item.belongType}`}>
                  <TagItem isCoupon />
                  <span>
                    {item.name}，{translate('web.resource.mall.manmoneyyuankeyong', { money: item.useConditionMoney })}
                  </span>
                  {showReceiveBtnByType(item)}
                </div>
              ),
          )}
          {couponsList.length > SHOW_COUNT && (
            <div className={styles.product_promotion_expand} onClick={() => setExpand(!expand)}>
              <span>{expand ? translate('web.resource.mall.shouqi') : translate('web.resource.mall.zhankai')}</span>
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
