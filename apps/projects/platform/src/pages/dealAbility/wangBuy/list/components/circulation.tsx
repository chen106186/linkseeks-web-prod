import React from 'react'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import { Table } from 'antd'
import { ColumnType } from 'antd/lib/table'

const intl = getIntl()

interface CirculationTableProps {
  title: string
  tableMessage: any[]
}

const CirculationTable: React.FC<CirculationTableProps> = (props) => {
  const {
    tableMessage = [],
    title = intl.formatMessage({
      id: 'transaction_components.waibuliuzhuan',
      defaultMessage: '外部流转',
    }),
  } = props

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.liuzhuanshunxuhao',
        defaultMessage: '流转顺序号',
      }),
      key: 'operateCode',
      dataIndex: 'operateCode',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.caozuojuese',
        defaultMessage: '操作角色',
      }),
      key: 'positionName',
      dataIndex: 'positionName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.zhuangtai', defaultMessage: '状态' }),
      key: 'statusDesc',
      dataIndex: 'statusDesc',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuo', defaultMessage: '操作' }),
      key: 'operateCodeDesc',
      dataIndex: 'operateCodeDesc',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.caozuoshijian',
        defaultMessage: '操作时间',
      }),
      key: 'createTime',
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.beizhu', defaultMessage: '备注' }),
      key: 'remark',
      dataIndex: 'remark',
    },
  ]

  return (
    <Card id="circulationTable" title={title}>
      <Table columns={columns} dataSource={tableMessage} />
    </Card>
  )
}

export default CirculationTable
