import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import { Image, View } from '@tarojs/components'
import { getCurrentInstance, setClipboardData, showToast } from '@apps/mobile-services/utils/taro'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import './index.scss'
const imgUrl = getOssUrlPath('/Images/contract-submit-success.png')
const SubmitSucceed = () => {
  const { url } = getCurrentInstance()?.preloadData || {}
  const translate = useMobileIntl()
  const clipboard = (dataText: string) => {
    setClipboardData({
      data: dataText,
      success: () => {
        showToast({
          title: '复制成功',
          icon: 'none',
        })
      },
    })
  }
  return (
    <View className="submit-succeed-box">
      <View className="img-box">
        <Image src={imgUrl} />
      </View>
      <View className="submit-text">{translate('mobile.resource.contract.nindeshenqingziliaoyijingtijiao')}</View>
      <View className="submit-tips">{translate('mobile.resource.contract.shouweixinxiaocxgongnengxianzhi')}</View>
      <View
        children={translate('mobile.resource.contract.fuzhilianjie')}
        className="clipboard-btn"
        onClick={() => clipboard(url)}
      />
    </View>
  )
}
export default GlobalWrapper(SubmitSucceed)
