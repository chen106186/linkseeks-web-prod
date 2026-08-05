/**
 * 订单能力 - 送货单 - 送货单管理详情SRM
 * @author: Gavin
 * @description: 与B2B内容大致相同，文件分开方便后续对接以及日后变动修改二开
 */
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import React, { useEffect, useState } from 'react'
import {
  BillsInfo,
  BuyerLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryAddrLabel,
  DeliveryDate,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryNoLabel,
  DeliveryPhoneLabel,
  DeliverySlefAddrLabel,
  DeliveryTime,
  Distribution,
  ExternalRoamRecord,
  LogisticsInfo,
  Material,
  NoteLabel,
  OutStatusLabel,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Table } from 'antd'
import { DeliveryNoticeTableColumnSRM, ExternalRoamRecordTableColumn } from '../../constants/page-table-column'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import usePageTitle from '../../assets/hooks/usePageTitle'
import {
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
} from '../../constants/table-column'
import LogisticsInfoBox from '../../components/LogisticsInfo'

const ContentBoxItem = ContentBox.BaseInfoItem

const DeliveryNoticeManageSRMDetails: React.FC = () => {
  const intl = useIntl()
  /*批次类型*/
  // 1-合格 2-部分合格 3-让步接收 4-拒收
  const batchJudgmentType = {
    '1': intl.formatMessage({ id: 'eightD.hege', defaultMessage: '合格' }),
    '2': intl.formatMessage({ id: 'eightD.rangbujieshou', defaultMessage: '部分合格' }),
    '3': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '让步接收' }),
    '4': intl.formatMessage({ id: 'eightD.jushou', defaultMessage: '拒收' }),
  }
  const query = useQuery()
  const { title, setDeliveryTitle } = usePageTitle()

  const service = NoteFactoryService.getInstance()

  const [anchors, setAnchors] = useState<AnchorsItem[]>([BillsInfo, Distribution, DeliveryInfo, LogisticsInfo])

  const [info, setInfo] = useState<any>()

  const [tableDataSource, setTableDataSource] = useState([])
  const [totalCount, setTotalCount] = useState(1)
  const [outerHistoryList, setOuterHistoryList] = useState([])
  const [newDeliveryNoticeTableColumnSRM, setNewDeliveryNoticeTableColumnSRM] = useState(DeliveryNoticeTableColumnSRM)
  const [outerStatus, setOuterStatus] = useState()

  const setDeliveryNoticeTableColumnSRM = () => {
    const newColumnSRM = DeliveryNoticeTableColumnSRM.filter((item) => item.key != 'receiveCount').filter(
      (_item) => _item.key !== 'leftCount',
    )
    setNewDeliveryNoticeTableColumnSRM(newColumnSRM)
  }
  useEffect(() => {
    service.getDetailInfoById(query.id as string).then((infoData) => {
      setInfo(infoData)
      setDeliveryTitle(infoData)
      setOuterStatus(infoData.outerStatus)
      service.getDetailInfoProductById(query.id as string).then((res) => {
        setTableDataSource(res.data)
        setAnchors([
          ...anchors,
          {
            ...Material,
            name: `${Material.name}(${res.data.length})`,
          },
          {
            ...ExternalRoamRecord,
            name: `${ExternalRoamRecord.name}(${infoData?.outerHistoryList?.length})`,
          },
        ])
        setTotalCount(res.totalCount)
      })
    })
    setDeliveryNoticeTableColumnSRM()
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

        <ContentBoxItem label={BuyerLabel}>{info?.buyerMemberName}</ContentBoxItem>

        <ContentBoxItem label={DeliveryAbstractLabel}>{info?.digest}</ContentBoxItem>

        <ContentBoxItem label={NoteLabel}>{info?.remark}</ContentBoxItem>

        <ContentBoxItem label={OutStatusLabel}>{info?.outerStatusName}</ContentBoxItem>
      </ContentBox>

      <ContentBox title={Distribution.name} id={Distribution.key}>
        <ContentBoxItem label={DeliveryDate}>{info?.deliveryTime}</ContentBoxItem>

        <ContentBoxItem label={DeliveryNameLabel}>{info?.executorVO?.consignee ?? '暂无信息'}</ContentBoxItem>

        <ContentBoxItem label={DeliveryTime}>
          {info?.deliveryStartTime}至{info?.deliveryEndTime}
        </ContentBoxItem>

        <ContentBoxItem label={DeliveryPhoneLabel}>{info?.executorVO?.phone ?? '暂无信息'}</ContentBoxItem>
      </ContentBox>

      <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key}>
        <ContentBoxItem label={ConsigneeTimeLabel}>{info?.sendTime}</ContentBoxItem>

        <ContentBoxItem label={DeliveryAddrLabel}>
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

        <ContentBoxItem label={DeliverySlefAddrLabel}>
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
      </ContentBox>

      <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key}>
        <LogisticsInfoBox info={info} />
      </ContentBox>

      <ContentBox title={Material.name} id={Material.key} cols={1}>
        <Table
          columns={[
            ...newDeliveryNoticeTableColumnSRM,
            {
              title: '收货数量',
              dataIndex: 'receiveCount',
              key: 'receiveCount',
              render: (t, rcode) => {
                return outerStatus == 2 ? rcode.deliveryCount : rcode.receiveCount
              },
            },
            {
              ...BatchJudgmentTypeColumn,
              render: (t, rcode) => {
                return rcode.batchJudgmentType ? batchJudgmentType[rcode.batchJudgmentType] : null
              },
            },
            {
              ...AcceptanceCountColumn,
              render: (t, rcode) => {
                return rcode.acceptanceCount
              },
            },
            {
              ...ConcessionToReceiveCountColumn,
              render: (t, rcode) => {
                return rcode.concessionToReceiveCount
              },
            },
            {
              ...RejectCountColumn,
              render: (t, rcode) => {
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

      <ContentBox title={ExternalRoamRecord.name} key={ExternalRoamRecord.key} cols={1}>
        <Table columns={ExternalRoamRecordTableColumn} rowKey="id" dataSource={outerHistoryList} />
      </ContentBox>
    </AnchorPage>
  )
}

export default DeliveryNoticeManageSRMDetails
