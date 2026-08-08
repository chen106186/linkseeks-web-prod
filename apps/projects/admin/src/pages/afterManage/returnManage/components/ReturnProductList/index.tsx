import React, { useState } from 'react'
import { Tooltip, Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import ReturnInfoDrawer, { OrderInfoType, PayListItemType } from '../ReturnInfoDrawer'

export type ReturnProductListItemType = {
  /**
   * 退货详情id
   */
  returnDetailId: number
  /**
   * 退货商品id
   */
  returnGoodsId: number
  /**
   * 订单记录id
   */
  orderRecordId: number
  /**
   * 订单id
   */
  orderId: number
  /**
   * 订单号
   */
  orderNo: string
  /**
   * 商品id物料编号
   */
  productId: string
  /**
   * 商品名称物料名称、规格
   */
  productName: string
  /**
   * 品类
   */
  category: string
  /**
   * 品牌
   */
  brand: string
  /**
   * 单位
   */
  unit: string
  /**
   * skuId
   */
  skuId: number
  /**
   * sku图片
   */
  skuPic: string
  /**
   * 采购数量
   */
  purchaseCount: number
  /**
   * 采购单价
   */
  purchasePrice: number
  /**
   * 采购金额
   */
  purchaseAmount: number
  /**
   * 支付金额
   */
  payAmount: number
  /**
   * 退货数量
   */
  returnCount: number
  /**
   * 已退货发货(发货数量)
   */
  deliveryCount: number
  /**
   * 退货未发货
   */
  noDeliveryCount: number
  /**
   * 已退货收货(收货数量)
   */
  receiveCount: number
  /**
   * 差异数量
   */
  subCount: number
  /**
   * 退款金额
   */
  refundAmount: number
  /**
   * 退货原因
   */
  returnReason: string
  /**
   * 是否需要退货：0.否1.是
   */
  isNeedReturn: number
  /**
   * 是否需要退货
   */
  needReturnName: string
  /**
   * 是否含税：0-否，1-是
   */
  isHasTax: number
  /**
   * 税率
   */
  taxRate: number
  /**
   * 支付信息 ,ReturnGoodsPayVO
   */
  payList: PayListItemType[]
  /**
   * 商品规格
   */
  type: string
  /**
   * 关联商品ID
   */
  associatedProductId: string
  /**
   * 关联商品名称、规格
   */
  associatedProductName: string
  /**
   * 关联商品规格
   */
  associatedType: string
  /**
   * 关联商品品类
   */
  associatedCategory: string
  /**
   * 关联商品品牌
   */
  associatedBrand: string
  /**
   * 关联商品单位
   */
  associatedUnit: string
  /**
   * 合同id
   */
  contractId: number
  /**
   * 合同编号
   */
  contractNo: string
}

interface ReturnProductListProps {
  /**
   * 数据
   */
  dataSource: ReturnProductListItemType[]
  /**
   * 是否加载中
   */
  loading?: boolean
}

const ReturnProductList: React.FC<ReturnProductListProps> = (props: ReturnProductListProps) => {
  const { dataSource, loading } = props

  const [orderInfo, setOrderInfo] = useState<OrderInfoType | null>(null)
  const [visibleReturnInfo, setVisibleReturnInfo] = useState(false)

  const handleCheckOrderDetial = (record: ReturnProductListItemType) => {
    setOrderInfo({
      orderNo: record.orderNo,
      productName: record.productName,
      category: record.category,
      brand: record.brand,
      unit: record.unit,
      purchaseCount: record.purchaseCount,
      purchasePrice: record.purchasePrice,
      purchaseAmount: record.purchaseAmount,
      returnCount: record.returnCount,
      returnReason: record.returnReason,
      payList: record.payList.map((item) => ({
        ...item,
        payWayTxt: item.payWayName,
        channelTxt: item.channelName,
        payRatio: item.payRatio * 100,
      })),
      refundAmount: record.refundAmount,
    })
    setVisibleReturnInfo(true)
  }

  const columns: EditableColumns<ReturnProductListItemType>[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '品类',
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'center',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '采购数量',
      dataIndex: 'purchaseCount',
      align: 'center',
    },
    {
      title: '采购单价',
      dataIndex: 'purchasePrice',
      align: 'center',
    },
    {
      title: '采购金额',
      dataIndex: 'purchaseAmount',
      align: 'center',
    },
    {
      title: '已支付金额',
      dataIndex: 'payAmount',
      align: 'center',
    },
    {
      title: '退货数量',
      dataIndex: 'returnCount',
      align: 'center',
    },
    {
      title: '退货金额',
      dataIndex: 'refundAmount',
      align: 'center',
    },
    {
      title: (
        <>
          <span style={{ marginRight: 8 }}>是否需要退货</span>
          <Tooltip title="如果商品因为缺陷原因，无法再退回加工后重新使用，可选择不需要退货，选择后，采购方无须退回不良品。">
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      dataIndex: 'needReturnName',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleCheckOrderDetial(record)}>
            查看详情
          </Button>
        </>
      ),
    },
  ]

  return (
    <>
      <MellowCard title="退货商品">
        <PolymericTable
          rowKey="orderRecordId"
          dataSource={dataSource}
          columns={columns}
          loading={!!loading}
          pagination={null}
        />
      </MellowCard>
      <ReturnInfoDrawer
        visible={visibleReturnInfo}
        orderInfo={orderInfo!}
        onClose={() => setVisibleReturnInfo(false)}
      />
    </>
  )
}

export default ReturnProductList
