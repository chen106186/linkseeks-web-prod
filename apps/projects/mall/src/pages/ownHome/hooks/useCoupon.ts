import { useEffect, useState } from 'react'
import { WEB_DESIGN_COMPONENT } from '@apps/design-ui'
import { CouponItemType } from '@apps/design-ui/src/Web/Coupon'
import { validateLoginWrapper } from '@/utils/validateLogin'
import { message } from 'antd'
import { getWebIntl } from '@/utils/locales'
import { postMarketingMobileCouponReceive, postMarketingAdornCouponList } from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'

const useCoupon = () => {
  const { mallInfo, designConfig } = useGlobalConext()
  const [couponList, setCouponList] = useState<CouponItemType[]>([])
  const translate = getWebIntl()

  const fetchCouponList = (list: Array<{ belongType: 1 | 2; couponId: number }>) => {
    postMarketingAdornCouponList(list, { headers: { shopId: mallInfo?.id }, ctlType: 'none' }).then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        const ids = list.map((item) => item.couponId)
        const sortedData = res.data.sort((a, b) => {
          return ids.indexOf(a.id) - ids.indexOf(b.id)
        })
        setCouponList(sortedData as unknown as CouponItemType[])
      }
    })
  }

  useEffect(() => {
    if (designConfig) {
      let couponConfig: any = undefined
      Object.keys(designConfig).forEach((key) => {
        const componentName = key.split('-')[0] as WEB_DESIGN_COMPONENT
        if (componentName === WEB_DESIGN_COMPONENT.Coupon) {
          couponConfig = designConfig[key]
          return
        }
      })

      if (couponConfig && couponConfig.couponList && couponConfig.couponList.length > 0) {
        fetchCouponList(
          couponConfig.couponList.map((item) => ({
            belongType: item.belongType,
            couponId: item.id,
          })),
        )
      }
    }
  }, [])

  const checkLogin = validateLoginWrapper(() => {
    return true
  })

  const onReceiveCoupon = async (couponInfo: CouponItemType) => {
    if (checkLogin()) {
      // 已领取
      if (couponInfo.canReceive === 3) {
        return
      }

      if (couponInfo.canReceive === 1) {
        const tips = translate('web.resource.mall.ninbumanzugaiquanlingqutiaojian')
        message.destroy()
        message.error(tips)
        return
      }

      message.loading({ content: translate('web.resource.mall.zhengzailingqu'), key: 'coupon' })

      const {
        data,
        code,
        message: msg,
      } = await postMarketingMobileCouponReceive(
        {
          shopId: mallInfo?.id!,
          belongType: couponInfo.belongType,
          couponId: couponInfo.id,
        },
        { ctlType: 'none' },
      )
      if (code === 1000) {
        setCouponList(
          couponList.map((item) => {
            if (item.id === couponInfo.id) {
              return {
                ...item,
                canReceive: data.canReceive as any,
              }
            }
            return item
          }),
        )
        message.success({ content: translate('web.resource.mall.lingquchenggong'), key: 'coupon' })
        return
      }
      message.error({ content: msg, key: 'coupon' })
    }
  }

  return {
    couponList,
    onReceiveCoupon,
  }
}

export default useCoupon
