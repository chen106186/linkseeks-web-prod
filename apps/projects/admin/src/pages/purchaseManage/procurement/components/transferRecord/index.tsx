import React, { useContext, useEffect, useState } from 'react'
import { Tabs, Table, Radio } from 'antd'
import { formatTimeString } from '@/utils'
import { BidDetailContext } from '../../_public/bid/context'
import MellowCard from '@/components/MellowCard'
import CustomTag from '../customTag'
import { TransferEnum } from '../transferProcess'
import style from './index.less'
import { BidInOpeartTexts, BidOutOpeartTexts } from '@/constants'

/**
 * 招标流转记录
 */

export interface BidTransformRecordProps {
  cardTitle?: string
}

const outReocrdCols: any[] = [
  {
    title: '流转顺序号',
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: '操作角色',
    dataIndex: 'memberRoleName',
    align: 'center',
    key: 'memberRoleName',
  },
  {
    title: '状态',
    dataIndex: 'statusValue',
    align: 'center',
    key: 'statusValue',
    render: (text, r) => <CustomTag text={text} color={r.statusColor} />,
  },
  {
    title: '操作',
    dataIndex: 'operationValue',
    align: 'center',
    key: 'operationValue',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    render: (time) => formatTimeString(time),
  },
  {
    title: '审核意见',
    dataIndex: 'checkRemark',
    align: 'center',
    key: 'checkRemark',
  },
]
const insideRecordCols: any[] = [
  {
    title: '流转记录',
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: '操作人',
    dataIndex: 'userName',
    align: 'center',
    key: 'userName',
  },
  {
    title: '部门',
    dataIndex: 'department',
    align: 'center',
    key: 'department',
  },
  {
    title: '职位',
    dataIndex: 'position',
    align: 'center',
    key: 'position',
  },
  {
    title: '状态',
    dataIndex: 'statusValue',
    align: 'center',
    key: 'statusValue',
    render: (text, r) => <CustomTag text={text} color={r.statusColor} />,
  },
  {
    title: '操作',
    dataIndex: 'operationValue',
    align: 'center',
    key: 'operationValue',
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    render: (text) => formatTimeString(text),
  },
  {
    title: '审核意见',
    dataIndex: 'checkRemark',
    align: 'center',
    key: 'checkRemark',
  },
]

const BidTransformRecord: React.FC<BidTransformRecordProps> = ({ cardTitle }) => {
  const { data, externalProcurementOrderLogResponses, interiorProcurementOrderLogResponses } =
    useContext(BidDetailContext)

  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)

  useEffect(() => {
    let judgeDefault = [
      externalProcurementOrderLogResponses?.length,
      interiorProcurementOrderLogResponses?.length,
    ].filter(Boolean)
    if (judgeDefault.length === 1) {
      if (externalProcurementOrderLogResponses?.length) setTransferRadio(TransferEnum.Outer)
      else setTransferRadio(TransferEnum.Interior)
    }
  }, [])

  const handleChangeType = (e) => {
    setTransferRadio(e.target.value)
  }

  return (
    <MellowCard
      title={cardTitle}
      style={{ marginTop: 24 }}
      bordered={false}
      extra={
        <Radio.Group value={transferRadio} buttonStyle="solid" size="small" onChange={handleChangeType}>
          {externalProcurementOrderLogResponses?.length ? (
            <Radio.Button value={TransferEnum.Outer}>外部流转</Radio.Button>
          ) : null}
          {interiorProcurementOrderLogResponses?.length ? (
            <Radio.Button value={TransferEnum.Interior}>内部流转</Radio.Button>
          ) : null}
        </Radio.Group>
      }
      className={style.cardWrap}
    >
      {externalProcurementOrderLogResponses?.length && transferRadio === TransferEnum.Outer ? (
        <Table
          columns={outReocrdCols}
          dataSource={externalProcurementOrderLogResponses}
          pagination={{ size: 'small' }}
          rowKey="id"
        />
      ) : null}
      {interiorProcurementOrderLogResponses?.length && transferRadio === TransferEnum.Interior ? (
        <Table
          columns={insideRecordCols}
          dataSource={interiorProcurementOrderLogResponses}
          pagination={{ size: 'small' }}
          rowKey="id"
        />
      ) : null}
    </MellowCard>
  )
}

BidTransformRecord.defaultProps = {}

export default BidTransformRecord
