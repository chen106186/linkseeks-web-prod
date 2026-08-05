/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 14:03:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 15:09:40
 * @Description:
 */
import { FormPath, FormEffectHooks } from '@apps/formily'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useBusinessEffects } from './useBusinessEffects'
import {
  getMarketingCouponPlatformGetWayList,
  getMarketingCouponPlatformMemberTypeList,
  getMarketingCouponPlatformSuitableMemberTypeList,
  getMarketingCouponPlatformTypeList,
} from '@apps/apis'
import { getCommodityWebShopWebAll } from '@apps/apis'

const { onFieldMount$ } = FormEffectHooks

// 初始化 优惠券类型
const fetchCouponTypes = async () => {
  const res = await getMarketingCouponPlatformTypeList()

  if (res.code === 1000) {
    const { data = [] } = res
    return {
      type: data.map((item) => ({ label: item.name, value: item.value })),
    }
  }
  return {
    data: [],
    totalCount: 0,
  }
}

// 初始化 领券方式
const fetchCouponGetWay = async () => {
  const res = await getMarketingCouponPlatformGetWayList()

  if (res.code === 1000) {
    const { data = [] } = res
    return {
      getWay: data.map((item) => ({ label: item.name, value: item.value })),
    }
  }
  return {
    data: [],
    totalCount: 0,
  }
}

// 初始化 适用用户
const fetchSuitableUser = async () => {
  const res = await getMarketingCouponPlatformSuitableMemberTypeList()

  if (res.code === 1000) {
    const { data = [] } = res
    return {
      suitableMemberTypes: data.map((item) => ({ label: item.name, value: item.value })),
    }
  }
  return {
    data: [],
    totalCount: 0,
  }
}

// 初始化 适用会员类型
const fetchMemberTypes = async () => {
  const res = await getMarketingCouponPlatformMemberTypeList()

  if (res.code === 1000) {
    const { data = [] } = res
    return {
      memberTypes: data.map((item) => ({ label: item.name, value: item.value })),
    }
  }
  return {
    data: [],
    totalCount: 0,
  }
}

export const createEffects = (context, actions) => {
  const { setFieldState } = actions

  useBusinessEffects(context, actions)

  useAsyncInitSelect(['type'], fetchCouponTypes)

  useAsyncInitSelect(['getWay'], fetchCouponGetWay)

  useAsyncInitSelect(['suitableMemberTypes'], fetchSuitableUser)

  useAsyncInitSelect(['memberTypes'], fetchMemberTypes)

  // 初始化 适用商城数据
  onFieldMount$('suitableMallTypes').subscribe(() => {
    getCommodityWebShopWebAll(
      {
        type: 1, // 企业商城
      },
      {
        ctlType: 'none',
      },
    ).then((res) => {
      if (res.code === 1000) {
        const { data = [] } = res
        setFieldState('suitableMallTypes', (state) => {
          FormPath.setIn(
            state,
            'props.enum',
            data.map((item) => ({ label: item.name, value: item.id, logo: item.logoUrl })),
          )
        })
      }
    })
  })
}
