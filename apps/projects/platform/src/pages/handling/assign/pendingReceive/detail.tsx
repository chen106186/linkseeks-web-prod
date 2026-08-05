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
  getEnhanceProcessToBeDeliveryDetails,
  GetEnhanceProcessToBeDeliveryDetailsResponse,
  postEnhanceSupplierToBeReceiveConfirmReceive,
  postEnhanceSupplierToBeReceiveManualReceive,
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
// import StopModal, { SubmitDataTypes } from './components/StopModal';
// import DeliveryHandle, { SubmitDataTypes } from './components/DeliveryHandle';
import useViewProcessInfo from '../../common/hooks/useViewProcessInfo'
import { isManualDelivery } from '@/constants/handling'
import moment from 'moment'
import ConfirmReceive from './components/ConfirmReceive'
import { useIntl } from '@linkseeks/i18n'

const Info = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { visible, toggle, handleViewDetail, processDataProps } = useViewProcessInfo()
  const { visible: examVisible, toggle: examToggle } = useModal()
  const anchorColumn = useGetAnchorHeader({ blackList: [] })
  const { loading, initialValue, refresh } = useInitialValue<
    GetEnhanceProcessToBeDeliveryDetailsResponse,
    { id: string }
  >(getEnhanceProcessToBeDeliveryDetails, { id: id.toString() })
  const { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo, progressInfo } = useBasicInfoColumnInDetail({
    initialValue,
  })
  const defaultColumns = initialValue?.source === 1 ? orderColumns : productColumn
  const outerWorkflowRecordsList = initialValue?.outerWorkflowRecordsList || []
  const innerWorkflowRecordsList = initialValue?.innerWorkflowRecordsList || []
  const [manualLoading, setManualLoading] = useState<boolean>(false)
  const manualDataProps = useMemo(() => {
    return {
      address: initialValue?.manualDeliver?.deliveryAddress,
      deliveryTime: moment(initialValue?.manualDeliver?.deliveryTime).format('YYYY-MM-DD'),
      logisticsNo: initialValue?.manualDeliver?.deliveryNo,
      company: initialValue?.manualDeliver?.logisticsName,
    }
  }, [initialValue])

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

  const handleOnConfirm = async (
    currentInnerStatus: '2_1_1',
    params: { produceNoticeOrderId: number; pnoReceiveDeliverDetailId: number },
  ) => {
    const SERVICE_MAP = {
      '2_1_1': postEnhanceSupplierToBeReceiveConfirmReceive,
    }
    if (!SERVICE_MAP[currentInnerStatus]) {
      return
    }
    // setLoading(true)
    const { code, data } = await SERVICE_MAP[currentInnerStatus](params)
    // setLoading(false)
    if (code === 1000) {
      refresh({ id: id })
    }
  }

  const handleOnReceive = async () => {
    setManualLoading(true)
    const { data, code } = await postEnhanceSupplierToBeReceiveManualReceive({ id: +id })
    setManualLoading(false)
    if (code === 1000) {
      refresh({ id: id })
    }
  }

  const cacheStyle = useMemo(() => ({ margin: `${theme['@margin-md']} 0` }), [])
  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'handling.no' })}:${initialValue?.noticeNo}`}
        items={anchorColumn}
        extra={
          (initialValue?.outerTaskType === isManualDelivery && (
            <Button loading={manualLoading} onClick={() => examToggle(true)} type="primary">
              {intl.formatMessage({ id: 'handling.querenshougongfahuo' })}
            </Button>
          )) ||
          null
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
            onConfirm={handleOnConfirm}
            mode="receive"
            panelKey="info"
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
      <ConfirmReceive
        dataSource={manualDataProps}
        visible={examVisible}
        onClose={() => examToggle(false)}
        onConfirm={handleOnReceive}
      />
    </Spin>
  )
}

export default Info
