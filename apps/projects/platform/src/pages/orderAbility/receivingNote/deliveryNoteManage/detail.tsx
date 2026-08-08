/**
 * 订单能力 - 收货单 - 收货单管理详情
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
  Distribution,
  ExternalRoamRecord,
  Harvest,
  HarvestGood,
  HarvestMaterial,
  LogisticsInfo,
  Material,
} from '../../constants'
import { Space, Spin, Table, Tag } from 'antd'
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

const ListInfoItem = ListInfo.BaseInfoItem
const service = ReceiveNoteFacotry.getInstance()

const DeliveryNoteManageDetails: React.FC = () => {
  const intl = getIntl()

  const [anchors, setAnchors] = useState(DeliveryNoteQuery)

  const [info, setInfo] = useState<any>({})
  const [tableDataSource, setTableDataSource] = useState([])
  const { id } = useQuery()
  const [loading, setLoading] = useState(true)

  const [outerHistoryList, setOuterHistoryList] = useState([])
  const { title, setReceiveTitle } = usePageTitle()
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
    Promise.all([service.getDetailById(id), service.getDetailProduct({ id, current: 1 })]).then((values) => {
      setInfo(values[0])
      setReceiveTitle(values[0])

      setOuterHistoryList(values[0].outerHistoryList)
      setTableDataSource(values[1].data)
      setLoading(false)

      setAnchors([
        ...anchors,
        {
          ...HarvestMaterial,
          ...{
            name: `${values[0]?.type == 1 ? HarvestGood.name : HarvestMaterial.name}(${values[1].totalCount})`,
          },
        },
        {
          ...ExternalRoamRecord,
          ...{
            name: `${ExternalRoamRecord.name}(${values[0].outerHistoryList.length})`,
          },
        },
      ])
    })
    setNewDeliveryNoticeTableColumnSRM()
  }, [])

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper title={title} items={anchors}>
        <ListInfo className="mt-15" title={BillsInfo.name} id={BillsInfo.key}>
          <ListInfoItem className="mt-16" label="收货单编号">
            {info?.receiveNo}
          </ListInfoItem>

          <ListInfoItem label="供应会员">{info?.vendorMemberName}</ListInfoItem>

          <ListInfoItem label="收货单摘要">{info?.digest}</ListInfoItem>

          <ListInfoItem label="备注">{info?.remark}</ListInfoItem>

          <ListInfoItem label="外部状态">
            <Tag color="green">{info?.outerStatusName}</Tag>
          </ListInfoItem>
        </ListInfo>

        <ListInfo className="mt-15" title={Harvest.name} id={Harvest.key}>
          <div>
            <ListInfoItem className="mt-16" label="收货时间">
              {info?.receiveTime}
            </ListInfoItem>

            <ListInfoItem className="mt-16" label="收货人">
              {info?.executorVO?.consignee}
            </ListInfoItem>
            <ListInfoItem className="mt-16" label="收货电话">
              {info?.executorVO?.phone}
            </ListInfoItem>
          </div>

          <div>
            <ListInfoItem className="mt-16" label="收货地址">
              {info?.receiverBO?.provinceName}
              {info?.receiverBO?.cityName}
              {info?.receiverBO?.districtName}
              {info?.receiverBO?.streetName}
              {info?.receiverBO?.address}
            </ListInfoItem>
          </div>
        </ListInfo>

        <ListInfo className="mt-15" title={DeliveryInfo.name} id={DeliveryInfo.key}>
          <div>
            <ListInfoItem className="mt-16" label="送货单编号">
              {info?.deliveryNo}
            </ListInfoItem>
            <ListInfoItem className="mt-16" label="发货时间">
              {info?.sendTime}
            </ListInfoItem>
          </div>

          <div>
            <ListInfoItem className="mt-16" label="发货(自提)地址">
              {info?.deliverVO?.provinceName}
              {info?.deliverVO?.cityName}
              {info?.deliverVO?.districtName}
              {info?.deliverVO?.streetName}
              {info?.deliverVO?.address}
            </ListInfoItem>
          </div>
        </ListInfo>

        <ListInfo className="mt-15" title={LogisticsInfo.name} id={LogisticsInfo.key}>
          <LogisticsInfoBox info={info} receive={true} />
        </ListInfo>

        <ListInfo
          className="mt-15"
          title={info?.type == 1 ? HarvestGood.name : HarvestMaterial.name}
          id={info?.type == 1 ? HarvestGood.key : HarvestMaterial.key}
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
          <Table columns={[...ExternalRoamRecordTableColumn]} rowKey="id" dataSource={info?.outerHistoryList} />
        </ListInfo>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default DeliveryNoteManageDetails
