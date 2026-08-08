/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-24 14:03:34
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 15:00:51
 * @Description:
 */
import { FormPath, FormEffectHooks } from '@apps/formily'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useBusinessEffects } from './useBusinessEffects'
import { ResponseType } from '../../../../../components/MemberCheckboxGroup'
import {
  getMarketingCouponGetWayList,
  getMarketingCouponSuitableMemberTypeList,
  getMarketingCouponTypeList,
} from '@apps/apis'
import { getMemberManageMarketingSuitableLevelConfigPage } from '@apps/apis'
import { getProductCustomerGetCustomerCategoryTree, getProductSelectGetSelectBrand } from '@apps/apis'
import { getCommodityWebShopWebAll } from '@apps/apis'

const { onFieldMount$ } = FormEffectHooks

// 初始化 优惠券类型
const fetchCouponTypes = async () => {
  const res = await getMarketingCouponTypeList()

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
  const res = await getMarketingCouponGetWayList()

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
  const res = await getMarketingCouponSuitableMemberTypeList()

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

// 获取 实用会员选项
const fetchMemberOptions: (params: {
  current: string
  pageSize: string
  levelConfigIds: string
  roleIds: string
  memberTypes: string
}) => Promise<ResponseType> = async (params) => {
  const res = await getMemberManageMarketingSuitableLevelConfigPage(params)
  if (res.code === 1000) {
    const options = res.data.data.map((item) => ({
      label: item.roleName,
      value: item.id,
      level: item.level,
      roleName: item.roleName,
      levelTypeName: item.levelTypeName,
      memberTypeName: item.memberTypeName,
      levelTag: item.levelTag,
    }))
    return {
      data: options,
      totalCount: res.data.totalCount,
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

  // 初始化 品牌数据
  onFieldMount$('applicableBrands').subscribe(() => {
    getProductSelectGetSelectBrand().then((res) => {
      if (res.code === 1000) {
        const { data = [] } = res
        setFieldState('applicableBrands.*.brand', (state) => {
          FormPath.setIn(
            state,
            'props.enum',
            data.map((item) => ({ label: item.name, value: `${item.id}` })),
          )
        })
      }
    })
  })

  // 初始化 品类数据
  onFieldMount$('applicableCategories').subscribe(() => {
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      if (res.code === 1000) {
        const { data = [] } = res
        setFieldState('applicableCategories.*.category', (state) => {
          FormPath.setIn(state, 'props.x-component-props.options', data)
        })
      }
    })
  })

  // 初始化 适用商城数据
  onFieldMount$('suitableMallTypes').subscribe(() => {
    getCommodityWebShopWebAll({ isMemberType: true }, { ctlType: 'none' }).then((res) => {
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

  // 初始化 适用会员列表
  onFieldMount$('applicationMemberLevel').subscribe(() => {
    setFieldState('applicationMemberLevel', (state) => {
      FormPath.setIn(state, 'props.x-component-props', {
        showMoreAction: true,
        fetchOptions: fetchMemberOptions,
      })
    })
  })
}
