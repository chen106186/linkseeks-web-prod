import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Icons, View, Text } from '@apps/mobile-ui'
import Shuttle from '@/components/Shuttle'
import { HistoricalAnalysisPopupProps } from '../HistoricalAnalysisPopup'
import './index.scss'

interface HistoricalAnalysisBarProps extends Omit<HistoricalAnalysisPopupProps, 'visible' | 'onClose'> {
  /**
   * 点击跳转触发事件
   */
  onJump?: () => void
}

const HistoricalAnalysisBar: React.FC<HistoricalAnalysisBarProps> = (props: HistoricalAnalysisBarProps) => {
  const { onJump } = props

  const intl = useIntl()

  const handleClick = () => {
    onJump?.()
  }

  return (
    <>
      <View className="historical-bar">
        <Text className="historical-bar-title">
          {intl.formatMessage({
            id: 'commodityMerge.stocksSourcing.components.historicalAnalysisBar.title',
            defaultMessage: '爆料时近期好价',
          })}
        </Text>
        <View className="historical-bar-extra">
          <Icons name="Activity" size={12} color="#F25767" className="historical-bar-icon" />
          <Shuttle
            describe={intl.formatMessage({
              id: 'commodityMerge.stocksSourcing.components.historicalAnalysisBar.check',
              defaultMessage: '查看价格走势',
            })}
            onJump={handleClick}
          />
        </View>
      </View>
    </>
  )
}

export default HistoricalAnalysisBar
