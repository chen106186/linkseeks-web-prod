import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import cx from 'classnames'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, ScrollView, Input, Button } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { useSafeArea } from '@apps/mobile-services'
import useLogOffConfirm from './services/hooks/useLogOffConfirm'
import Progress from '../components/progress'
import styles from './index.module.scss'
const LogOffConfirm: React.FC = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const { code, data, confirmDisable, countdown, canSend, handleSend, handleTextCode, handlePre, handleConfirm } =
    useLogOffConfirm()
  const _renderItem = (item, index) => {
    if (item.type && item.type === 'text') {
      return (
        <View key={index} className={styles['renderItem']}>
          <Text className={styles['renderItem-label']}>{item.label}</Text>
          <Text className={styles['renderItem-text']}>{item.value}</Text>
        </View>
      )
    }
    return (
      <View key={index} className={styles['renderItem']}>
        <Text className={styles['renderItem-label']}>{item.label}</Text>
        <Input
          value={code}
          onChange={handleTextCode}
          placeholder={intl.formatMessage({
            id: 'user.logOff.confirm.placeholder',
            defaultMessage: '请输入',
          })}
          className={styles['renderItem-input']}
          placeholderClass={styles['renderItem-input-placeholder']}
        />
        <Text className={styles['renderItem-code-btn']} onClick={handleSend}>
          {canSend
            ? intl.formatMessage({
                id: 'user.logOff.confirm.code',
                defaultMessage: '获取验证码',
              })
            : intl.formatMessage({
                id: 'user.logOff.confirm.reGetCode',
                defaultMessage: `(${countdown}s)重新获取`,
                second: countdown,
              })}
        </Text>
      </View>
    )
  }
  return (
    <View className={styles['page']}>
      <Progress total={3} step={3} />
      <View
        style={{
          paddingLeft: pxTransform(8),
          paddingRight: pxTransform(8),
        }}
      >
        <View className={styles['page-title']}>
          {intl.formatMessage({
            id: 'user.logOff.confirm.title',
            defaultMessage: '确认账户信息',
          })}
        </View>
        <View className={styles['page-tips']}>
          {intl.formatMessage({
            id: 'user.logOff.confirm.tips',
            defaultMessage: '账号注销后将无法恢复，请慎重注销',
          })}
        </View>
      </View>
      <ScrollView
        className={styles['page-scrollView']}
        data={data}
        renderItem={({ item, index }) => _renderItem(item, index)}
      ></ScrollView>
      <View
        className={styles['page-bottom']}
        style={{
          paddingBottom: pxTransform(safeBottomHeight + 8),
        }}
      >
        <Button
          className={cx(styles['page-bottom-item'], styles['page-bottom-item-pre'])}
          type="secondary"
          onClick={handlePre}
        >
          {intl.formatMessage({
            id: 'user.logOff.confirm.pre',
            defaultMessage: '上一步',
          })}
        </Button>
        <Button className={styles['page-bottom-item']} disabled={confirmDisable} type="primary" onClick={handleConfirm}>
          {intl.formatMessage({
            id: 'user.logOff.confirm.next',
            defaultMessage: '确认注销',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(LogOffConfirm)
