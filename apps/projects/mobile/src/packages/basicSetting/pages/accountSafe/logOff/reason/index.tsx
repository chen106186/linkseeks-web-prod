import GlobalWrapper from '@/components/GlobalWrapper'
import React from 'react'
import cx from 'classnames'
import { pxTransform, useDidShow, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { View, Text, Icons, ScrollView, Modal, TextArea, Button } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import { useSafeArea } from '@apps/mobile-services'
import useLogOffReason from './services/hooks/useLogOffReason'
import Progress from '../components/progress'
import styles from './index.module.scss'
const LogOffReason: React.FC = () => {
  const intl = useIntl()
  const { safeBottomHeight } = useSafeArea()
  const { reason, handleTextInputChange, handlePre, handleNext } = useLogOffReason()
  return (
    <View className={styles['page']}>
      <Progress total={3} step={2} />
      <Text className={styles['page-title']}>
        {intl.formatMessage({
          id: 'user.logOff.reason.title',
          defaultMessage: '填写注销原因',
        })}
      </Text>
      <ScrollView className={styles['page-scrollView']}>
        <TextArea
          className={styles['page-textArea']}
          maxLength={60}
          placeholder={intl.formatMessage({
            id: 'user.logOff.reason.placeholder',
            defaultMessage: '请输入您注销账号的原因，最多可输入200字',
          })}
          value={reason}
          onChange={handleTextInputChange}
        />
      </ScrollView>
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
            id: 'user.logOff.reason.pre',
            defaultMessage: '上一步',
          })}
        </Button>
        <Button className={styles['page-bottom-item']} type="primary" onClick={handleNext}>
          {intl.formatMessage({
            id: 'user.logOff.reason.next',
            defaultMessage: '下一步',
          })}
        </Button>
      </View>
    </View>
  )
}
export default GlobalWrapper(LogOffReason)
