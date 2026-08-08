import React, { useContext, useEffect, useState } from 'react'
import { Table, Radio } from 'antd'
import { formatTimeString } from '@/utils'
import { BidDetailContext } from '@/pages/procurement/_public/bid/context'
import MellowCard from '@/components/MellowCard'
import CustomTag from '../customTag'
import { TransferEnum } from '../transferProcess'
import style from './index.less'
import { BidInOpeartTexts, BidOutOpeartTexts } from '@/constants/procurement'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 招标流转记录
 */

export interface BidTransformRecordProps {
  cardTitle?: string
}

const BidTransformRecord: React.FC<BidTransformRecordProps> = ({ cardTitle }) => {
  const { data, externalProcurementOrderLogResponses, interiorProcurementOrderLogResponses, apiType } =
    useContext(BidDetailContext)
  // 根据模式选择对应的状态映射
  const insideModel = apiType.indexOf('ender') !== -1 ? 'tenderInside' : 'inside'

  const [transferRadio, setTransferRadio] = useState<TransferEnum>(TransferEnum.Outer)

  const outReocrdCols: any[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.label50' }),
      dataIndex: 'no',
      align: 'center',
      key: 'no',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.label51' }),
      dataIndex: 'memberRoleName',
      align: 'center',
      key: 'memberRoleName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
      dataIndex: 'statusValue',
      align: 'center',
      key: 'statusValue',
      render: (text, r) => <CustomTag text={text} color={r.statusColor} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      dataIndex: 'operationValue',
      align: 'center',
      key: 'operationValue',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.label52' }),
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      render: (time) => formatTimeString(time),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.auditOpinion' }),
      dataIndex: 'checkRemark',
      align: 'center',
      key: 'checkRemark',
    },
  ]
  const insideRecordCols: any[] = [
    {
      title: intl.formatMessage({ id: 'table.purchase.liuzhuanjilu' }),
      dataIndex: 'no',
      align: 'center',
      key: 'no',
      render: (_, __, index: number) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.roleName' }),
      dataIndex: 'userName',
      align: 'center',
      key: 'userName',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.department2' }),
      dataIndex: 'userOrgName',
      align: 'center',
      key: 'userOrgName',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhiwei' }),
      dataIndex: 'userJobTitle',
      align: 'center',
      key: 'userJobTitle',
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.zhuangtai' }),
      dataIndex: 'statusValue',
      align: 'center',
      key: 'statusValue',
      render: (text, r) => <CustomTag text={text} color={r.statusColor} />,
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.caozuo' }),
      dataIndex: 'operationValue',
      align: 'center',
      key: 'operationValue',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.label52' }),
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
      render: (text) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.auditOpinion' }),
      dataIndex: 'checkRemark',
      align: 'center',
      key: 'checkRemark',
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
      style={{ marginTop: 16 }}
      bordered={false}
      extra={
        <Radio.Group value={transferRadio} buttonStyle="solid" size="small" onChange={handleChangeType}>
          {externalProcurementOrderLogResponses?.length ? (
            <Radio.Button value={TransferEnum.Outer}>
              {intl.formatMessage({ id: 'detail.purchase.externalLogStates' })}
            </Radio.Button>
          ) : null}
          {interiorProcurementOrderLogResponses?.length &&
          apiType !== 'tenderInCallForBid' &&
          apiType !== 'callForBidInTender' ? (
            <Radio.Button value={TransferEnum.Interior}>
              {intl.formatMessage({ id: 'detail.purchase.interiorLogStates' })}
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
