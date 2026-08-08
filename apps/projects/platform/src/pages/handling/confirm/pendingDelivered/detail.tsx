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
  postEnhanceProcessToBeConfirmReceiptConfirmReceipt,
  postEnhanceProcessToBeDeliveryConfirmDelivery,
  postEnhanceProcessToBeDeliveryManualDeliver,
  postEnhanceSupplierToBeReceiveConfirmReceive,
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
import DeliveryHandle, { SubmitDataTypes } from './components/DeliveryHandle'
import useViewProcessInfo from '../../common/hooks/useViewProcessInfo'
import { isManualDelivery } from '@/constants/handling'
import moment from 'moment'
import { getLogisticsSelectListCompany, getLogisticsShipperAddressPage } from '@apps/apis'
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
  const [addressList, setAddressList] = useState([])
  const [companyList, setCompanyList] = useState([])

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

  const handleSubmit = async (value: SubmitDataTypes) => {
    const addressTarget = addressList.filter((_row) => _row.value === value.address)[0]
    const { data, code } = await postEnhanceProcessToBeDeliveryManualDeliver({
      produceNoticeOrderId: +id,
      manualDeliver: {
        deliveryAddress: addressTarget.address,
        deliveryTime: moment(value.deliveryTime, 'YYYY-MM-DD').valueOf(),
        deliveryNo: value.deliveryNo,
        logisticsName: value.company + '',
      },
    })
    if (code === 1000) {
      history.back()
    }
  }

  useEffect(() => {
    if (initialValue?.outerTaskType !== isManualDelivery) {
      return
    }
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
  }, [initialValue])

  useEffect(() => {
    if (initialValue?.outerTaskType !== isManualDelivery) {
      return
    }
    async function getCompany() {
      const { data, code } = await getLogisticsSelectListCompany({ cooperateType: '2' })
      if (code !== 1000) {
        return
      }
      const companyData = data.map((_row) => ({
        label: _row.name,
        value: _row.name,
      }))
      setCompanyList(companyData)
    }
    getCompany()
  }, [initialValue])

  const handleOnConfirm = async (
    currentInnerStatus: any,
    params: { produceNoticeOrderId: number; pnoReceiveDeliverDetailId: number },
  ) => {
    const SERVICE_MAP = {
      '1_1_1': postEnhanceProcessToBeDeliveryConfirmDelivery,
      '2_1_1': postEnhanceSupplierToBeReceiveConfirmReceive,
      '2_2_1': postEnhanceProcessToBeConfirmReceiptConfirmReceipt,
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

  const cacheStyle = useMemo(() => ({ margin: `${theme['@margin-md']} 0` }), [])
  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'handling.no' })}:${initialValue?.noticeNo}`}
        items={anchorColumn}
        extra={
          (initialValue?.outerTaskType === isManualDelivery && (
            <Button onClick={() => examToggle(true)} type="primary">
              {intl.formatMessage({ id: 'handling.shougongfahuo' })}
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
            mode="deliver"
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
      <DeliveryHandle
        visible={examVisible}
        title={intl.formatMessage({ id: 'handling.shougongfahuo' })}
        onSubmit={handleSubmit}
        onCancel={() => examToggle(false)}
        addressOptions={addressList}
        companyOptions={companyList}
      />
    </Spin>
  )
}

export default Info
