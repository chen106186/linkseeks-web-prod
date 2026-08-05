import GlobalWrapper from '@/components/GlobalWrapper'
import React, { Fragment } from 'react'
import { View, Image } from '@apps/mobile-ui'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { useMobileIntl } from '@apps/locales'
import useSwitchMall from '@/hooks/useSwitchMall'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { getOssUrlPath } from '@apps/constants'

const Icon = getOssUrlPath('/miniprogram/assets/images/Checked-@2x.png')

/* 认证成功 */
const Complete = () => {
  const { isNeedAudit }: any = getCurrentInstance()?.router?.params
  const needAudit = isNeedAudit === 'true'
  const intl = useIntl()
  const translate = useMobileIntl()
  const { fetchMall } = useSwitchMall()
  const Link = async () => {
    fetchMall()
  }
  usePageInit()
  return (
    <View className={styles['container']}>
      <View className={styles['head']}>
        <Image src={Icon} className={styles['logo']} />
        <View className={styles['logoTitle']}>
          {needAudit
            ? intl.formatMessage({
                id: 'user.tijiaochenggong',
                defaultMessage: '提交成功',
              })
            : translate('mobile.resource.user.zhucechenggong')}
        </View>
        {needAudit && (
          <Fragment>
            <View className={styles['Text']}>
              {intl.formatMessage({
                id: 'user.qingdengdaipingtaishenhe',
                defaultMessage: '请等待平台审核，审核结果会以短信通知您',
              })}
            </View>
            <View className={styles['Text']}>
              {intl.formatMessage({
                id: 'user.ninyekeyidenglupingtai',
                defaultMessage: '您也可以登录平台查看审核结果',
              })}
            </View>
          </Fragment>
        )}
      </View>
      <View onClick={Link} className={styles['btn']}>
        {intl.formatMessage({
          id: 'user.jinrushouye',
          defaultMessage: '进入首页',
        })}
      </View>
    </View>
  )
}
export default GlobalWrapper(Complete)
