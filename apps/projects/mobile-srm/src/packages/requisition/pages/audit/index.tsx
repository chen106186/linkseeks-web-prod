import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { View, Text, Toast, TextArea } from '@apps/mobile-ui'
import { getCurrentInstance, setNavigationBarTitle, showToast } from '@apps/mobile-services/utils/taro'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import FullScreenLoading from '@/components/Loading/fullscreenLoading'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import { useSafeArea } from '@apps/mobile-services'
import Router from '@/utils/router'
import { limitByte } from '@/utils'
import {
  postPurchaseRequisitionSrmCancel,
  postPurchaseRequisitionSrmFirstAudit,
  postPurchaseRequisitionSrmPause,
  postPurchaseRequisitionSrmTwoAudit,
} from '@apps/apis'
import { OPREATION_MAP } from '../constants'
import styles from './index.module.scss'

const Audit: React.FC = () => {
  const intl = useIntl()
  const params = getCurrentInstance().preloadData || {}
  const { id, title, operation, reasonPlacehoder, agree, refresh, value = '' } = params // 详情数据
  const { safeBottomHeight } = useSafeArea()
  const [reason, setReason] = useState<string>(value)

  useEffect(() => {
    if (title) {
      setNavigationBarTitle({ title })
    } else {
      setNavigationBarTitle({ title: '确认审核不通过' })
    }
  }, [title])

  const _disbale = useMemo(() => {
    if (agree === undefined || agree === 0) {
      return reason.length <= 0
    } else {
      return false
    }
  }, [reason, agree])

  const _func = useMemo(() => {
    switch (operation) {
      case OPREATION_MAP.pause:
        return postPurchaseRequisitionSrmPause
      case OPREATION_MAP.cancel:
        return postPurchaseRequisitionSrmCancel
      case OPREATION_MAP.audit1:
        return postPurchaseRequisitionSrmFirstAudit
      default:
        return postPurchaseRequisitionSrmTwoAudit
    }
  }, [operation])

  const handleTextInputChange = (text: string) => {
    setReason(text)
  }

  /** 审核提交 */
  const handleSubmit = () => {
    const param: any = {
      id,
      reason,
    }
    if (agree !== undefined) param.agree = agree

    const message = limitByte(reason, { maxByte: 120 })
    if (message) {
      showToast({ title: message, icon: 'none' })
      return
    }
    if (_disbale) {
      Toast.show({ title: '请输入原因', icon: 'none' })
      return
    }
    FullScreenLoading.show()
    _func(param)
      .then((res) => {
        // if (res.code !== 1000) {
        //   FullScreenLoading.hide();
        //   Toast.show(intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message}));
        //   return
        // }
        // Router.navigateBack({
        //   delta: 2,
        //   success: () => {
        //     refresh()
        //   }
        // })
        if (res.code == 1000) {
          Router.navigateBack({
            delta: 2,
            success: () => {
              refresh()
            },
          })
        }
      })
      .finally(() => {
        FullScreenLoading.hide()
      })
  }

  return (
    <View className={styles['auditLayout']}>
      <PageLayout
        style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}
        renderHeader={
          <>
            <NavBar title={title || '确认审核不通过'} />
          </>
        }
      >
        <FullScreenLoading />
        <View className={styles['auditLayout-inputBox']}>
          <TextArea
            maxLength={60}
            count={false}
            height="100%"
            placeholder={reasonPlacehoder}
            value={reason}
            onChange={handleTextInputChange}
          />
        </View>
        <View className={styles['auditLayout-btnBox']}>
          <View className={styles['auditLayout-touchableOpacity']} onClick={() => handleSubmit()}>
            <View className={cx(styles['auditLayout-primaryBtn'], _disbale ? styles['auditLayout__disableBtn'] : '')}>
              <Text
                className={cx(styles['auditLayout-primaryText'], _disbale ? styles['auditLayout__disbaleText'] : '')}
              >
                {intl.formatMessage({ id: 'inquiry.queren', defaultMessage: '确认' })}
              </Text>
            </View>
          </View>
        </View>
      </PageLayout>
    </View>
  )
}

export default Audit
