import React from 'react'
import { View, StandardForm } from '@apps/mobile-ui'
import { preload, navigateToMiniProgram } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { postPayAllInPaySignContract } from '@apps/apis'
import LineCard, { STATUS_ENUM } from '../../components/LineCard'
import { useAuthenticationContext } from './context'
import { IS_WEB } from '@/constants'

const AgreementStep = () => {
  const { refreshMemberInfo } = useAuthenticationContext()
  const goSign = async () => {
    const res = await postPayAllInPaySignContract({
      jumpPageType: IS_WEB ? 1 : 2,
      source: 1,
      jumpUrl: location.href,
    })

    const signUrl = res.data

    if (IS_WEB) {
      preload('params', {
        onConfirm: refreshMemberInfo,
        url: signUrl,
      })
      Router.navigateTo('basicSetting/webInfo')
    } else {
      // 小程序环境
      navigateToMiniProgram({
        appId: 'wxc46c6d2eed27ca0a',
        path: 'pages/merchantAddress/merchantAddress',
        extraData: {
          targetUrl: signUrl,
        },
        envVersion: 'release',
      })
    }
  }
  return (
    <LineCard title={'提现协议签署'} status={STATUS_ENUM.READY} statusText="待签署">
      <StandardForm>
        <StandardForm.Item label="电子协议签约">
          <View onClick={goSign}>前往签署 &gt;</View>
        </StandardForm.Item>
      </StandardForm>
    </LineCard>
  )
}

export default AgreementStep
