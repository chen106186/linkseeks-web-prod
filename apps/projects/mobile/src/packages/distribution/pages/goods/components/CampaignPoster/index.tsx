/**
 * @Description 活动头部海报
 */
import React from 'react'
import { View } from '@apps/mobile-ui'
import { useIntl } from '@linkseeks/i18n'
import Descriptions from '@/components/Descriptions'
import './index.scss'

interface CampaignPosterProps {
  /**
   * 标题
   */
  title: string
  /**
   * 开始时间
   */
  startDate: string
  /**
   * 结束时间
   */
  endDate: string
}

const CampaignPoster: React.FC<CampaignPosterProps> = (props: CampaignPosterProps) => {
  const { title, startDate, endDate } = props

  const intl = useIntl()

  return (
    <View className="campaign-poster">
      <Descriptions column={1}>
        <Descriptions.Item
          label={intl.formatMessage({ id: 'commodityMerge.salesCampaignList.activities', defaultMessage: '限时促销' })}
          customLabelClassName="campaign-poster-title"
          customContentClassName="campaign-poster-title"
        >
          {title}
        </Descriptions.Item>
      </Descriptions>
      <View className="campaign-poster-date">
        {intl.formatMessage({ id: 'commodityMerge.salesCampaignList.time', defaultMessage: '活动时间' })}：
        {`${startDate} - ${endDate}`}
      </View>
    </View>
  )
}

export default CampaignPoster
