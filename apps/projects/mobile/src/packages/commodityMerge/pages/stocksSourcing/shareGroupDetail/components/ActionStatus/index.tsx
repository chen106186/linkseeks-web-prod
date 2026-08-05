import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Icons, View, Text, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { THEME_COLORS } from '@/constants/theme'
import './index.scss'

interface Iprops {
  mode: 'processing' | 'success' | 'fail'
}

const failImage = getOssUrlPath('/Images/fail.png')

const ActionStatus: React.FC<Iprops> = (props: Iprops) => {
  const { mode } = props
  const intl = useIntl()
  const STATUS_TEXT = {
    success: intl.formatMessage({ id: 'shareGroupDetail.success', defaultMessage: '拼团成功' }),
    fail: intl.formatMessage({ id: 'shareGroupDetail.fail', defaultMessage: '拼团失败' }),
  }

  const STATUS_TIPS = {
    success: intl.formatMessage({ id: 'shareGroupDetail.sendGoods', defaultMessage: '等待商家发货' }),
    fail: intl.formatMessage({
      id: 'shareGroupDetail.refund',
      defaultMessage: '若已付全款则系统将自动退款，其他情况可申请售后',
    }),
  }

  if (mode === 'processing') {
    return null
  }

  return (
    <View className="action-status">
      <View className="action-status-section">
        {(mode === 'fail' && <Image src={failImage} className="action-status-fail-icon" />) || (
          <View className="action-status-icon">
            <Icons name="Right" color={THEME_COLORS.primary} size={16} />
          </View>
        )}
        <Text>{STATUS_TEXT[mode]}</Text>
      </View>
      <Text className="action-status-tips">{STATUS_TIPS[mode]}</Text>
    </View>
  )
}

export default ActionStatus
