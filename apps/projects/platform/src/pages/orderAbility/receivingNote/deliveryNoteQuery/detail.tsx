/**
 * 订单能力 - 收货单 - 送货单详情
 * @author: Gavin
 * @description:
 */
import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { BaseInfo as ListInfo } from '@/components/BaseInfo'
import {
  BillsInfo,
  DeliveryInfo,
  DeliveryNoteQuery,
  LogisticsInfo,
  Material,
  Distribution,
  BaseInfo,
  ExternalRoamRecord,
  DeliveryMaterial,
  DeliverytGood,
} from '../../constants'
import { Table, Tag } from 'antd'
import ReceiveNoteFacotry from '../../assets/handles/ReceiveNotePage'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import {
  DeliveryNoticeTableColumn,
  DeliveryNoticeTableColumnSRM,
  ExternalRoamRecordTableColumn,
} from '../../constants/page-table-column'
import {
  DeliveryNumColumn,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
} from '../../constants/table-column'
import usePageTitle from '../../assets/hooks/usePageTitle'
import LogisticsInfoBox from '../../components/LogisticsInfo'

const service = ReceiveNoteFacotry.getInstance('Query')

const ListInfoItem = ListInfo.BaseInfoItem

const DeliveryNoteDetails: React.FC = () => {
  const intl = getIntl()

  const [anchors, setAnchors] = useState(DeliveryNoteQuery)
  const [info, setInfo] = useState<any>({})
  const [tableDataSource, setTableDataSource] = useState<any>([])
  const { id } = useQuery()

  const [outerHistoryList, setOuterHistoryList] = useState([])
  const { title, setDeliveryTitle } = usePageTitle()

  const statusTxt = new Map([
    [1, '已提交'],
    [2, '已确认收货'],
    [3, '已作废'],
  ])
  const [outerStatus, setOuterStatus] = useState()
  const [newDeliveryNoticeTableColumnSRM, setnewDeliveryNoticeTableColumnSRM] = useState(DeliveryNoticeTableColumnSRM)
  /*批次类型*/
  // 1-合格 2-部分合格 3-让步接收 4-拒收
  const batchJudgmentType = {
    '1': intl.formatMessage({ id: 'eightD.hege', defaultMessage: '合格' }),
    '2': intl.formatMessage({ id: 'eightD.rangbujieshou', defaultMessage: '部分合格' }),
    '3': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '让步接收' }),
    '4': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '拒收' }),
  }
  const setNewDeliveryNoticeTableColumnSRM = () => {
    const newSRMColum = newDeliveryNoticeTableColumnSRM.slice(0, -2)
    setnewDeliveryNoticeTableColumnSRM(newSRMColum)
  }
  useEffect(() => {
    Promise.all([service.getDetailById(id), service.getDetailProduct({ id, current: '1' })]).then((values) => {
      setDeliveryTitle(values[0])
      setInfo(values[0])
      setOuterStatus(values[0].outerStatus)
      setTableDataSource(values[1].data)
      setOuterHistoryList(values[0]?.outerHistoryList)

      setAnchors([
        ...anchors,
        {
          ...{
            name: `${values[0]?.type == 1 ? DeliverytGood.name : DeliveryMaterial.name}(${values[1].totalCount})`,
            key: DeliveryMaterial.key,
          },
        },
        {
          ...ExternalRoamRecord,
          ...{
            name: `${ExternalRoamRecord.name}(${values[0].outerHistoryList.length})`,
          },
        },
      ])

      setOuterHistoryList(values[0].outerHistoryList)
    })
    setNewDeliveryNoticeTableColumnSRM()
  }, [])

  return (
    <PageHeaderWrapper title={title} items={anchors}>
      <ListInfo className="mt-15" title={BillsInfo.name} id={BillsInfo.key} style={{ lineHeight: 3 }}>
        <ListInfoItem label="送货单编号">{info?.deliveryNo}</ListInfoItem>

        <ListInfoItem label="供应会员">{info?.vendorMemberName}</ListInfoItem>

        <ListInfoItem label="送货单摘要">{info?.digest}</ListInfoItem>

        <ListInfoItem label="备注">{info?.remark}</ListInfoItem>

        <ListInfoItem label="外部状态">
          {/* <Tag color="green">已提交</Tag> */}
          <Tag color="green">{info?.outerStatusName}</Tag>
        </ListInfoItem>
      </ListInfo>

      <ListInfo className="mt-15" title={Distribution.name} id={Distribution.key} style={{ lineHeight: 3 }}>
        <ListInfoItem label="送货日期">{info?.deliveryTime}</ListInfoItem>

        <ListInfoItem label="送货人">{info?.executorVO?.consignee}</ListInfoItem>

        <ListInfoItem label="送货时间">
          {info?.deliveryStartTime} 至 {info?.deliveryEndTime}
        </ListInfoItem>

        <ListInfoItem label="送货人电话">{info?.executorVO?.phone ?? '暂无信息'}</ListInfoItem>
      </ListInfo>

      <ListInfo className="mt-15" title={DeliveryInfo.name} id={DeliveryInfo.key} style={{ lineHeight: 3 }}>
        <ListInfoItem label="发货时间">{info?.sendTime}</ListInfoItem>

        <ListInfoItem label="收货地址">
          {info?.receiverBO?.provinceName}
          {info?.receiverBO?.cityName}
          {info?.receiverBO?.districtName}
          {info?.receiverBO?.streetName}
          {info?.receiverBO?.address ?? ''}
          {info?.receiverBO?.consignee} /{info?.receiverBO?.phone}
        </ListInfoItem>

        <ListInfoItem label="发货（自提）地址">
          {info?.deliverVO?.provinceName}
          {info?.deliverVO?.cityName}
          {info?.deliverVO?.districtName}
          {info?.deliverVO?.streetName ?? ''}
          {info?.deliverVO?.address}
          {info?.deliverVO?.consignee} /{info?.deliverVO?.phone}
        </ListInfoItem>
      </ListInfo>

      <ListInfo className="mt-15" title={LogisticsInfo.name} id={LogisticsInfo.key} style={{ lineHeight: 3 }}>
        <LogisticsInfoBox info={info} />
      </ListInfo>

      <ListInfo
        className="mt-15"
        title={info?.type == 1 ? DeliverytGood.name : DeliveryMaterial.name}
        id={info?.type ? DeliverytGood.key : DeliveryMaterial.key}
        cols={1}
      >
        <Table
          rowKey={(row) => row.orderNo}
          columns={[
            ...(info?.type == 1 ? DeliveryNoticeTableColumn : newDeliveryNoticeTableColumnSRM),
            {
              title: '送货数量',
              dataIndex: 'deliveryCount',
              key: 'deliveryCount',
            },
            {
              title: '收货数量',
              dataIndex: 'receiveCount',
              key: 'receiveCount',
              render: (t, rcode, index) => {
                return outerStatus == 2 ? rcode.deliveryCount : rcode.receiveCount
              },
            },
            {
              ...BatchJudgmentTypeColumn,
              render: (t, rcode, index) => {
                return rcode.batchJudgmentType ? batchJudgmentType[rcode.batchJudgmentType] : null
              },
            },
            {
              ...AcceptanceCountColumn,
              render: (t, rcode, index) => {
                return rcode.acceptanceCount
              },
            },
            {
              ...ConcessionToReceiveCountColumn,
              render: (t, rcode, index) => {
                return rcode.concessionToReceiveCount
              },
            },
            {
              ...RejectCountColumn,
              render: (t, rcode, index) => {
                return rcode.rejectCount
              },
            },
          ]}
          dataSource={tableDataSource}
        />
      </ListInfo>

      <ListInfo className="mt-15" title={ExternalRoamRecord.name} id={ExternalRoamRecord.key} cols={1}>
        <Table columns={[...ExternalRoamRecordTableColumn]} rowKey="id" dataSource={outerHistoryList} />
      </ListInfo>
    </PageHeaderWrapper>
  )
}

export default DeliveryNoteDetails
