/**
 * 订单能力 - 送货单 - 送货单管理详情SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import React, { useEffect, useState } from 'react'
import {
  BillsInfo,
  ConsigneeLabel,
  ConsigneePhoneLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryAddrLabel,
  DeliveryDate,
  DeliveryDateLabel,
  DeliveryGood,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryNoLabel,
  DeliveryPhoneLabel,
  DeliverySlefAddrLabel,
  DeliveryTime,
  DeliveryTimeLabel,
  DeliveryTypeLabel,
  Distribution,
  ExternalRoamRecord,
  LogisticsCarNoLabel,
  LogisticsCompanyLabel,
  LogisticsInfo,
  LogisticsNoLabel,
  NoteLabel,
  OutStatusLabel,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Table } from 'antd'
import { DeliveryNoticeTableColumn, ExternalRoamRecordTableColumn } from '../../constants/page-table-column'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import {
  DeliveryNumColumn,
  ConsigneeNumColumn,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
} from '../../constants/table-column'
import usePageTitle from '../../assets/hooks/usePageTitle'
import LogisticsInfoBox from '../../components/LogisticsInfo'

const ContentBoxItem = ContentBox.BaseInfoItem

const DeliveryNoticeManageSRMDetails: React.FC = () => {
  const intl = getIntl()
  /*批次类型*/
  // 1-合格 2-部分合格 3-让步接收 4-拒收
  const batchJudgmentType = {
    '1': intl.formatMessage({ id: 'eightD.hege', defaultMessage: '合格' }),
    '2': intl.formatMessage({ id: 'eightD.rangbujieshou', defaultMessage: '部分合格' }),
    '3': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '让步接收' }),
    '4': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '拒收' }),
  }
  const query = useQuery()

  const service = NoteFactoryService.getInstance('b2b')

  const [anchors, setAnchors] = useState<AnchorsItem[]>([
    BillsInfo,
    Distribution,
    DeliveryInfo,
    LogisticsInfo,
    DeliveryGood,
    ExternalRoamRecord,
  ])

  const [info, setInfo] = useState<any>()

  const [tableDataSource, setTableDataSource] = useState([])
  const [totalCount, setTotalCount] = useState(1)
  const [outerHistoryList, setOuterHistoryList] = useState([])

  const { title, setDeliveryTitle } = usePageTitle()

  const [outerStatus, setOuterStatus] = useState()

  useEffect(() => {
    service.getDetailInfoById(query.id as string).then((res) => {
      setInfo(res)
      setDeliveryTitle(res)
      setOuterStatus(res.outerStatus)
    })

    service.getDetailInfoProductById(query.id as string).then((res) => {
      setTableDataSource(res.data)
      setTotalCount(res.totalCount)
    })
  }, [])

  /**
   * 如果info 更新 outerHistoryList也一起更新
   */
  useEffect(() => {
    setOuterHistoryList(info?.outerHistoryList)
  }, [info])

  return (
    <AnchorPage title={title} anchors={anchors}>
      <ContentBox title={BillsInfo.name} id={BillsInfo.key}>
        <ContentBoxItem label={DeliveryNoLabel}>{info?.deliveryNo}</ContentBoxItem>

        <ContentBoxItem label={DeliveryAbstractLabel}>{info?.digest}</ContentBoxItem>

        <ContentBoxItem label={NoteLabel}>{info?.remark}</ContentBoxItem>

        <ContentBoxItem label={OutStatusLabel}>{info?.outerStatusName}</ContentBoxItem>
      </ContentBox>

      <ContentBox title={Distribution.name} id={Distribution.key}>
        <ContentBoxItem label={DeliveryDate}>{info?.deliveryTime}</ContentBoxItem>

        <ContentBoxItem label={DeliveryNameLabel}>{info?.executorVO?.consignee}</ContentBoxItem>

        <ContentBoxItem label={DeliveryTime}>
          {info?.deliveryStartTime}至{info?.deliveryEndTime}
        </ContentBoxItem>

        <ContentBoxItem label={DeliveryPhoneLabel}>{info?.executorVO?.phone}</ContentBoxItem>
      </ContentBox>

      <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
        <ContentBoxItem label={ConsigneeTimeLabel}>{info?.sendTime}</ContentBoxItem>

        <ContentBoxItem label={DeliveryAddrLabel}>
          <div>
            {info?.deliverVO?.provinceName ?? ''}
            {info?.deliverVO?.cityName ?? ''}
            {info?.deliverVO?.districtName ?? ''}
            {info?.deliverVO?.streetName ?? ''}
            {info?.deliverVO?.address ?? ''}
          </div>
          <div>
            {info?.deliverVO.phone}
            {info?.deliverVO.consignee}
          </div>
        </ContentBoxItem>

        <ContentBoxItem label={DeliverySlefAddrLabel}>
          <div>
            {info?.receiverBO?.provinceName ?? ''}
            {info?.receiverBO?.cityName ?? ''}
            {info?.receiverBO?.districtName ?? ''}
            {info?.receiverBO?.streetName ?? ''}
            {info?.receiverBO?.address ?? ''}
          </div>
          <div>
            {info?.receiverBO?.phone}
            {info?.receiverBO?.consignee}
          </div>
        </ContentBoxItem>
      </ContentBox>

      <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
        <LogisticsInfoBox info={info} />
      </ContentBox>

      <ContentBox title={DeliveryGood.name} id={DeliveryGood.key} cols={1}>
        <Table
          columns={[
            ...DeliveryNoticeTableColumn,
            {
              ...DeliveryNumColumn,
              dataIndex: 'deliveryCount',
              render: (t, rcode, index) => {
                return t
              },
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
          rowKey="id"
          dataSource={tableDataSource}
          pagination={{
            total: totalCount,
          }}
        />
      </ContentBox>

      <ContentBox title={ExternalRoamRecord.name} id={ExternalRoamRecord.key} cols={1}>
        <Table columns={[...ExternalRoamRecordTableColumn]} rowKey="id" dataSource={outerHistoryList} />
      </ContentBox>
    </AnchorPage>
  )
}

export default DeliveryNoticeManageSRMDetails
