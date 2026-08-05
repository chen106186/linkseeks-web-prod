import { EyeAuthButton } from '@apps/components'
import { Select, Tag } from 'antd'

export interface StandardTableProps {
  title?: string
  dataIndex?: string
  key?: string
  fixed?: 'left' | 'right'
  render?: (text?: string, record?: any) => any
}

export const TransferOrderCloums: StandardTableProps[] = [
  {
    title: '商品ID',
    render: (text, record) => {
      return <EyeAuthButton url={`/`}>{text}</EyeAuthButton>
    },
  },
  {
    title: '商品图片',
    render: (t, r) => {
      return <img src={t} className="w-15 h-15 min-h-full max-w-full" />
    },
  },
  {
    title: '商品名称',
    dataIndex: 'goodName',
  },
  {
    title: '品类',
    dataIndex: 'type',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '采购数量',
    dataIndex: 'number',
  },
  {
    title: '含税/税率',
    dataIndex: 'tax',
  },
  {
    title: '会员折扣',
    dataIndex: 'discount',
    render: (t, r) => {
      return <Tag color={'red'}>80%</Tag>
    },
  },
  {
    title: '单价',
    dataIndex: 'price',
  },
  {
    title: '金额',
    dataIndex: 'total',
  },
  {
    title: '配送方式',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '累计转单',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '转单状态',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '操作',
    fixed: 'right',
    render: (t, r) => {
      return t
    },
  },
]

export const TransferOrderGoodsCloums: StandardTableProps[] = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '上游供应会员名称',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '上游商品ID',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '商品图片',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '商品名称',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '品类',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '品牌',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '单位',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '转发数量',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '转发单价',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '转发金额',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '转发状态',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '转发订单号',
    render: (t, r) => {
      return t
    },
  },
  {
    title: '转发订单号',
    fixed: 'right',
    render: (t, r) => {
      return t
    },
  },
]

export const SupplierTableCloums: StandardTableProps[] = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '转单订单号',
    dataIndex: 'id',
  },
  {
    title: '上游供应会员名称S1',
    dataIndex: 'id',
  },
  {
    title: '发货模式',
    dataIndex: 'id',
    render: (t, r) => {
      return (
        <Select>
          <Select.Option value="1">上游会员采购会员</Select.Option>
        </Select>
      )
    },
  },
  {
    title: '操作',
    render: (t, r) => {
      return <></>
    },
  },
]
