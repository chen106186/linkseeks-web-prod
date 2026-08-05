import React, { useEffect, useMemo, useState } from 'react'
import { Spin, Card, Table, Button, Drawer } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../../common/hooks/useGetAnchorHeader'
import useInitialValue from '@/hooks/useInitialValue'
import { useBasicInfoColumnInDetail } from '../../common/hooks/useCommonsInDetail'
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
import ExamVerify, { SubmitDataTypes } from '@/components/ExamVerify'
// import StopModal, { SubmitDataTypes } from './components/StopModal';
import useViewProcessInfo from '../../common/hooks/useViewProcessInfo'
import { filterExternalState } from '@/pages/transaction/common/statusList'
import {
  getEnhanceProcessToBeSubmitExamDetails,
  GetEnhanceSupplierToBeAddDetailsResponse,
  postEnhanceProcessToBeSubmitExamExam,
} from '@apps/apis'
import { getLogisticsShipperAddressPage } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const Info = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { visible, toggle, handleViewDetail, processDataProps } = useViewProcessInfo()

  const { visible: examVisible, toggle: examToggle } = useModal()
  const anchorColumn = useGetAnchorHeader({ blackList: [] })
  const { loading, initialValue } = useInitialValue<GetEnhanceSupplierToBeAddDetailsResponse, { id: string }>(
    getEnhanceProcessToBeSubmitExamDetails,
    { id: id.toString() },
  )
  const { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo, progressInfo } = useBasicInfoColumnInDetail({
    initialValue,
  })
  const defaultColumns = initialValue?.source === 1 ? orderColumns : productColumn
  const outerWorkflowRecordsList = initialValue?.outerWorkflowRecordsList || []
  const innerWorkflowRecordsList = initialValue?.innerWorkflowRecordsList || []
  const [addressList, setAddressList] = useState([])
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

  useEffect(() => {
    /**
     * 物流时，填写发货地址
     * 自提时， 填写发货地址 -> 自提地址
     */
    async function getAddress() {
      const { data, code } = await getLogisticsShipperAddressPage({ current: '1', pageSize: '20' })
      const addressData = data.data.map((_row) => ({
        label: `${_row.fullAddress}/${_row.shipperName}/${_row.phone}`,
        value: _row.id.toString(),
        name: _row.shipperName,
        address: _row.fullAddress,
        phone: _row.phone,
        id: _row.id,
      }))
      setAddressList(addressData)
    }
    getAddress()
  }, [])

  const handleSubmit = async (value: SubmitDataTypes) => {
    const target = addressList.filter((_item) => _item.value === value.address)[0]
    const { data, code } = await postEnhanceProcessToBeSubmitExamExam({
      id: +id,
      status: value.status,
      cause: value.reason,
      deliveryMessage: {
        deliveryAddressId: target.id,
        deliveryAddress: target.address,
        deliveryUserName: target.name,
        deliveryUserTel: target.phone,
      },
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
          <Button onClick={() => examToggle(true)} type="primary">
            {intl.formatMessage({ id: 'handling.submit' })}
          </Button>
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
      <ExamVerify
        visible={examVisible}
        title={intl.formatMessage({ id: 'handling.toExamine.doc' })}
        onSubmit={handleSubmit}
        onCancel={() => examToggle(false)}
        withAddress
        addressOptions={addressList}
        addressTitle={
          initialValue?.deliveryType === 1
            ? intl.formatMessage({ id: 'handling.detail.deliveryAddress' })
            : intl.formatMessage({ id: 'handling.detail.selfAddress' })
        }
      />
    </Spin>
  )
}

export default Info
