import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import cx from 'classnames'
import { useDidShow, setNavigationBarTitle, pxTransform } from '@apps/mobile-services/utils/taro'
import { Text, View, Image, Icons, ScrollView } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import useMemberInfo from './services/hooks/useMemberInfo'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'
const Icon = getOssUrlPath('/miniprogram/assets/images/default_logo.png')
const iconRight = getOssUrlPath('/miniprogram/assets/images/icon-right.svg')
const MemberInfo = () => {
  const intl = useIntl()
  const { userInfo, showModify, basic, groups, Jump, previewImageFunc, getMemberType, getData } = useMemberInfo()
  usePageInit()
  useDidShow(() => {
    // setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.huiyuanxinxi', defaultMessage: '会员信息' }) })
    getMemberType()
    getData()
  })
  return (
    <View className={styles['container']}>
      <ScrollView>
        <View className={styles['head']}>
          <Image
            src={userInfo.logo || Icon}
            style={{
              width: pxTransform(40),
              height: pxTransform(40),
              borderRadius: pxTransform(3),
            }}
          />
          <View className={styles['head-container']}>
            <Text className={styles['name']}>{userInfo?.name}</Text>
            <Text className={styles['tag']}>{userInfo?.outerStatusName}</Text>
          </View>
          {showModify && (
            <View onClick={Jump}>
              <View className={styles['right']}>
                <Text className={styles['right-text']}>
                  {intl.formatMessage({
                    id: 'user.xiugai',
                    defaultMessage: '修改',
                  })}
                </Text>
                <Image className={styles['icon-right']} src={iconRight} />
              </View>
            </View>
          )}
        </View>
        <View className={styles['warp-list']}>
          <View className={styles['warp-item']}>
            <View className={styles['title']}>
              <Text className={styles['title-text']}>
                {intl.formatMessage({
                  id: 'user.jibenxinxi',
                  defaultMessage: '基本信息',
                })}
              </Text>
            </View>
            {basic.map((item: any, index: number) => (
              <View className={styles['warp-card']} key={index}>
                <Text className={cx(styles['name'], styles['text-color'])}>{item.name}</Text>
                <Text className={styles['name']}>
                  {item.key
                    ? item.key
                    : intl.formatMessage({
                        id: 'user.wu',
                        defaultMessage: '无',
                      })}
                </Text>
              </View>
            ))}
          </View>

          {groups.map((item: any, index: number) => (
            <View className={styles['warp-item']} key={index}>
              <View className={styles['title']}>
                <Text className={styles['title-text']}>{item.name}</Text>
              </View>
              {item.list.map((val: any, key: number) => (
                <View className={styles['warp-card']} key={key}>
                  <Text className={cx(styles['name'], styles['text-color'])}>{val?.name}</Text>

                  {val.fieldType === 'file' ? (
                    <Image
                      src={val.fieldValue}
                      style={{
                        width: pxTransform(120),
                        height: pxTransform(80),
                      }}
                      onClick={() => previewImageFunc(val.fieldValue)}
                      mode="aspectFit"
                    />
                  ) : (
                    <Text className={styles['name']}>{val?.fieldValue}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
export default GlobalWrapper(MemberInfo)
