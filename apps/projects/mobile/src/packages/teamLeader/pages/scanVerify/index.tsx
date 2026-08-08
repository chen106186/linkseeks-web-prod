import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import GlobalWrapper from '@/components/GlobalWrapper'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { Image, View, Text } from '@apps/mobile-ui'
import styles from './index.module.scss'
import { getOrderMobileCbgTeamLeaderGetOrderByCheckCode } from '@apps/apis'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import Search from '@/components/Search'
import { showToast, scanCode } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
const CameraIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/camera.png'

const TeamLeaderScanVerify: React.FC<{}> = () => {
  const intl = useIntl()
  const [keyword, setKeyword] = useState<string>('')

  // 是否开启扫码模式
  const [scanOpen, setScanOpen] = useState<boolean>(true)

  // useEffect(() => {
  //   // 页面加载后自动扫码（可关闭）
  //   if (scanOpen) {
  //     triggerScan()
  //   }
  // }, [scanOpen])

  // 点击相机
  const handleToggleScan = async () => {
    try {
      const res = await triggerScan({ onlyFromCamera: true })
      const result = res.result
      if (result !== keyword) {
        setKeyword(result)
      } else {
        setKeyword('')  // 强制触发一次变化
        setTimeout(() => setKeyword(result), 0)
      }
      setTimeout(() => {
        getOrderByCheckCode(result)
      }, 800)
    } catch (err) {
      Taro.showToast({
        title: intl.formatMessage({
          id: 'teamLeader.saomashibai',
          defaultMessage: '扫码失败',
        }),
        icon: 'none',
        duration: 1500,
      })
      // setScanOpen(false)
    }
  }

  // 扫码
  const triggerScan = async (
    options: Omit<Taro.scanCode.Option, 'fail' | 'success'>,
  ): Promise<Taro.scanCode.SuccessCallbackResult> => {
    return new Promise((resolve, reject) => {
      scanCode({
        ...options,
        success: (res: Taro.scanCode.SuccessCallbackResult) => {
          resolve(res)
        },
        fail: (res: TaroGeneral.CallbackResult) => {
          reject(res)
        },
      })
    })
  }

  // 搜索
  const handleSearch = (val: string) => {
    if (!val) {
      Taro.showToast({
        title: intl.formatMessage({
          id: 'teamLeader.qignshuruquhuoma',
          defaultMessage: '请输入取货码',
        }),
        icon: 'none',
        duration: 1000,
      })
      return
    }
    setKeyword(val)
    getOrderByCheckCode(val)
  }

  // 根据核销码匹配订单
  const getOrderByCheckCode = (code: string) => {
    FullScreenLoading.show()
    const params = {code: code}
    getOrderMobileCbgTeamLeaderGetOrderByCheckCode(params).then(res => {
      FullScreenLoading.hide()
      if(res.code === 1000) {
        const orderId = res.data
        Router.navigateTo('teamLeader/agentPickup', {orderId: orderId, enterType: 1})
      } else {
        showToast({ title: res.message, icon: 'none', duration: 1500 })
      }
    }).catch((err) => {
      console.log("err", err)
      FullScreenLoading.hide()
    })
  }

  return (
    <View className={styles['scan-verify']}>
      <View className={styles['scan-verify-top']}>
        <Search
          background="#f5f6f7"
          customClassName={styles['scan-verify-search']}
          defaultValue={keyword}
          onSearch={handleSearch}
          placeholder={intl.formatMessage({ id: 'teamLeader.qingshuruquhuoma', defaultMessage: '请输入取货码' })}
          shape="round"
        />
        <Image className={styles['scan-verify-icon']} src={CameraIcon} onClick={handleToggleScan} />
      </View>
      <FullScreenLoading />
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderScanVerify))
