import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Tabs, TabsPane } from '@apps/mobile-ui'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import StepLayout from './stepLayout'
import TimeLineLayout from './timeLineLayout'
import './index.scss'

type StateResponses = {
  /** 选中 */
  isExecute?: number
  /** 状态 */
  roleName?: string
  /** 备注 */
  operationalProcess?: string
}

type LogResponses = {
  /** 状态 */
  operation?: string
  /** 时间 */
  operationTime?: number
  /** 操作人员 */
  roleName?: string
  /** 备注 */
  auditOpinion?: any
}

interface RouterParmas {
  /** 外部流转进度 */
  externalInquiryListStateResponses?: StateResponses[]
  /** 外部流转记录 */
  externalInquiryListLogResponses?: LogResponses[]
  /** 内部流转进度 */
  interiorRequisitionFormStateResponses?: StateResponses[]
  /** 内部流转记录 */
  interiorInquiryListLogResponses?: LogResponses[]
}

const StatusLayout: React.FC<RouterParmas> = () => {
  const intl = useIntl()
  setNavigationBarTitle({
    title: intl.formatMessage({ id: 'inquiryQuotation.waibuzhuangtai', defaultMessage: '审核状态' }),
  })
  const params = getCurrentInstance().preloadData?.params as RouterParmas
  const { safeBottomHeight } = useSafeArea()
  const [current, setCurrent] = useState<number>(0)

  const TAB_LIST = [
    { title: intl.formatMessage({ id: 'inquiryQuotation.waibuzhuangtai', defaultMessage: '外部状态' }) },
    { title: intl.formatMessage({ id: 'inquiryQuotation.neibuzhuangtai', defaultMessage: '内部状态' }) },
  ]

  const handleTabChange = (e: number) => {
    setCurrent(e)
  }

  return (
    <View className="statusLayout" style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <Tabs current={current} tabList={TAB_LIST} onClick={handleTabChange} height="100%">
        <TabsPane current={current} index={0}>
          <View className="statusLayout-scrollView">
            <StepLayout dataSource={params.externalInquiryListStateResponses} />
            <TimeLineLayout dataSource={params.externalInquiryListLogResponses} />
          </View>
        </TabsPane>
        <TabsPane current={current} index={1}>
          <View className="statusLayout-scrollView">
            <StepLayout dataSource={params.interiorRequisitionFormStateResponses} />
            <TimeLineLayout dataSource={params.interiorInquiryListLogResponses} />
          </View>
        </TabsPane>
      </Tabs>
    </View>
  )
}
export default StatusLayout
