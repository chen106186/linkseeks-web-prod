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
  getEnhanceSupplierToBeAddDetails,
  GetEnhanceSupplierToBeAddDetailsResponse,
  postEnhanceSupplierToBeAddSubmitExam,
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
import { useIntl } from '@linkseeks/i18n'

const Info = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const { visible, toggle } = useModal()
  const anchorColumn = useGetAnchorHeader({ blackList: [] })
  const { loading, initialValue } = useInitialValue<GetEnhanceSupplierToBeAddDetailsResponse, { id: string }>(
    getEnhanceSupplierToBeAddDetails,
    { id: id.toString() },
  )
  const { basicInfoColumn, payInfoColumns, cacheOtherInfo, annexInfo, progressInfo } =
    useBasicInfoColumnInDetail<GetEnhanceSupplierToBeAddDetailsResponse>({ initialValue })
  const defaultColumns = initialValue?.source === 1 ? orderColumns : productColumn
  const outerWorkflowRecordsList = initialValue?.outerWorkflowRecordsList || []
  const innerWorkflowRecordsList = initialValue?.innerWorkflowRecordsList || []
  const [processDataProps, setProcessDataProps] = useState<DataPropsType>({} as any)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const { columns } = useColumnWithFilter(defaultColumns, [
    {
      title: intl.formatMessage({ id: 'handling.caozuo' }),
      render: (text, record) => {
        return (
          <a onClick={() => handleViewDetail(record)}>{intl.formatMessage({ id: 'handling.view.process.detail' })}</a>
        )
      },
    },
  ])

  const handleViewDetail = (record: GetEnhanceSupplierToBeAddDetailsResponse['details'][0]) => {
    const dataProps = {
      productId: record.productId,
      name: record.productName,
      category: record.category,
      brand: record.brand,
      unitName: record.unit,
      processUnitPrice: record.processPrice,
      quantity: record.processNum,
      isHasTax: (record as any).isHasTax,
      taxRate: (record as any).taxRate,
      productProps: (record.property as any).specs,
      files: (record.property as any).annex,
    }
    toggle(true)
    setProcessDataProps(dataProps)
  }

  const handleSubmit = async () => {
    setSubmitLoading(true)
    const { data, code } = await postEnhanceSupplierToBeAddSubmitExam({ id: +id })
    setSubmitLoading(false)
    if (code === 1000) {
      history.back()
    }
  }

  const cacheStyle = useMemo(() => ({ margin: `${theme['@margin-md']} 0` }), [])
  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({ id: 'handling.no' })}: ${initialValue?.noticeNo}`}
        items={anchorColumn}
        extra={
          <Button loading={submitLoading} onClick={handleSubmit} type="primary">
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
    </Spin>
  )
}

export default Info
