import React, { useMemo } from 'react'
import { Spin, Space, Table } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import theme from '@apps/config/lingxi.theme.config'
import useGetAnchorHeader from '../common/hooks/useGetAnchorHeader'
import useInitialValue from '../common/hooks/useInitialValue'
import { useBasicInfoColumnInDetail } from '../common/hooks/useCommonsInDetail'
import { usePageStatus } from '@/hooks/usePageStatus'
import { findLastIndexFlowState } from '@/utils'
import useColumnWithFilter from '../common/hooks/useColumnWithFilter'
import { columns as orderColumns, productColumn } from '../common/columns/detailNoticeInfoColumns'
import MellowCard from '@/components/MellowCard'
import FlowRecords from '@/components/FlowRecords'
import { outerWorkflowRecordsColumn } from '../common/columns/recordFlowColumns'
import MachiningDetail from '../components/MachiningDetail'
import DeliveryInfo from '../components/DeliveryInfo'
import useViewProcessInfo from '../common/hooks/useViewProcessInfo'
import type { GetEnhancePlatformAllDetailsResponse } from '@apps/apis'
import { getEnhancePlatformAllDetails } from '@apps/apis'

const Info = () => {
  const { id } = usePageStatus()
  const { visible, toggle, handleViewDetail, processDataProps } = useViewProcessInfo()

  const anchorColumn = useGetAnchorHeader({ blackList: [] })
  const { loading, initialValue } = useInitialValue<GetEnhancePlatformAllDetailsResponse, { id: string }>(
    getEnhancePlatformAllDetails,
    { id: id.toString() },
  )
  const { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo } = useBasicInfoColumnInDetail({ initialValue })
  const defaultColumns = initialValue?.source === 1 ? orderColumns : productColumn
  const outerWorkflowRecordsList = initialValue?.outerWorkflowRecordsList || []
  // const innerWorkflowRecordsList = initialValue?.innerWorkflowRecordsList || []
  const { columns } = useColumnWithFilter(defaultColumns, [
    {
      title: '操作',
      render: (text, record) => {
        return <a onClick={() => handleViewDetail(record)}>查看加工明细</a>
      },
    },
  ])

  const cacheStyle = useMemo(() => ({ margin: `${theme['@margin-md']} 0`, width: '100%' }), [])
  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper title={initialValue?.processName} items={anchorColumn}>
        {/* 通知单明细 */}
        <Space direction="vertical">
          <AuditProcess
            outerVerifySteps={
              initialValue && initialValue.outerTaskList
                ? initialValue.outerTaskList.map((item) => ({
                    step: item.step,
                    stepName: item.taskName,
                    roleName: item.roleName,
                    status: item.isExecute ? 'finish' : 'wait',
                  }))
                : []
            }
            outerVerifyCurrent={findLastIndexFlowState(initialValue?.outerTaskList)}
            id="progress"
          />
          <CustomizeColumn data={basicInfoColumn} title="基本信息" column={3} id="basicInfo" />
          <div id="noticeDetails">
            <MellowCard title="通知单明细">
              <Table rowKey={'id'} dataSource={initialValue?.details!} columns={columns} />
            </MellowCard>
          </div>
          <div style={cacheStyle} id="deliveryDetail">
            <DeliveryInfo
              source={initialValue?.source as 1 | 2}
              statisticsDataSource={initialValue?.details}
              infoDataSource={initialValue?.pnoReceiveDeliverDetailDOList}
            />
          </div>
          <div style={cacheStyle}>
            <CustomizeColumn id="payInfo" data={payInfoColumns as any[]} title="交付信息" column={3} />
          </div>
          <div style={cacheStyle}>
            <CustomizeColumn id="otherRequire" data={cacheOtherInfo} title="其他要求" column={3} />
          </div>
          <div style={cacheStyle}>
            <CustomizeColumn id="annex" data={annexInfo} title="附件" column={3} />
          </div>
          <div id="record">
            <FlowRecords
              outerRowkey="id"
              outerColumns={outerWorkflowRecordsColumn}
              outerDataSource={outerWorkflowRecordsList}
              // innerRowkey="id"
              // innerColumns={innerFlowColumns}
              // innerDataSource={innerWorkflowRecordsList}
            />
          </div>
        </Space>
      </PageHeaderWrapper>
      <MachiningDetail visible={visible} dataProps={processDataProps} onClose={() => toggle(false)} />
    </Spin>
  )
}

export default Info
