import React, { useContext, useEffect, useState } from 'react'
import { Table, Radio } from 'antd'
import { formatTimeString } from '@/utils'
import MellowCard from '@/components/MellowCard'
import { TransferEnum } from '../transferProcess'
import style from './index.less'
import { BillDetailContext } from '../../_public/bill/effects/context'
import { useIntl } from '@linkseeks/i18n'

/**
 * 请购订单流转记录
 */

export interface BidTransformRecordProps {
  cardTitle?: string
}

const BidTransformRecord: React.FC<BidTransformRecordProps> = ({ cardTitle }) => {
  const { data } = useContext(BillDetailContext)
  const intl = useIntl()
  const { innerHistories: interiorProcurementOrderLogResponses, externalProcurementOrderLogResponses = [] } = data

  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)

  const outReocrdCols: any[] = [
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.liuzhuanshunxuhao', defaultMessage: '流转顺序号' }),
      dataIndex: 'id',
      align: 'left',
      key: 'id',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.caozuojuese', defaultMessage: '操作角色' }),
      dataIndex: 'memberRoleName',
      align: 'left',
      key: 'memberRoleName',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.zhuangtai', defaultMessage: '状态' }),
      dataIndex: 'statusValue',
      align: 'left',
      key: 'statusValue',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.caozuo', defaultMessage: '操作' }),
      dataIndex: 'operationValue',
      align: 'left',
      key: 'operationValue',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.caozuoshijian', defaultMessage: '操作时间' }),
      dataIndex: 'createTime',
      align: 'left',
      key: 'createTime',
      render: (time) => formatTimeString(time),
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.shenheyijian', defaultMessage: '审核意见' }),
      dataIndex: 'checkRemark',
      align: 'left',
      key: 'checkRemark',
    },
  ]
  const insideRecordCols: any[] = [
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.liuzhuanjilu', defaultMessage: '流转记录' }),
      dataIndex: 'id',
      align: 'left',
      key: 'id',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.caozuoren', defaultMessage: '操作人' }),
      dataIndex: 'operator',
      align: 'left',
      key: 'operator',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.bumen', defaultMessage: '部门' }),
      dataIndex: 'department',
      align: 'left',
      key: 'department',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.zhiwei', defaultMessage: '职位' }),
      dataIndex: 'jobTitle',
      align: 'left',
      key: 'jobTitle',
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      align: 'left',
      key: 'statusName',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.caozuo', defaultMessage: '操作' }),
      dataIndex: 'operation',
      align: 'left',
      key: 'operation',
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.caozuoshijian', defaultMessage: '操作时间' }),
      dataIndex: 'createTime',
      align: 'left',
      key: 'createTime',
      render: (text) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.shenheyijian', defaultMessage: '审核意见' }),
      dataIndex: 'remark',
      align: 'left',
      key: 'remark',
    },
  ]

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
            <Radio.Button value={TransferEnum.Outer}>
              {intl.formatMessage({ id: 'purchaseRequisition.waibuliuzhuan', defaultMessage: '外部流转' })}
            </Radio.Button>
          ) : null}
          {interiorProcurementOrderLogResponses?.length ? (
            <Radio.Button value={TransferEnum.Interior}>
              {intl.formatMessage({ id: 'purchaseRequisition.neibuliuzhuan', defaultMessage: '内部流转' })}
            </Radio.Button>
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
