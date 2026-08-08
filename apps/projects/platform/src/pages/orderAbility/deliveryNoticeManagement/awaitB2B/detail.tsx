/**
 * 订单能力 - 送货通知单管理 - 送货通知单详情
 * @author: Gavin
 * @description:
 */
import React, { useEffect, useState } from 'react'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import {
  Circulation,
  B2BDeliveryNoticeDetaitlsAnchors,
  DeliveryGood,
  Purchaser,
  Supplier,
  BaseInfo as base_Info,
  NoticeNo,
  BuyerLabel,
  NoticeSummary,
  ExternalState,
  ShippingInfo,
  DeliveryDate,
  DeliveryTime,
  ReceivingAddress,
  DeliveryList,
  ExternalRoamRecord,
  SubmitDeliveryNotice,
  ConfirmDeliveryNotice,
} from '../../constants'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import StandardTable from '@/components/StandardTable'
import { Steps, Table, Tag } from 'antd'
import { DeliveryGoodsTableColumn, ExternalRoamRecordTableColumn } from '../../constants/page-table-column'
import {
  getOrderDeliveryNoticeOrderDetail,
  getOrderDeliveryNoticeOrderDetailPage,
  getOrderDeliveryNoticeOrderDeliveryHistory,
} from '@apps/apis'
import { STATUS_NAME, TAG_STATUS_COLOR } from '../../constants/deliveryNotice'
import CirculationRecords from '@/components/CirculationRecords'
import { FormatFullAddress } from '../../assets/handles/HandleFormSubmit'

const getAnchors = (len = 0) => {
  return [
    ...B2BDeliveryNoticeDetaitlsAnchors,
    { ...DeliveryGood, name: `${DeliveryGood.name}${!!len ? `(${len})` : ''}` },
  ]
}

const DeliveryNoticeManagementAwaitB2BDetails: React.FC = () => {
  const { id } = useQuery()

  const [details, setDetails] = useState<any>({})
  const [len, setLen] = useState<number>(0)

  const getDetail = async () => {
    const { code, data } = await getOrderDeliveryNoticeOrderDetail({ id: id as string })
    if (code === 1000) {
      setDetails(data || {})
    }
  }

  const fetchData = (api: Function, params: any) => {
    return new Promise((resolve) => {
      api({ ...params, orderId: id }).then(({ code, data }) => {
        if (code === 1000) {
          setLen(data.data?.length || 0)
          resolve(data)
        }
      })
    })
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [])

  return (
    <AnchorPage
      title={`${details?.digest || ''} | ${details?.noticeNo || ''}`}
      onBack={() => history.goBack()}
      anchors={getAnchors(len)}
    >
      <BaseInfo
        className="mt-0"
        title={Circulation.name}
        id={Circulation.key}
        cols={1}
        subtitle={
          <CirculationRecords
            fetchApi={getOrderDeliveryNoticeOrderDeliveryHistory}
            params={{ id: id as string }}
            columns={ExternalRoamRecordTableColumn}
          />
        }
      >
        <Steps progressDot current={details?.outerStatus - 1}>
          <Steps.Step title={SubmitDeliveryNotice} description={Supplier} />
          <Steps.Step title={ConfirmDeliveryNotice} description={Purchaser} />
        </Steps>
      </BaseInfo>
      <BaseInfo className="mt-16" title={base_Info.name} id={base_Info.key}>
        <BaseInfo.BaseInfoItem label={NoticeNo}>{details.noticeNo}</BaseInfo.BaseInfoItem>
        <BaseInfo.BaseInfoItem label={BuyerLabel}>{details.buyerMemberName}</BaseInfo.BaseInfoItem>
        <BaseInfo.BaseInfoItem label={NoticeSummary}>{details.digest}</BaseInfo.BaseInfoItem>
        <BaseInfo.BaseInfoItem label={ExternalState}>
          <Tag color={TAG_STATUS_COLOR[details.status]?.color}>
            <span style={{ color: TAG_STATUS_COLOR[details.status]?.fontColor }}>{STATUS_NAME[details.status]}</span>
          </Tag>
        </BaseInfo.BaseInfoItem>
      </BaseInfo>
      <BaseInfo className="mt-16" title={ShippingInfo.name} id={ShippingInfo.key}>
        <BaseInfo.BaseInfoItem label={DeliveryDate}>{details.deliveryTime}</BaseInfo.BaseInfoItem>
        <BaseInfo.BaseInfoItem label={ReceivingAddress}>
          <div>
            {details.consignee}/{details.phone}
          </div>
          <div>
            {FormatFullAddress(details)}
            {details.address}
          </div>
        </BaseInfo.BaseInfoItem>
        <BaseInfo.BaseInfoItem label={DeliveryTime}>
          {details.deliveryStartTime} 至 {details.deliveryEndTime}
        </BaseInfo.BaseInfoItem>
      </BaseInfo>
      <BaseInfo className="mt-16" title={DeliveryGood.name} id={DeliveryGood.key} cols={1}>
        {/*  SRM 物料列表(DeliveryMaterialsTableColumn), B2B商品列表(DeliveryGoodsTableColumn)  */}
        <StandardTable
          columns={DeliveryGoodsTableColumn}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(getOrderDeliveryNoticeOrderDetailPage, { ...params, orderId: id })}
          controlRender={<div></div>}
        />
      </BaseInfo>
    </AnchorPage>
  )
}

export default DeliveryNoticeManagementAwaitB2BDetails
