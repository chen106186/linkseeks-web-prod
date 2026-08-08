import React, { useState } from 'react'
import { View } from '@apps/mobile-ui'
import { getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import { useSafeArea } from '@apps/mobile-services'
import StepLayout from './stepLayout'
import TimeLineLayout from './timeLineLayout'
import styles from './index.module.scss'

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
  createTime?: number
  /** 操作人员 */
  roleName?: string
  /** 备注 */
  remark?: any
}

interface RouterParmas {
  /** 内部流转进度 */
  interiorRequisitionFormStateResponses?: StateResponses[]
  /** 内部流转记录 */
  interiorInquiryListLogResponses?: LogResponses[]
}

const StatusLayout: React.FC<RouterParmas> = () => {
  setNavigationBarTitle({ title: '审批状态(内部)' })
  const params = getCurrentInstance().preloadData as RouterParmas
  const { safeBottomHeight } = useSafeArea()

  return (
    <View className={styles['statusLayout']} style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <View className={styles['statusLayout-scrollView']}>
        <StepLayout dataSource={params.interiorRequisitionFormStateResponses} />
        <TimeLineLayout dataSource={params.interiorInquiryListLogResponses} />
      </View>
    </View>
  )
}
export default StatusLayout
