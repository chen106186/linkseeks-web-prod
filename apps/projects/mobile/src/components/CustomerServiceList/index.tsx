import { ActionSheet, Text, View } from '@apps/mobile-ui'
import React, { useEffect, useState } from 'react'
import {
  getMemberAbilityInfoGetHasImAuthUsers,
  getMemberAbilityInfoGetPlatformImUsers,
  getMemberUserRegisterTencentIm,
} from '@apps/apis'
import { useCustomerService } from '@apps/services/customerService/useCustomerService'
import { getStorageSync, hideLoading, showLoading, showToast } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { USER_INFO } from '@/constants/storage'
import { useMobileIntl } from '@apps/locales'

const CustomerServiceList = (props) => {
  const { visible, onClose, memberId, isAdmin } = props
  const [list, setList] = useState<any[]>([])
  const { getToCustomerUrl } = useCustomerService()
  const translate = useMobileIntl()

  const toImChat = (e, userId) => {
    e.stopPropagation()
    navigateServices(userId)
  }

  const navigateServices = async (userId) => {
    let url: any
    let payload: any
    const auth = await getStorageSync(USER_INFO)
    if (!auth) {
      Router.redirectTo('user/login')
      return
    }
    showLoading({
      title: translate('mobile.common.zhengzaidakaikefu'),
    })
    const { code, data, message } = await getMemberUserRegisterTencentIm({ userId })
    hideLoading()
    if (code !== 1000) {
      showToast({
        title: message,
        icon: 'error',
      })
      return
    }
    try {
      const res = await getToCustomerUrl(auth, userId)
      url = res?.url
      payload = res?.payload
    } catch (err) {
      showToast({
        title: err,
        icon: 'error',
      })
    }
    if (url) {
      Router.navigateTo(url, payload)
      onClose()
    } else {
      showToast({
        title: '没有可用的IM信息',
        icon: 'error',
      })
    }
  }

  useEffect(() => {
    if (visible && isAdmin) {
      // 如果是平台客服
      getMemberAbilityInfoGetPlatformImUsers().then((res) => {
        setList(res.data)
      })
      return
    }
    if (visible && memberId) {
      getMemberAbilityInfoGetHasImAuthUsers({
        memberId,
      }).then((res) => {
        setList(res.data)
      })
    }
  }, [visible, memberId, isAdmin])

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...'
    }
    return str
  }

  return (
    <ActionSheet
      title={translate('mobile.common.qingxuanzexuyaoliaotiandekefu')}
      isOpened={visible}
      onClose={onClose}
      bodyStyle={{ maxHeight: '400px', paddingBottom: '54px', overflow: 'scroll' }}
      customStyle={{ zIndex: '999999', paddingBottom: 'env(safe-area-inset-bottom)' }}
      actions={list.map((v) => {
        return { name: `${v.userName}（${truncateString(v.memberName, 10)}）`, value: v.userId }
      })}
      onSelect={(_, item) => toImChat(_, item?.value)}
    />
  )
}

export default CustomerServiceList
