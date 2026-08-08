import React, { useContext } from 'react'
import { Tabs, Table } from 'antd'
import StatusColors from '../../../components/StatusColors'
import { formatTimeString } from '@/utils'
import { OrderDetailContext } from '../../context'
import MellowCard from '@/components/MellowCard'
import themeConfig from '@apps/config/lingxi.theme.config'

export interface OrderTransformRecordProps {}

const outOrderCols: any[] = [
  {
    title: '流转顺序号',
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: '操作角色',
    dataIndex: 'operatorRoleName',
    align: 'center',
    key: 'operatorRoleName',
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    align: 'center',
    key: 'statusName',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
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
    dataIndex: 'remark',
    align: 'center',
    key: 'remark',
  },
]
const sideOrderCols: any[] = [
  {
    title: '流转记录',
    dataIndex: 'no',
    align: 'center',
    key: 'no',
    render: (_, __, index: number) => index + 1,
  },
  {
    title: '操作人',
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
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
    dataIndex: 'state',
    align: 'center',
    key: 'state',
    render: (text) => <StatusColors status={text} type="transformInside" />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    key: 'operation',
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    align: 'center',
    key: 'operationTime',
  },
  {
    title: '审核意见',
    dataIndex: 'auditOpinion',
    align: 'center',
    key: 'auditOpinion',
  },
]
// 订单流转记录
const OrderTransformRecord: React.FC<OrderTransformRecordProps> = (props) => {
  const { data } = useContext(OrderDetailContext)
  const { outerHistories, innerHistories } = data
  return (
    <>
      {(outerHistories?.length > 0 || innerHistories?.length > 0) && (
        <MellowCard style={{ marginTop: themeConfig['@margin-md'] }} bordered={false}>
          <Tabs defaultActiveKey="1" animated={false}>
            {outerHistories?.length > 0 && (
              <Tabs.TabPane tab="外部订单流转记录" key="1">
                <Table columns={outOrderCols} dataSource={outerHistories} pagination={false} rowKey="id" />
              </Tabs.TabPane>
            )}
            {innerHistories?.length > 0 && (
              <Tabs.TabPane tab="内部订单流转记录" key="2">
                <Table columns={sideOrderCols} dataSource={innerHistories} pagination={false} rowKey="id" />
              </Tabs.TabPane>
            )}
          </Tabs>
        </MellowCard>
      )}
    </>
  )
}

OrderTransformRecord.defaultProps = {}

export default OrderTransformRecord
