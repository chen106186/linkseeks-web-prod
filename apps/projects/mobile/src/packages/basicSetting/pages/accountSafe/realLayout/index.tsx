import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, Icons, Toast } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { pxTransform, preload } from '@apps/mobile-services/utils/taro'
import Cell from '@/components/Cell'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { useSafeArea, useStatusBarHeight } from '@apps/mobile-services'
import { decryptedByAES } from '@linkseeks/crypto'
import { getMemberMobileSecurityGetUserInfo } from '@apps/apis'
import styles from './index.module.scss'
const shield = getOssUrlPath('/miniprogram/assets/images/shield.png')
type infoProps = {
  /** 用户Id */
  userId?: number
  /** 姓名 */
  name?: string
  /** 身份证号码 */
  cardNo?: string
}
const RealNameLayout: React.FC<{}> = () => {
  const { safeBottomHeight } = useSafeArea()
  const { statusBarHeight } = useStatusBarHeight()
  const [info, setInfo] = useState<infoProps>()
  const intl = useIntl()
  const handleJump = (data?: infoProps, preview?: boolean) => {
    preload({
      data,
      preview,
    })
    Router.navigateTo('basicSetting/realChange')
  }
  useEffect(() => {
    getMemberMobileSecurityGetUserInfo().then((res: any) => {
      if (res.code !== 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          icon: 'none',
        })
        return
      }
      const { data } = res
      setInfo(data)
    })
  }, [])
  return (
    <View
      className={styles['realLayout']}
      style={
        safeBottomHeight
          ? {
              paddingBottom: `${safeBottomHeight}PX`,
            }
          : {}
      }
    >
      <View className={styles['realLayout-page']}>
        <View
          className={styles['realLayout-header']}
          style={{
            paddingTop: `${statusBarHeight}PX`,
          }}
        >
          <View className={styles['realLayout-backLayout']}>
            <View className={styles['realLayout-icons']} onClick={() => Router.navigateBack()}>
              <Icons name="ChevronLeft" size={24} color="#5A2A12" />
            </View>
            <View className={styles['realLayout-titleView']}>
              <Text className={styles['realLayout-text']}>
                {intl.formatMessage({
                  id: 'realname.shimingrenzheng',
                  defaultMessage: '实名认证',
                })}
              </Text>
            </View>
          </View>
          <View className={styles['realLayout-shieldBox']}>
            <Image src={shield} className={styles['realLayout-image']} />
            <Text className={styles['realLayout-shieldTitle']}>
              {intl.formatMessage({
                id: 'realname.ninyitongguoshimingrenzheng',
                defaultMessage: '您已通过实名认证',
              })}
            </Text>
          </View>
        </View>
        <View className={styles['realLayout-cardInfo']}>
          <Cell>
            <Cell.Item
              customHeadStyle={{
                padding: `${pxTransform(16)} 0`,
              }}
              customTitleStyle={{
                fontWeight: 'bold',
              }}
              title={intl.formatMessage({
                id: 'realname.renzhengxinxi',
                defaultMessage: '认证信息',
              })}
              hasArrow
              clickable
              onPress={() => handleJump(info, true)}
            />
            <Cell.Item
              customHeadStyle={{
                padding: `${pxTransform(16)} 0`,
              }}
              title={intl.formatMessage({
                id: 'realname.xingming',
                defaultMessage: '姓名',
              })}
              value={
                info?.name ||
                intl.formatMessage({
                  id: 'realname.shangchuanhouzidonghuoqu',
                  defaultMessage: '上传后自动获取',
                })
              }
            />
            <Cell.Item
              customHeadStyle={{
                padding: `${pxTransform(16)} 0`,
              }}
              title={intl.formatMessage({
                id: 'realname.zhengjianhao',
                defaultMessage: '证件号',
              })}
              value={
                info?.cardNo
                  ? decryptedByAES(info?.cardNo, false)
                  : intl.formatMessage({
                      id: 'realname.shangchuanhouzidonghuoqu',
                      defaultMessage: '上传后自动获取',
                    })
              }
            />
          </Cell>
        </View>
      </View>
      <View className={styles['realLayout-tipLayout']}>
        <Text className={styles['realLayout-tipLayoutText']}>
          {intl.formatMessage({
            id: 'realname.genjuhaiguanyaoqiuhai',
            defaultMessage:
              '根据海关要求，海外商品入境需提交收件人身份证信息用于清关申报，请确保提供真实有效的身份证件信息。',
          })}
        </Text>
      </View>
    </View>
  )
}
export default GlobalWrapper(RealNameLayout)
