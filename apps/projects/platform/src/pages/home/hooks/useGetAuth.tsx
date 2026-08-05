import { getRouters } from '@/utils/auth'
import { authService } from '@apps/services'
import { useCallback, useMemo } from 'react'
import { HOME_TODO } from '@/constants/home'

type AbilityNameType =
  | 'orderAbility'
  | 'shopAbility'
  | 'dealAbility'
  | 'procurementAbility'
  | 'contract'
  | 'commodityAbility'
  | 'channelAbility'
  | 'payandSettle'
  | 'balance'
  | 'afterService'
  | 'logisticsAbility'
  | 'handling'
  | 'memberAbility'
  | 'customerAbility'
  | 'supplierAbility'
  | 'quality'
  | 'marketingAbility'

type isCheckedLayoutsType = {
  id: number | null
  code?: number
  name: string
  sort: number
  isShow?: boolean | (0 | 1 | number)
}

const collection2Obj = <T,>(list: T[], name: string, isCover?: boolean) => {
  const res = list.reduce((prev, current: T) => {
    const value = current[name]
    if (!isCover) {
      if (typeof prev[value] === 'undefined') {
        prev[value] = current
      }
    } else {
      prev[value] = current
    }
    return { ...prev }
  }, {})
  return res
}

const useGetAuth = () => {
  const userAuth = authService.getAuth()
  const cacheAuth = useMemo(() => userAuth, [userAuth])
  const urls = useMemo(() => authService.getAuthUrlList(authService.getAuthList()), [])

  const abilityUrls = useMemo(() => {
    return {
      orderAbility: [
        '/orderAbility/saleOrder',
        '/orderAbility/supplierEvaluation/',
        '/orderAbility/purchaseOrder/',
        '/orderAbility/purchaserEvaluation/',
      ],
      shopAbility: ['/commodityAbility/commodity/products', '/commodityAbility/trademark'],
      dealAbility: ['/dealAbility/productInquiry', '/dealAbility/inquiryOffer', '/dealAbility/confirmOffer'],
      // 采购中心
      procurementAbility: [
        '/procurementAbility/purchaseInquiry/',
        '/procurementAbility/offter/',
        '/procurementAbility/confirmOffer/',
        '/procurementAbility/callForBids/',
        '/procurementAbility/tender/',
      ],
      // 合同中心
      contract: ['/contract/'],
      // 商品能力
      commodityAbility: ['/commodityAbility/commodity/products', '/commodityAbility/trademark'],
      // 资金账户管理中心
      payandSettle: ['/payandSettle/creditManage/'],
      // 结算
      balance: ['/balance/platformSettlement/', '/balance/accountsPayable/', '/balance/accountsReceivable/'],
      // 售后
      afterService: [
        '/afterAbility/repairApplication/',
        '/afterAbility/repairManage/',
        '/afterAbility/returnApplication/',
        '/afterAbility/returnManage/',
        '/afterAbility/exchangeApplication/',
        '/afterAbility/exchangeManage/',
      ],
      // 物流中心
      logisticsAbility: '/logisticsAbility/',
      // 加工
      // handling: ['/handling/confirm/', '/handling/assign/'],
      // 会员
      memberAbility: [
        '/memberAbility/manage/',
        '/memberAbility/memberEvaluate/',
        '/memberAbility/memberRectification/',
        '/memberAbility/profile/',
      ],
      //客户
      customerAbility: ['/customerAbility/manage', '/customerAbility/memberEvaluate'],
      // 供应商
      supplierAbility: '/supplierAbility',
      // 质量
      // quality: ['/qualityAbility/qualityManage', '/qualityAbility/8D', '/qualityAbility/8DCoordination'],
      // 营销
      // marketingAbility: [
      //   '/marketingAbility/selfManagement',
      //   '/marketingAbility/paltformSign',
      //   '/marketingAbility/merchantCoupon',
      // ],
    }
  }, [])

  /**
   * 只要当前能力拥有他们其中一个准入路由，那么就代表有权限,
   * @review 这里是否有最优解 不应该对某个中心做判断，应该在home 进来的时候就获取所有layout的权限，但貌似时间复杂度是一样的
   */
  const hasAbility = useCallback(
    (abilityName: AbilityNameType) => {
      /** 这里本来想写正则的， 可是没想到好的方案, 之前直接判断模块前缀的话，没有添加子集菜单同样也没有权限 */
      if (!abilityUrls[abilityName]) {
        return false
      }
      const value = abilityUrls[abilityName]
      const currentAbilityUrl = !Array.isArray(value) ? [].concat(value) : value
      return currentAbilityUrl.some((_item) => urls?.some((_row) => _row.includes(_item)))
    },
    [urls, abilityUrls],
  )

  const isConsumer = useMemo(() => cacheAuth?.memberRoleType === 2, [cacheAuth])

  /**
   * 直接判断有没有大模块如果有，那么表示应该显示此模块，
   */
  const getLayoutCenters = useCallback(() => {
    const name2link = HOME_TODO
    const allAuthCenterUrls = Object.keys(name2link)

    const authCenterName = allAuthCenterUrls.reduce((result, _row) => {
      const obj: any = {
        code: _row,
        name: name2link[_row],
      }
      if (urls?.includes(_row)) {
        result = result.concat(obj)
      }
      return result
    }, [])
    const uniqueName = Array.from(new Set(authCenterName))
    return uniqueName
  }, [cacheAuth])

  /**
   *
   * @param authLayouts  根据pass 平台勾选的大模块, 生成的names 即从getLayoutCenters 得到的值
   * @param isCheckedLayouts 后台返回的已勾选的的大模块项
   *
   */
  const generateLayoutData = useCallback(
    (authLayouts: Array<{ code: string; name: string }>, isCheckedLayouts: isCheckedLayoutsType[]) => {
      const filterNameIsNull = isCheckedLayouts.filter((_item) => _item.code !== null)
      /** 已勾选的数组 转换成对象 */
      const res = collection2Obj(filterNameIsNull, 'code')
      /** 根据权限跟目前已勾选的值，重新组合layout */
      const newLayoutData = authLayouts.map((_item, index) => {
        const target: isCheckedLayoutsType = res[_item.code] || {}
        return {
          ...target,
          name: _item.name,
          code: _item.code,
          sort: target.sort ?? index + 2,
          isShow: target?.id ? true : false,
        }
      })
      return newLayoutData.sort((a, b) => a.sort - b.sort)
    },
    [],
  )

  return {
    authUrlList: urls,
    userAuth: cacheAuth,
    hasAbilityFunc: hasAbility,
    isConsumer,
    getLayoutCentersName: getLayoutCenters,
    generateLayoutData: generateLayoutData,
  } as const
}

export default useGetAuth
