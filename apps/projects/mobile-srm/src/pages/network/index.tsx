import React from 'react'
import { View, Toast, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import Router from '@/utils/router'
import { pxTransform, getNetworkType } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'

const Network = () => {
  const intl = useIntl()
  const Liek = async () => {
    const res = await getNetworkType()
    if (res.networkType === 'none') {
      Toast.show({
        title: intl.formatMessage({ id: 'user.wangluolianjieshibai', defaultMessage: '网络连接失败' }),
        icon: 'none',
      })
    } else {
      Router.navigateBack()
    }
  }
  return (
    <View
      style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: pxTransform(20), justifyContent: 'center' }}
    >
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: pxTransform(20),
        }}
      >
        <Image
          src={getOssUrlPath(`/Images/ic-woke%402x.png`)}
          style={{ width: pxTransform(100), height: pxTransform(100) }}
        />
        <View style={{ fontSize: pxTransform(16), color: '#1F2C3D' }}>
          {intl.formatMessage({ id: 'user.wangluocuowu', defaultMessage: '网络错误' })}
        </View>
        <View style={{ fontSize: pxTransform(12), color: '#91959B' }}>
          {intl.formatMessage({ id: 'user.qingjianchawangluolianjiehou', defaultMessage: '请检查网络连接后重试' })}
        </View>
        <View
          style={{
            backgroundColor: '#00A98F',
            fontSize: pxTransform(12),
            color: '#fff',
            borderRadius: pxTransform(4),
            marginTop: pxTransform(10),
            width: '100%',
            textAlign: 'center',
            padding: pxTransform(8),
          }}
          onClick={Liek}
        >
          {intl.formatMessage({ id: 'user.zhongshi', defaultMessage: '重试' })}
        </View>
      </View>
    </View>
  )
}

export default Network
