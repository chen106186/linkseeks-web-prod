import React, { useContext, useEffect, useState } from 'react'
import { Table, Radio, Button } from 'antd'
import { downloadFile, formatTimeString } from '@/utils'
import MellowCard from '@/components/MellowCard'
import { TransferEnum } from '../transferProcess'
import style from './index.less'
import { BillDetailContext } from '../../_public/bill/effects/context'
import { useWebIntl } from '@apps/locales'

/**
 * 附件
 */

export interface BidTransformRecordProps {
  cardTitle?: string
}

const BilEnclosure: React.FC<BidTransformRecordProps> = ({ cardTitle }) => {
  const { data } = useContext(BillDetailContext)
  const translate = useWebIntl()
  const { attachments = [] } = data

  const outReocrdCols: any[] = [
    {
      title: translate('web.common.wenjian'),
      dataIndex: 'name',
      align: 'left',
      key: 'name',
      render: (text, record) => {
        return (
          <Button onClick={() => downloadFile(record.url, record.name)} type="link">
            {text}
          </Button>
        )
      },
    },

    {
      title: translate('web.resource.order.guanlianwuliao'),
      dataIndex: 'goodsName',
      align: 'left',
      key: 'goodsName',
    },
  ]

  return (
    <MellowCard title={cardTitle} style={{ marginTop: 24 }} bordered={false} className={style.cardWrap}>
      <Table columns={outReocrdCols} dataSource={attachments} pagination={{ size: 'small' }} rowKey="id" />
    </MellowCard>
  )
}

BilEnclosure.defaultProps = {}

export default BilEnclosure
