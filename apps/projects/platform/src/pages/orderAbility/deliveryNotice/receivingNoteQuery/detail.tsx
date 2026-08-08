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
  ConsigneeLabel,
  ConsigneeTimeLabel,
  DeliveryAbstractLabel,
  DeliveryAddrLabel,
  DeliveryDateLabel,
  DeliveryGood,
  DeliveryInfo,
  DeliveryNameLabel,
  DeliveryNoLabel,
  DeliveryPhoneLabel,
  DeliverySlefAddrLabel,
  DeliveryTimeLabel,
  DeliveryTypeLabel,
  Distribution,
  ExternalRoamRecord,
  Harvest,
  HarvestMaterial,
  LogisticsCarNoLabel,
  LogisticsCompanyLabel,
  LogisticsInfo,
  LogisticsNoLabel,
  Material,
  NoteLabel,
  OutStatusLabel,
  ReceiptAbstractLabel,
  ReceivingAddress,
  ReceivingTime,
  ReNoLabel,
} from '../../constants'
import { BaseInfo as ContentBox } from '@/components/BaseInfo'
import { Table } from 'antd'
import {
  DeliveryNoticeTableDetailColumn,
  DeliveryNoticeTableDetailColumnSRM,
  ExternalRoamRecordTableColumn,
  DeliveryNoticeTableColumnSRM,
} from '../../constants/page-table-column'
import {
  DeliveryNumColumn,
  BatchJudgmentTypeColumn,
  AcceptanceCountColumn,
  ConcessionToReceiveCountColumn,
  RejectCountColumn,
} from '../../constants/table-column'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import usePageTitle from '../../assets/hooks/usePageTitle'
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

  const service = NoteFactoryService.getInstance('receive')

  const [anchors, setAnchors] = useState<AnchorsItem[]>([
    BillsInfo,
    Harvest,
    DeliveryInfo,
    LogisticsInfo,

    // ExternalRoamRecord
  ])

  const [info, setInfo] = useState<any>({})

  const [tableDataSource, setTableDataSource] = useState([])
  const [totalCount, setTotalCount] = useState(1)
  const [outerHistoryList, setOuterHistoryList] = useState([])

  const { title, setReceiveTitle } = usePageTitle()

  useEffect(() => {
    service.getDetailInfoById(query.id as string).then((res) => {
      setInfo(res)
    })

    service.getDetailInfoProductById(query.id as string).then((res) => {
      setTableDataSource(res?.data)

      setAnchors([
        ...anchors,
        info?.type === 1
          ? {
              ...DeliveryGood,
              ...{
                name: `${DeliveryGood.name}(${res?.data?.length})`,
              },
            }
          : {
              ...HarvestMaterial,
              ...{
                name: `${HarvestMaterial.name}(${res?.data?.length})`,
              },
            },
      ])

      setTotalCount(res?.totalCount)
    })
  }, [])

  /**
   * 如果info 更新 outerHistoryList也一起更新
   */
  useEffect(() => {
    setOuterHistoryList(info?.outerHistoryList)
    setReceiveTitle(info)
  }, [info])

  return (
    <AnchorPage title={title} anchors={anchors}>
      <ContentBox title={BillsInfo.name} id={BillsInfo.key} style={{ lineHeight: 3 }}>
        <ContentBoxItem label={ReNoLabel}>{info?.receiveNo}</ContentBoxItem>

        <ContentBoxItem label={BuyerLabel}>{info?.buyerMemberName}</ContentBoxItem>

        <ContentBoxItem label={ReceiptAbstractLabel}>{info?.digest}</ContentBoxItem>

        <ContentBoxItem label={NoteLabel}>{info?.remark}</ContentBoxItem>

        <ContentBoxItem label={OutStatusLabel}>{info?.outerStatusName}</ContentBoxItem>
      </ContentBox>

      <ContentBox title={Harvest.name} id={Harvest.key} style={{ lineHeight: 3 }}>
        <div>
          <ContentBoxItem label={ReceivingTime}>{info?.receiveTime}</ContentBoxItem>

          <ContentBoxItem label={ConsigneeLabel}>{info?.receiveVO?.consignee}</ContentBoxItem>

          <ContentBoxItem label={DeliveryPhoneLabel}>{info?.receiveVO?.phone}</ContentBoxItem>
        </div>

        <div>
          <ContentBoxItem label={ReceivingAddress}>
            <div>
              {info?.receiveVO?.provinceName}
              {info?.receiveVO?.cityName}
              {info?.receiveVO?.districtName}
              {info?.receiveVO?.streetName}
              {info?.receiveVO?.address}
            </div>
            <div>
              {info?.receiveVO?.phone}
              {info?.receiveVO?.consignee}
            </div>
          </ContentBoxItem>
        </div>
      </ContentBox>

      <ContentBox title={DeliveryInfo.name} id={DeliveryInfo.key} style={{ lineHeight: 3 }}>
        <div>
          <ContentBoxItem label={DeliveryNoLabel}>{info?.deliveryNo}</ContentBoxItem>

          <ContentBoxItem label={ConsigneeTimeLabel}>{info?.sendTime}</ContentBoxItem>
        </div>

        <div>
          <ContentBoxItem label={DeliverySlefAddrLabel}>
            <div>
              {info?.deliverVO?.provinceName}
              {info?.deliverVO?.cityName}
              {info?.deliverVO?.districtName}
              {info?.deliverVO?.streetName}
              {info?.deliverVO?.address}
            </div>
            <div>
              {info?.deliverVO?.phone}
              {info?.deliverVO?.consignee}
            </div>
          </ContentBoxItem>
        </div>
      </ContentBox>

      <ContentBox title={LogisticsInfo.name} id={LogisticsInfo.key} style={{ lineHeight: 3 }}>
        <LogisticsInfoBox info={info} receive={true} />
      </ContentBox>

      <ContentBox
        title={info?.type === 1 ? DeliveryGood.name : HarvestMaterial.name}
        id={info?.type === 1 ? DeliveryGood.key : HarvestMaterial.key}
        cols={1}
      >
        {/* <Table
          columns={
            info?.type == 1 ? DeliveryNoticeTableDetailColumn : DeliveryNoticeTableDetailColumnSRM
          }
          rowKey="id"
          dataSource={tableDataSource}
          pagination={{
            total: totalCount
          }}
        /> */}
        <Table
          columns={[
            ...DeliveryNoticeTableColumnSRM,
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
        <Table columns={ExternalRoamRecordTableColumn} rowKey="id" dataSource={outerHistoryList} />
      </ContentBox>
    </AnchorPage>
  )
}

export default DeliveryNoticeManageSRMDetails
