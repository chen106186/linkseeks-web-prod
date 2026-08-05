import { View } from '@tarojs/components'
import React, { useState, useEffect, Fragment } from 'react'
import cx from 'classnames'
import styles from './index.module.scss'
import { Button, Image } from '@apps/mobile-ui'
import { getCurrentInstance, showToast } from '@apps/mobile-services/utils/taro'
import { useMobileIntl } from '@apps/locales'

const MultAccInfoList = () => {
  const {
    multiAccInfoRespList = [],
    mult = false,
    handleSubmit,
    submitText,
    activeUserId: propActiveUserId,
    title,
  }: any = getCurrentInstance().preloadData
  const translate = useMobileIntl()
  const [activeUserId, setActiveUserId] = useState<any>([])
  useEffect(() => {
    setActiveUserId(propActiveUserId)
  }, [propActiveUserId])
  const isActive = (userId) => {
    if (mult) {
      return activeUserId.includes(userId)
    } else {
      return activeUserId === userId
    }
  }
  const setUserId = (userId) => {
    if (mult) {
      const newArr = [...activeUserId]
      if (newArr.includes(userId)) {
        newArr.splice(newArr.indexOf(userId), 1)
      } else {
        newArr.push(userId)
      }
      setActiveUserId(newArr)
    } else {
      setActiveUserId(userId)
    }
  }
  const handleOnSubmit = () => {
    if (activeUserId) {
      if (handleSubmit) {
        if (mult) {
          handleSubmit(activeUserId)
        } else {
          handleSubmit(multiAccInfoRespList.find((v) => v.userId === activeUserId))
        }
      }
    } else {
      showToast({
        title: translate('public.qingxuanzegongsizhanghao'),
        icon: 'none',
      })
    }
  }
  return (
    <View className={cx(styles.loginWrap, styles.multWrapper)}>
      <View className={styles.h3}>{title}</View>
      <View className={styles.multListWrapper}>
        {multiAccInfoRespList?.map((v) => {
          return (
            <View
              onClick={() => setUserId(v.userId)}
              className={cx(styles.multItem, isActive(v.userId) && styles.active)}
            >
              <Image
                className={styles.image}
                src={
                  v.logo ||
                  'http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/assets/images/default_avatar.png'
                }
              />
              <View className={styles.multText}>{v.memberName}</View>
            </View>
          )
        })}
      </View>
      <Button
        customStyle={{
          width: 200,
        }}
        type="primary"
        onClick={handleOnSubmit}
      >
        {submitText}
      </Button>
    </View>
  )
}
export default MultAccInfoList
