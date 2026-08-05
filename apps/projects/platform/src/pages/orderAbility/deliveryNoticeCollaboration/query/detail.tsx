/**
 * 订单能力 - 送货通知单管理 - 送货通知单详情
 * @author: Gavin
 * @description:
 */
import React, { useState, useEffect } from 'react'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import {
  DeliveryNoticeDetaitlsAnchors,
  B2BDeliveryNoticeDetaitlsAnchors,
  Circulation,
  BaseInfo as base_info,
  ShippingInfo,
  DeliveryGood,
  Material,
  ExternalRoamRecord,
  Purchaser,
  SubmitDeliveryNotice,
  Supplier,
  ConfirmDeliveryNotice,
  NoticeNo,
  SupplyMember,
  NoticeSummary,
  ExternalState,
  DeliveryDate,
  ReceivingAddress,
  DeliveryTime,
} from '../../constants'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import { Steps, Table, Tag } from 'antd'
import {
  DeliveryMaterialsTableColumn,
  DeliveryGoodsTableColumn,
  ExternalRoamRecordTableColumn,
} from '../../constants/page-table-column'
import {
  getOrderDeliveryNoticeOrderDeliveryHistory,
  getOrderDeliveryNoticeOrderDetail,
  getOrderDeliveryNoticeOrderDetailPage,
} from '@apps/apis'
import StandardTable from '@/components/StandardTable'
import { STATUS_NAME, TAG_STATUS_COLOR, ORDER_TYPE } from '../../constants/deliveryNotice'
import CirculationRecords from '@/components/CirculationRecords'
import { FormatFullAddress } from '../../assets/handles/HandleFormSubmit'

const getConst = (type, len?: number) => {
  let Delivery: any = {}
  let Column: any = []
  let Anchors: AnchorsItem[] = []
  switch (type) {
    case ORDER_TYPE.B2B:
      ;(Delivery = DeliveryGood), (Column = DeliveryGoodsTableColumn)
      Anchors = [...B2BDeliveryNoticeDetaitlsAnchors, { ...DeliveryGood, name: `送货商品${!!len ? `(${len})` : ''}` }]
      break
    case ORDER_TYPE.SRM:
      ;(Delivery = Material), (Column = DeliveryMaterialsTableColumn)
      Anchors = [...DeliveryNoticeDetaitlsAnchors, { ...DeliveryGood, name: `送货物料${!!len ? `(${len})` : ''}` }]
      break
  }
  return {
    Delivery,
    Column,
    Anchors,
  }
}

const DeliveryNoticeCollaborationDetails: React.FC = () => {
  const { id } = useQuery()

  const [details, setDetails] = useState<any>({})
  const [deliveryLen, setDeliveryLen] = useState<number>(0)

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
          setDeliveryLen(data.data?.length || 0)
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
      anchors={getConst(details.type, deliveryLen).Anchors}
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
          <Steps.Step title={Supplier} description={SubmitDeliveryNotice} />
          <Steps.Step title={Purchaser} description={ConfirmDeliveryNotice} />
        </Steps>
      </BaseInfo>
      <BaseInfo className="mt-16" title={base_info.name} id={base_info.key}>
        <BaseInfo.BaseInfoItem label={NoticeNo}>{details.noticeNo}</BaseInfo.BaseInfoItem>
        <BaseInfo.BaseInfoItem label={SupplyMember}>{details.vendorMemberName}</BaseInfo.BaseInfoItem>
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
      <BaseInfo
        className="mt-16"
        title={getConst(details.type).Delivery?.name}
        id={getConst(details.type).Delivery?.key}
        cols={1}
      >
        {/*  SRM 物料列表(DeliveryMaterialsTableColumn), B2B商品列表(DeliveryGoodsTableColumn)  */}
        <StandardTable
          columns={getConst(details.type).Column}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(getOrderDeliveryNoticeOrderDetailPage, { ...params, orderId: id })}
          controlRender={<div></div>}
        />
      </BaseInfo>
    </AnchorPage>
  )
}

export default DeliveryNoticeCollaborationDetails
