import GlobalWrapper from '@/components/GlobalWrapper'
import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { observer } from 'mobx-react-lite'
import { View, Image, Text } from '@apps/mobile-ui'
import NavBar from '@/components/NavBar'
import styles from './index.module.scss'
const successIcon = 'https://obs-wnwl.obs.cn-east-3.myhuaweicloud.com/mini-program/img-add/teamleader-apply-success.png'
import Router from '@/utils/router'

const TeamLeaderApplySuccess: React.FC<{}> = () => {
  const intl = useIntl()

  const handleBack = () => {
    Router.navigateBack({
      delta: 2,
    })
  }

  return (
    <View className={styles['apply-success']}>
      <NavBar
        title=""
        back={handleBack}
        titleColor="#fff"
        backIconColor="#5A2A12"
        customClassName={styles['nav-bar-custom']}
        customStyle="background-color: #00A98F;"
        showBack={true}
        showExtra={false}
      />
      <View className={styles['apply-success-box']}>
        <View className={styles['apply-success-top']}>
          <Image className={styles['apply-box-info-icon']} src={successIcon} />
          <Text className={styles['apply-box-info-text']}>
            {intl.formatMessage({
              id: 'teamLeader.tijiaochenggong',
              defaultMessage: '提交成功',
            })}
          </Text>
        </View>
        <Text className={styles['apply-success-text1']}>
          {intl.formatMessage({
            id: 'teamLeader.tuanzhangshenqingshenhe',
            defaultMessage: '团长申请将在5个工作日审核，请耐心等待',
          })}
        </Text>
        <Text className={styles['apply-success-text2']}>
          {intl.formatMessage({
            id: 'teamLeader.ruyouyiwenqingzixun',
            defaultMessage: '如有疑问，请咨询400-2000-000',
          })}
        </Text>
      </View>
    </View>
  )
}

export default GlobalWrapper(observer(TeamLeaderApplySuccess))
