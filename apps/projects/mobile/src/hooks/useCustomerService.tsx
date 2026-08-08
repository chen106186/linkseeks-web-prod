/*
 * @Author: Crayon
 * @Date: 2021-11-15 14:20:49
 * @LastEditTime: 2021-11-17 16:53:54
 * @LastEditors: Crayon
 * @Description: 客服参数或跳转相关处理
 * @FilePath: \lingxi-mobile\src\hooks\useCustomerService.tsx
 */
import { useEffect } from 'react'
import { useStores } from '@/store/useStores'
// import { GlobalConfig } from '@/constants/global'
import { QIYU_H5_URL } from '@/constants'
import Router from '@/utils/router'

// const { customerServiceInfo } = GlobalConfig.global
const customerServiceInfo: any = {}

function useCustomerService() {
  const {
    userStore: { shopAndSite, userInfo },
  } = useStores()

  /**
   * 设置腾讯IM客服
   */
  const setTencentIM = () => {}
  /**
   * 七鱼客服相关参数
   * appKey 为 pass 配置的客服参数
   * @returns
   */
  const setQiyuUrlQuery = () => {
    if (customerServiceInfo?.id && customerServiceInfo?.type === 2) {
      const paramConfig: any[] = customerServiceInfo?.paramConfigList || []
      const configItem = paramConfig.find((item) => item.code === 'appKey') || {}
      return `${QIYU_H5_URL}?appKey=${configItem.value}&uid=${userInfo?.memberId}&shopId=${
        shopAndSite?.memberId || shopAndSite?.id
      }&name=${userInfo?.userName}&mobile=${userInfo?.phone}&email=${userInfo?.email}&account=${userInfo?.account}`
    }
    return null
  }

  const qiyuUrlQuery = setQiyuUrlQuery()

  // 前往客服页面
  const routerToCustomerService = () => {
    // 自有（移动端暂无）
    if (customerServiceInfo?.type === 1) {
    }
    // 第三方，目前是七鱼
    if (customerServiceInfo?.type === 2) {
      if (qiyuUrlQuery) {
        Router.navigateTo('extra/webview', { webUrl: qiyuUrlQuery, navTitle: '客户服务' })
      }
    }
  }

  return { qiyuUrlQuery, routerToCustomerService }
}

export default useCustomerService
