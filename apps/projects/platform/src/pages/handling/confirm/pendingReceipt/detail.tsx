import React, { useEffect, useMemo, useState } from 'react'
import { Spin, Card, Table, Button, Drawer, Space, Popconfirm } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import theme from '../../../../../config/lingxi.theme.config'
import useGetAnchorHeader from '../../common/hooks/useGetAnchorHeader'
import useInitialValue from '@/hooks/useInitialValue'
import { useBasicInfoColumnInDetail } from '../../common/hooks/useCommonsInDetail'
import { usePageStatus } from '@/hooks/usePageStatus'
import useColumnWithFilter from '../../common/hooks/useColumnWithFilter'
import { columns as orderColumns, productColumn } from '../../common/columns/detailNoticeInfoColumns'
import MellowCard from '@/components/MellowCard'
import DeliveryInfo from '../../components/DeliveryInfo'
import FlowRecords from '@/components/FlowRecords'
import { innerFlowColumns, outerWorkflowRecordsColumn } from '../../common/columns/recordFlowColumns'
import MachiningDetail, { DataPropsType } from '../../components/MachiningDetail'
import useViewProcessInfo from '../../common/hooks/useViewProcessInfo'
import {
  getEnhanceProcessToBeConfirmReceiptDetails,
  GetEnhanceProcessToBeDeliveryDetailsResponse,
  postEnhanceProcessToBeConfirmReceiptConfirmAllReceipt,
  postEnhanceProcessToBeConfirmReceiptConfirmReceipt,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const Info = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { visible, toggle, handleViewDetail, processDataProps } = useViewProcessInfo()
  const anchorColumn = useGetAnchorHeader({ blackList: [] })
  const { loading, initialValue, refresh } = useInitialValue<
    GetEnhanceProcessToBeDeliveryDetailsResponse,
    { id: string }
  >(getEnhanceProcessToBeConfirmReceiptDetails, { id: id.toString() })
  const { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo, progressInfo } = useBasicInfoColumnInDetail({
    initialValue,
  })
  const defaultColumns = initialValue?.source === 1 ? orderColumns : productColumn
  const outerWorkflowRecordsList = initialValue?.outerWorkflowRecordsList || []
  const innerWorkflowRecordsList = initialValue?.innerWorkflowRecordsList || []
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const confirmOrContinue = useMemo(() => {
    const pnoReceiveDeliverDetailDOList = initialValue?.pnoReceiveDeliverDetailDOList || []
    const isAllCompleted = pnoReceiveDeliverDetailDOList.every((_row) => _row.receiptStatus === 2)
    let flag = false
    if (isAllCompleted) {
      // 未发货大于0
      flag = pnoReceiveDeliverDetailDOList?.some((_item) =>
        _item.pnoReceiveDeliverDetailProductBOList?.some((_v) => {
          return _v.processNum - _v.deliverNum > 0
        }),
      )
    }
    return {
      complete: isAllCompleted,
      hasSomeNoDelivery: flag,
    }
  }, [initialValue])
  console.log(confirmOrContinue)

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

  const handleAllConfirmReceipt = async (flag: boolean) => {
    const postData = {
      produceNoticeOrderId: id,
      status: flag,
    }
    setSubmitLoading(true)
    const { data, code } = await postEnhanceProcessToBeConfirmReceiptConfirmAllReceipt(postData)
    setSubmitLoading(false)
    if (code === 1000) {
      refresh({ id: id })
    }
  }

  const handleOnConfirm = async (
    currentInnerStatus: '2_2_1',
    params: { produceNoticeOrderId: number; pnoReceiveDeliverDetailId: number },
  ) => {
    const SERVICE_MAP = {
      '2_2_1': postEnhanceProcessToBeConfirmReceiptConfirmReceipt,
    }
    if (!SERVICE_MAP[currentInnerStatus]) {
      return
    }
    const { code, data } = await SERVICE_MAP[currentInnerStatus](params)
    if (code === 1000) {
      refresh({ id: id })
    }
  }

  const renderExtra = () => {
    // 如果通知单收发货明细表内部状态不全部为已确认回单，那么两个按钮隐藏
    if (!confirmOrContinue.complete || initialValue?.outerStatus === 9) {
      return
    }
    return (
      <Space>
        {(confirmOrContinue.hasSomeNoDelivery && (
          <Popconfirm
            title={intl.formatMessage({ id: 'handling.ninhaiyouweifahuodeshang' })}
            onConfirm={() => handleAllConfirmReceipt(true)}
          >
            <Button type="primary">{intl.formatMessage({ id: 'handling.querenbendanquanbufahuo' })}</Button>
          </Popconfirm>
        )) || (
          <Button type="primary" onClick={() => handleAllConfirmReceipt(true)}>
            {intl.formatMessage({ id: 'handling.querenbendanquanbufahuo' })}
          </Button>
        )}
        {!confirmOrContinue.hasSomeNoDelivery && (
            <Popconfirm
              title={intl.formatMessage({ id: 'handling.ninshangpinduyifahuo' })}
              onConfirm={() => handleAllConfirmReceipt(false)}
            >
              <Button type="primary">{intl.formatMessage({ id: 'handling.jixufahuo' })}</Button>
            </Popconfirm>
          ) && (
            <Button type="primary" onClick={() => handleAllConfirmReceipt(false)}>
              {intl.formatMessage({ id: 'handling.jixufahuo' })}
            </Button>
          )}
      </Space>
    )
  }

  const cacheStyle = useMemo(() => ({ margin: `${theme['@margin-md']} 0` }), [])
  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'handling.no' })}:${initialValue?.noticeNo}`}
        items={anchorColumn}
        extra={<Space>{renderExtra()}</Space>}
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
            mode="receipt"
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
      {/* <DeliveryHandle
        visible={examVisible}
        title="手工发货"
        onSubmit={handleSubmit}
        onCancel={() => examToggle(false)}
        addressOptions={addressList}
        companyOptions={companyList}
      /> */}
    </Spin>
  )
}

export default Info
