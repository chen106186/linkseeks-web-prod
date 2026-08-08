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
import { Steps, Table, Tag, Button, Space } from 'antd'
import {
  DeliveryMaterialsTableColumn,
  DeliveryGoodsTableColumn,
  ExternalRoamRecordTableColumn,
} from '../../constants/page-table-column'
import {
  getOrderDeliveryNoticeOrderDeliveryHistory,
  getOrderDeliveryNoticeOrderDetail,
  getOrderDeliveryNoticeOrderDetailPage,
  postOrderDeliveryNoticeOrderConfirm,
} from '@apps/apis'
import StandardTable from '@/components/StandardTable'
import CustomizedModal from '../../components/customizedModal'
import { STATUS_NAME, STATUS, ORDER_TYPE, TAG_STATUS_COLOR } from '../../constants/deliveryNotice'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import { ReceiverAddress, FormatValue } from '@/components/AddressDrawer'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import CirculationRecords from '@/components/CirculationRecords'
import { FormatFullAddress } from '../../assets/handles/HandleFormSubmit'

enum PAGE_TYPE {
  CONFIRM = 'CONFIRM',
}

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

const DeliveryNoticeAwaitDetails: React.FC = () => {
  const { id, type } = useQuery()

  const [details, setDetails] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [deliveryLen, setDeliveryLen] = useState<number>(0)
  const [address, setAddress] = useState<any>({})

  const getDetail = async () => {
    const { code, data } = await getOrderDeliveryNoticeOrderDetail({ id: id as string })
    if (code === 1000) {
      setDetails(data || {})
      setAddress({
        consignee: data?.consignee,
        consigneeId: data?.consigneeId,
        provinceName: data?.provinceName,
        cityName: data?.cityName,
        districtName: data?.districtName,
        streetName: data?.streetName,
        address: data?.address,
        phone: data?.phone,
      })
    }
  }

  const fetchData = (api: Function, params: any) => {
    return new Promise((resolve) => {
      api({ ...params, orderId: id }).then(({ code, data }) => {
        if (code === 1000) {
          setModalVisible(false)
          setDeliveryLen(data.data?.length || 0)
          resolve(data)
        }
      })
    })
  }

  const modalSubmit = (values) => {
    const addressValue = values.isPass === 1 ? address : {}
    const params = {
      ...addressValue,
      id: Number(id),
      isPass: values.isPass === 1,
      remark: values.reason,
    }
    setLoading(true)
    postOrderDeliveryNoticeOrderConfirm(params)
      .then(({ code }) => {
        if (code === 1000) {
          history.goBack()
        }
      })
      .finally(() => {
        setLoading(false)
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
      extra={
        type === PAGE_TYPE.CONFIRM &&
        details.status === STATUS.WAIT_CONFIRM && (
          <Button icon={<CheckCircleOutlined />} onClick={() => setModalVisible(true)} type="primary">
            单据审核
          </Button>
        )
      }
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
          <Space size={12} style={{ width: '100%', justifyContent: 'space-between' }}>
            <div>
              {address.consignee}/{address.phone}
            </div>
            {type === PAGE_TYPE.CONFIRM && details.status === STATUS.WAIT_CONFIRM && (
              <ReceiverAddress
                renderText={'修改'}
                onChange={(e) => {
                  setAddress({ ...e, consignee: e.receiverName, consigneeId: e.id })
                }}
              />
            )}
          </Space>
          <div>
            {FormatFullAddress(details)}
            {address.address}
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
      <CustomizedModal
        title="确认送货通知单"
        visible={modalVisible}
        defaultRadioValue={1}
        radioGroup={[
          { label: '确认', value: 1, isReason: false },
          { label: '不确认', value: 2, isReason: true },
        ]}
        onSubmit={(values) => modalSubmit(values)}
        onCancel={(visible: boolean) => setModalVisible(visible)}
        loading={loading}
      />
    </AnchorPage>
  )
}

export default DeliveryNoticeAwaitDetails
