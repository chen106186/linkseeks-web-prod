import React, { useEffect, useMemo, useState } from 'react'
import { Spin, Card, Table, Button, Drawer } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../../common/hooks/useGetAnchorHeader'
import useInitialValue from '@/hooks/useInitialValue'
import { useBasicInfoColumnInDetail } from '../../common/hooks/useCommonsInDetail'
import {
  getEnhancePlatformAllDetails,
  GetEnhanceSupplierToBeAddDetailsResponse,
  postEnhanceProcessAllDiscontinue,
} from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { findLastIndexFlowState } from '@/utils'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import { columns as orderColumns, productColumn } from '../../common/columns/detailNoticeInfoColumns'
import MellowCard from '@/components/MellowCard'
import DeliveryInfo from '../../components/DeliveryInfo'
import FlowRecords from '@/components/FlowRecords'
import { innerFlowColumns, outerWorkflowRecordsColumn } from '../../common/columns/recordFlowColumns'
import MachiningDetail, { DataPropsType } from '../../components/MachiningDetail'
import useModal from '@/pages/customerAbility/memberEvaluate/hooks/useModal'
// import ExamVerify, { SubmitDataTypes } from '@/components/ExamVerify';
import StopModal, { SubmitDataTypes } from './components/StopModal'
import useViewProcessInfo from '../../common/hooks/useViewProcessInfo'
import moment from 'moment'
import { useIntl } from '@linkseeks/i18n'

const inRangeStatus = [3, 4, 5, 6, 7, 8]

const Info = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { visible, toggle, handleViewDetail, processDataProps } = useViewProcessInfo()

  const { visible: examVisible, toggle: examToggle } = useModal()
  const anchorColumn = useGetAnchorHeader({ blackList: [] })
  const { loading, initialValue } = useInitialValue<GetEnhanceSupplierToBeAddDetailsResponse, { id: string }>(
    getEnhancePlatformAllDetails,
    { id: id.toString() },
  )
  const { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo, progressInfo } = useBasicInfoColumnInDetail({
    initialValue,
  })
  const defaultColumns = initialValue?.source === 1 ? orderColumns : productColumn
  const outerWorkflowRecordsList = initialValue?.outerWorkflowRecordsList || []
  const innerWorkflowRecordsList = initialValue?.innerWorkflowRecordsList || []
  const { columns } = useColumnWithFilter(defaultColumns, [
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      render: (text, record) => {
        return (
          <a onClick={() => handleViewDetail(record)}>{intl.formatMessage({ id: 'handling.view.process.detail' })}</a>
        )
      },
    },
  ])

  const onExamVerifySubmit = async (value: SubmitDataTypes) => {
    const { code, data } = await postEnhanceProcessAllDiscontinue({
      id: +id,
      discontinueTime: moment().valueOf(),
      cause: value.reason,
    })
    if (code === 1000) {
      history.back()
    }
  }

  const cacheStyle = useMemo(() => ({ margin: `${theme['@margin-md']} 0` }), [])
  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'handling.no' })}:${initialValue?.noticeNo}`}
        items={anchorColumn}
        extra={
          inRangeStatus.includes(initialValue?.outerStatus) && (
            <Button onClick={() => examToggle(true)} type="primary">
              {intl.formatMessage({ id: 'handling.zhongzhishengchantongzhidan' })}
            </Button>
          )
        }
      >
        <AuditProcess {...progressInfo} id="progress" />
        <div style={cacheStyle} id="basicInfo">
          <CustomizeColumn
            data={basicInfoColumn}
            title={intl.formatMessage({ id: 'handling.assign.add.basicInfo' })}
            column={3}
          />
        </div>
        {/* {intl.formatMessage({id: 'handling.detail.noticeDetail'})} */}
        <div style={cacheStyle} id="noticeDetails">
          <MellowCard title={intl.formatMessage({ id: 'handling.detail.noticeDetail' })}>
            <Table rowKey={'id'} dataSource={initialValue?.details} columns={columns} />
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
          <CustomizeColumn
            id="payInfo"
            data={payInfoColumns}
            title={intl.formatMessage({ id: 'handling.detail.payInfo' })}
            column={3}
          />
        </div>
        <div style={cacheStyle}>
          <CustomizeColumn
            id="otherRequire"
            data={cacheOtherInfo}
            title={intl.formatMessage({ id: 'handling.detail.otherRequire' })}
            column={3}
          />
        </div>
        <div style={cacheStyle}>
          <CustomizeColumn
            id="annex"
            data={annexInfo}
            title={intl.formatMessage({ id: 'handling.assign.add.files' })}
            column={3}
          />
        </div>
        <div id="record">
          <FlowRecords
            outerRowkey="id"
            innerRowkey="id"
            outerColumns={outerWorkflowRecordsColumn}
            innerColumns={innerFlowColumns}
            outerDataSource={outerWorkflowRecordsList}
            innerDataSource={innerWorkflowRecordsList}
          />
        </div>
      </PageHeaderWrapper>
      <MachiningDetail visible={visible} dataProps={processDataProps} onClose={() => toggle(false)} />
      <StopModal
        visible={examVisible}
        title={intl.formatMessage({ id: 'handling.zhongzhiyuanyin' })}
        onSubmit={onExamVerifySubmit}
        onCancel={() => examToggle(false)}
      />
    </Spin>
  )
}

export default Info
