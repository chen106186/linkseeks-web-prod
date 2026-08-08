import React, { useContext } from 'react'
import { Tabs, Table } from 'antd'
import { formatTimeString } from '@/utils'
import { OrderDetailContext } from '../../_public/order/context'
import MellowCard from '@/components/MellowCard'
import { getIntl } from '@linkseeks/i18n'
import themeConfig from '@apps/config/lingxi.theme.config'

export interface OrderTransformRecordProps {
  type: 'saleOrder' | 'purchaseOrder'
}
const intl = getIntl()
const outOrderCols: any[] = [
  {
    title: intl.formatMessage({ id: 'transaction_components.liuzhuanshunxuhao' }),
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuojuese' }),
    dataIndex: 'operatorRoleName',
    align: 'center',
    key: 'operatorRoleName',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhuangtai' }),
    dataIndex: 'statusName',
    align: 'center',
    key: 'statusName',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoshijian' }),
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    render: (time) => formatTimeString(time),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.shenheyijian' }),
    dataIndex: 'remark',
    align: 'center',
    key: 'remark',
  },
]
const PurchaseSideOrderCols: any[] = [
  {
    title: intl.formatMessage({ id: 'transaction_components.liuzhuanjilu' }),
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoren' }),
    dataIndex: 'operator',
    align: 'center',
    key: 'operator',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.bumen' }),
    dataIndex: 'department',
    align: 'center',
    key: 'department',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhiwei' }),
    dataIndex: 'jobTitle',
    align: 'center',
    key: 'jobTitle',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhuangtai' }),
    dataIndex: 'statusName',
    align: 'center',
    key: 'statusName',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoshijian' }),
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    render: (text) => formatTimeString(text),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.shenheyijian' }),
    dataIndex: 'remark',
    align: 'center',
    key: 'remark',
  },
]

const SaleSideOrderCols: any[] = [
  {
    title: intl.formatMessage({ id: 'transaction_components.liuzhuanjilu' }),
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoren' }),
    dataIndex: 'operator',
    align: 'center',
    key: 'operator',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.bumen' }),
    dataIndex: 'department',
    align: 'center',
    key: 'department',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhiwei' }),
    dataIndex: 'jobTitle',
    align: 'center',
    key: 'jobTitle',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.zhuangtai' }),
    dataIndex: 'statusName',
    align: 'center',
    key: 'statusName',
    // render: (text, record) => <StatusColors status={text} type='transformSaleInside' text={record.stateName} />
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuo' }),
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caozuoshijian' }),
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
    render: (text) => formatTimeString(text),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.shenheyijian' }),
    dataIndex: 'remark',
    align: 'center',
    key: 'remark',
  },
]
// 订单流转记录
const OrderTransformRecord: React.FC<OrderTransformRecordProps> = ({ type }) => {
  const {
    formContext: { data },
  } = useContext(OrderDetailContext)
  const { outerHistories, innerHistories } = data

  return (
    <>
      {(outerHistories?.length > 0 || innerHistories?.length > 0) && (
        <MellowCard id="recordInfo" bordered={false}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab={intl.formatMessage({ id: 'transaction_components.waibudingdanliuzhuanjilu' })} key="1">
              <Table columns={outOrderCols} dataSource={outerHistories} pagination={false} rowKey="id" />
            </Tabs.TabPane>
            <Tabs.TabPane tab={intl.formatMessage({ id: 'transaction_components.neibudingdanliuzhuanjilu' })} key="2">
              <Table
                columns={type === 'saleOrder' ? SaleSideOrderCols : PurchaseSideOrderCols}
                dataSource={innerHistories}
                pagination={false}
                rowKey="id"
              />
            </Tabs.TabPane>
          </Tabs>
        </MellowCard>
      )}
    </>
  )
}

OrderTransformRecord.defaultProps = {}

export default OrderTransformRecord
