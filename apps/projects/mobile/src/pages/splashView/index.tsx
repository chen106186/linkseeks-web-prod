import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import Manifest from '@/constants/manifest'
import { observer } from 'mobx-react-lite'
import { CountDown, View, Text, Image } from '@apps/mobile-ui'
import { getManageContentImageStartAndGuide } from '@apps/apis'
import useJmpHome from '@/hooks/useJmpHome'
import { createSelectorQuery, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { IS_WEB, PRIVACY_POP } from '@/constants'
import indexIcon from '@/assets/images/index.png'
import styles from './index.module.scss'
import { getValueByLanguage } from '@/utils'
import useParameterValue from '@/hooks/useParameterValue'
const SplashView: React.FC = () => {
  const [splashImage, setSplashImage] = useState('')
  const { loading, parameterValue } = useParameterValue()
  const { jmpDefaultHome } = useJmpHome()
  useEffect(() => {
    console.log('Enter SplashView')
    getManageContentImageStartAndGuide(
      {},
      {
        timeout: 5000,
      },
    ).then((res) => {
      if (res.code === 1000) {
        setSplashImage(res.data.startUrl)
      }
    })
  }, [])

  useEffect(() => {
    if (parameterValue) {
      setNavigationBarTitle({
        title: getValueByLanguage(parameterValue?.appName),
      })
    }
  }, [parameterValue])

  const handleCountDownChange = () => {
    // 鸿蒙 5.0 不执行 createSelectorQuery().exec() 社区文献表示 已得知是微信内核的问题，个例问题，官方人员正在修复
    setTimeout(() => {
      jmpDefaultHome()
    }, 200)
    return
    // 下述逻辑直接隐藏似乎也不会有问题 为了兼容鸿蒙尝试一下解决
    if (IS_WEB) {
      jmpDefaultHome()
    } else {
      createSelectorQuery()
        .select(`.${PRIVACY_POP}`)
        .boundingClientRect((rect) => {
          console.log(rect, 'rect')
          if (!rect) {
            jmpDefaultHome()
          }
        })
        .exec()
    }
  }
  return (
    <View className={styles.page}>
      <View className={styles.imgContainer}>
        <View className={styles.countDown}>
          <CountDown onClick={handleCountDownChange} count={3} onFinish={handleCountDownChange}>
            {(time) => (
              <View className={styles.skip}>
                <Text className={styles.skipText}>{time} S</Text>
              </View>
            )}
          </CountDown>
        </View>
        {(splashImage && <Image src={splashImage} className={styles.img} />) || null}
      </View>
      <View className={styles.bottom}>
        <Image src={parameterValue?.logo} className={styles.logo} />
        {/* <View className={styles.appName}>
          <Text className={styles.name}>{Manifest.APP_NAME}</Text>
          <Text className={styles.text}>{Manifest.SLOGEN}</Text>
        </View> */}
      </View>
    </View>
  )
}
export default GlobalWrapper(observer(SplashView))
