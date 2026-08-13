import React, { useContext, useMemo, useState } from 'react'
import { Button, Table, Space } from 'antd'
import { formatTimeString } from '@/utils'
import { OrderDetailContext } from '../../context'
import { OrderKindType } from '../../constant'
import { SRM_ORDER_MODE_LIST } from '@/constants'
import { Card } from '@linkseeks/ui'
import PlatformLogisticsModal from '../platformLogisticsModal'
import style from './index.less'

export interface OrderDeleveRecordProps {}

const outerMaterialCols: any[] = [
  { title: 'ID', dataIndex: 'productId', align: 'center', key: 'productId', className: 'commonHide' },
  { title: '物料编号', dataIndex: 'productNo', align: 'center', key: 'productNo' },
  { title: '物料名称/规格', dataIndex: 'name', align: 'center', key: 'name' },
  { title: '品类', dataIndex: 'category', align: 'center', key: 'category' },
  { title: '品牌', dataIndex: 'brand', align: 'center', key: 'brand' },
  { title: '单位', dataIndex: 'unit', align: 'center', key: 'unit' },
  {
    title: '关联报价商品ID/名称/品类/品牌',
    dataIndex: 'quotedSkuId',
    align: 'center',
    key: 'quotedSkuId',
    render: (t, r) => (t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''),
  },
  { title: '采购数量', dataIndex: 'quantity', align: 'center', key: 'quantity' },
  { title: '含税', dataIndex: 'tax', align: 'center', key: 'tax', render: (text) => (text ? '是' : '否') },
  { title: '金额', dataIndex: 'amount', align: 'center', key: 'amount' },
  { title: '已发货', dataIndex: 'delivered', align: 'center', key: 'delivered' },
  { title: '未发货', dataIndex: 'leftCount', align: 'center', key: 'leftCount' },
  { title: '已收货', dataIndex: 'received', align: 'center', key: 'received' },
  { title: '差异数量', dataIndex: 'differCount', align: 'center', key: 'differCount' },
]

const sideChildrenMaterialCols: any[] = [
  { title: 'ID', dataIndex: 'productId', align: 'center', key: 'productId', className: 'commonHide' },
  { title: '物料编号', dataIndex: 'productNo', align: 'center', key: 'productNo' },
  { title: '物料名称/规格', dataIndex: 'name', align: 'center', key: 'name' },
  { title: '品类', dataIndex: 'category', align: 'center', key: 'category' },
  { title: '品牌', dataIndex: 'brand', align: 'center', key: 'brand' },
  { title: '单位', dataIndex: 'unit', align: 'center', key: 'unit' },
  {
    title: '关联报价商品ID/名称/品类/品牌',
    dataIndex: 'quotedSkuId',
    align: 'center',
    key: 'quotedSkuId',
    render: (t, r) => (t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''),
  },
  { title: '采购数量', dataIndex: 'quantity', align: 'center', key: 'quantity' },
  { title: '发货数量', dataIndex: 'delivered', align: 'center', key: 'delivered' },
  { title: '收货数量', dataIndex: 'received', align: 'center', key: 'received' },
  { title: '差异数量', dataIndex: 'differCount', align: 'center', key: 'differCount' },
]

const OrderDeleveRecord: React.FC<OrderDeleveRecordProps> = () => {
  const { data } = useContext(OrderDetailContext)
  const { deliveries, deliveryDetails, orderKind } = data
  const [logisticsVisible, setLogisticsVisible] = useState(false)
  const [currentBatchNo, setCurrentBatchNo] = useState<number | undefined>()

  const contractOrder = orderKind === OrderKindType.SRM_ORDER
  const isSrmOrder = SRM_ORDER_MODE_LIST.includes(data.orderMode)

  const batchOptions = useMemo(
    () =>
      (deliveryDetails || [])
        .map((item) => item?.batchNo)
        .filter((item) => typeof item === 'number')
        .sort((a, b) => a - b),
    [deliveryDetails],
  )

  const outOrderCols: any[] = [
    { title: '商品ID', dataIndex: 'productId', align: 'center', key: 'productId' },
    {
      title: data.orderType === 3 ? '商品名称' : '物料名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    { title: '品类', dataIndex: 'category', align: 'center', key: 'category' },
    { title: '品牌', dataIndex: 'brand', align: 'center', key: 'brand' },
    { title: '单位', dataIndex: 'unit', align: 'center', key: 'unit' },
    { title: '单价', dataIndex: 'price', align: 'center', key: 'price' },
    { title: '采购数量', dataIndex: 'quantity', align: 'center', key: 'quantity' },
    { title: '含税', dataIndex: 'tax', align: 'center', key: 'tax', render: (t) => (t ? '是' : '否') },
    { title: '金额', dataIndex: 'amount', align: 'center', key: 'amount' },
    { title: '已发货', dataIndex: 'delivered', align: 'center', key: 'delivered' },
    { title: '未发货', dataIndex: 'leftCount', align: 'center', key: 'leftCount' },
    { title: '已收货', dataIndex: 'received', align: 'center', key: 'received' },
    { title: '差异数量', dataIndex: 'differCount', align: 'center', key: 'differCount' },
  ]

  const sideChildrenCols: any[] = [
    { title: isSrmOrder ? '物料ID' : '商品ID', dataIndex: 'productId', align: 'center', key: 'productId' },
    { title: isSrmOrder ? '物料名称' : '商品名称', dataIndex: 'name', align: 'center', key: 'name' },
    { title: '品类', dataIndex: 'category', align: 'center', key: 'category' },
    { title: '品牌', dataIndex: 'brand', align: 'center', key: 'brand' },
    { title: '单位', dataIndex: 'unit', align: 'center', key: 'unit' },
    { title: '采购数量', dataIndex: 'quantity', align: 'center', key: 'quantity' },
    { title: '发货数量', dataIndex: 'delivered', align: 'center', key: 'delivered' },
    { title: '收货数量', dataIndex: 'received', align: 'center', key: 'received' },
    { title: '差异数量', dataIndex: 'differCount', align: 'center', key: 'differCount' },
  ]

  const DeliverlyItem = ({ record }) => (
    <div className={style.deliverlyItem}>
      <div style={{ flex: 1 }}>
        <p className={style.text}>发货单号：{record.deliveryNo || '-'}</p>
        <p>发货时间：{record.createTime ? formatTimeString(record.createTime) : '-'}</p>
      </div>
      <div style={{ flex: 1 }}>
        <p className={style.text}>物流单号：{record.logisticsNo || '-'}</p>
        <p>物流公司：{record.company || '-'}</p>
      </div>
      <div style={{ flex: 1 }}>
        <p className={style.text}>收货单号：{record.receiptNo || '-'}</p>
        <p>收货时间：{record.receiptTime ? formatTimeString(record.receiptTime) : '-'}</p>
      </div>
      <div>
        <Button
          type="link"
          className={style.btn}
          onClick={() => {
            setCurrentBatchNo(record.batchNo)
            setLogisticsVisible(true)
          }}
        >
          查看物流
        </Button>
      </div>
    </div>
  )

  return (
    <Space direction="vertical" style={{ display: 'flex', width: '100%', marginTop: 16 }} size={16}>
      <Card title="订单收货统计">
        <Table
          columns={contractOrder ? outerMaterialCols : outOrderCols}
          dataSource={deliveries}
          pagination={false}
          rowKey="productId"
        />
      </Card>
      <Card title="订单收货明细">
        {(deliveryDetails || [])
          .slice()
          .sort((a, b) => (b.batchNo > a.batchNo ? 1 : -1))
          .map((item) => (
            <div className={style.deliveryDetailsBox} key={item.deliveryNo || item.batchNo}>
              <div className={style['deliveryDetailsBox-title']}>
                <b className={style['deliveryDetailsBox-batchNo']}>第{item?.batchNo}批次</b>
              </div>
              <DeliverlyItem record={item} />
              <Table
                columns={contractOrder ? sideChildrenMaterialCols : sideChildrenCols}
                rowKey={(i, key) => `${i.productId}${key}`}
                dataSource={item?.products || []}
                style={{ width: '100%' }}
                pagination={false}
              />
            </div>
          ))}
      </Card>
      <PlatformLogisticsModal
        visible={logisticsVisible}
        orderNo={data.orderNo}
        batchNo={currentBatchNo}
        batches={batchOptions}
        onClose={() => setLogisticsVisible(false)}
      />
    </Space>
  )
}

export default OrderDeleveRecord
