import React, { useContext, useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { Table, Form, Input, Row, Col, Button, Space, Popover, Tooltip, message } from 'antd'
import { OrderDetailContext } from '../../context'
import { EditOutlined, EnvironmentOutlined, SettingOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import MellowCard from '@/components/MellowCard'
import { OrderKindType } from '../../constant'
import { ModalFormTable } from '@apps/components'
import { formatTimeString } from '@/utils'
import { getProductPlatformPositionDeductionRecordList } from '@apps/apis'
import { getOrderVendorDetailCoupon, getOrderVendorDetailPromotion } from '@apps/apis'
import { SRM_ORDER_MODE_LIST } from '@/constants'
import themeConfig from '@apps/config/lingxi.theme.config'
import { COLUMNS_ACTION_WIDTH, COLUMNS_LARGE_WIDTH } from '@/constants/const/table'
import PlatformDeliveryModal from '../platformDeliveryModal'
import PlatformLogisticsModal from '../platformLogisticsModal'
import { postOrderPlatformManageDeliveryProducts } from '../../services/platform'
import type { PlatformDeliveryProductItem } from '../../services/platform'

export interface OrderProductTableProps {}

const EditableContext = React.createContext<any>({})

interface Item {
  key: string
  name: string
  age: string
  address: string
}

interface EditableRowProps {
  index: number
}

const RowStyle = styled((props) => (
  <Row style={{ marginTop: 12 }} justify="end" {...props}>
    {props.children}
  </Row>
))`
  .ant-col {
    text-align: center;
  }
  .ant-col div {
    margin-bottom: 12px;
  }
`

const warehouseColumns: any[] = [
  { dataIndex: 'freightSpaceId', key: 'freightSpaceId', title: '仓位ID', align: 'center' },
  { dataIndex: 'freightSpaceName', key: 'freightSpaceName', title: '仓位名称', align: 'center' },
  { dataIndex: 'warehouseName', key: 'warehouseName', title: '对应仓库', align: 'center' },
  { dataIndex: 'goodsName', key: 'goodsName', title: '对应物料', align: 'center' },
  {
    dataIndex: 'reductionInventory',
    key: 'reductionInventory',
    title: '扣减仓位库存',
    align: 'center',
    render: (t, r) => (r.type === 4 ? `-${t}` : `+${t}`),
  },
  {
    dataIndex: 'createTime',
    key: 'createTime',
    title: '扣减时间',
    align: 'center',
    render: (text) => formatTimeString(text),
  },
]

const couponColumns: any[] = [
  { dataIndex: 'couponId', key: 'couponId', title: '券码', align: 'center' },
  { dataIndex: 'name', key: 'name', title: '优惠券名称', align: 'center' },
  { dataIndex: 'couponTypeName', key: 'couponTypeName', title: '优惠券类型', align: 'center' },
  { dataIndex: 'belongTypeName', key: 'belongTypeName', title: '优惠券归属', align: 'center' },
  { dataIndex: 'amount', key: 'amount', title: '面额', align: 'center', render: (t) => `￥${t}` },
  {
    dataIndex: 'startTime',
    key: 'startTime',
    title: '有效期',
    align: 'center',
    render: (t, r) => `${t}至${r.expireTime}`,
  },
]

const activityColumns: any[] = [
  { dataIndex: 'promotionId', key: 'promotionId', title: '活动ID', align: 'center' },
  { dataIndex: 'name', key: 'name', title: '活动名称', align: 'center' },
  { dataIndex: 'promotionTypeName', key: 'promotionTypeName', title: '活动类型', align: 'center' },
  { dataIndex: 'belongTypeName', key: 'belongTypeName', title: '活动归属', align: 'center' },
  {
    dataIndex: 'startTime',
    key: 'startTime',
    title: '活动有效期',
    align: 'center',
    render: (t, r) => `${t}至${r.expireTime}`,
  },
]

const modalPriceActions = createFormActions()

export const MoneyTotalBox = ({ dataSource, isEditData, setCouponModalVisible }) => {
  const { product, orderMode, amount } = dataSource || {}
  const creditsCommodity = orderMode === 24 || orderMode === 25
  const sum = amount || product.products.reduce((prev, next) => prev + Number(next.price || 0), 0)
  const modelRef = useRef<any>({})
  const [freePrice, setFreePrice] = useState<number>(0)

  const handleConfirm = () => {
    setFreePrice(parseInt(modalPriceActions.getFieldValue('freePrice') || 0))
    modelRef.current.setVisible(false)
  }

  const { productAmount, totalAmount, freight, promotionAmount, couponAmount, deductionAmount } = product

  return (
    <RowStyle>
      <Col span={2}>
        <div>{creditsCommodity ? '合计所需积分' : '合计金额'}</div>
        <div>{productAmount}</div>
      </Col>
      {!creditsCommodity && (
        <Col span={2}>
          <div>促销立减</div>
          <div>{`-￥${promotionAmount}`}</div>
        </Col>
      )}
      {!creditsCommodity && (
        <Col span={2}>
          <div>优惠抵扣</div>
          <div>
            <Button
              type="link"
              onClick={() => setCouponModalVisible(true)}
              style={{ padding: 0, height: '18px', lineHeight: '18px' }}
            >{`-￥${couponAmount}`}</Button>
          </div>
        </Col>
      )}
      {!creditsCommodity && (
        <Col span={2}>
          <div>积分抵扣</div>
          <div>{`-￥${deductionAmount}`}</div>
        </Col>
      )}
      <Col span={2}>
        <div>运费 {isEditData && <SettingOutlined style={{ marginLeft: 8 }} />}</div>
        <div>{freight || freePrice}</div>
      </Col>
      <Col span={2}>
        <div>{creditsCommodity ? '总计所需积分' : '总计金额'}</div>
        <div>{totalAmount || sum + freePrice}</div>
      </Col>
      <ModalForm
        modalTitle="设置运费"
        currentRef={modelRef}
        initialValues={freePrice}
        schema={{
          type: 'object',
          properties: {
            NO_SUBMIT_LAYOUT: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': { labelAlign: 'top' },
              properties: {
                freePrice: {
                  type: 'string',
                  title: '设置运费',
                  'x-props': { addonBefore: '￥' },
                },
              },
            },
          },
        }}
        actions={modalPriceActions}
        confirm={handleConfirm}
      />
    </RowStyle>
  )
}

export const AddressPop = (props) => {
  const { pickInfo = null, children } = props
  return pickInfo && pickInfo.deliverType === 2 ? (
    <Space>
      <EnvironmentOutlined style={{ marginRight: 8 }} />
      <Popover
        content={
          <Row>
            <div>
              <div>
                <EnvironmentOutlined /> 自提地址
              </div>
              <p>
                {pickInfo.receiver} / {pickInfo.phone}
              </p>
              <p>{pickInfo.address}</p>
            </div>
          </Row>
        }
      >
        {children}
      </Popover>
    </Space>
  ) : (
    children
  )
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<any>({})
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      values.price = parseInt(values.price)
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, width: 140 }}
        name={dataIndex}
        rules={[{ required: true, message: '此项为必填项' }]}
      >
        <Input type="number" ref={inputRef} onBlur={save} onPressEnter={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
        <EditOutlined />
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const toNumber = (value) => Number(value || 0)

const OrderProductTable: React.FC<OrderProductTableProps> = () => {
  const { ctl, data, reloadFormData } = useContext(OrderDetailContext)
  const {
    product,
    orderMode,
    orderKind,
    orderId,
    orderNo,
    digest,
    buyerMemberName,
    createTime,
    amount,
    deliveryDetails,
  } = data || {}
  const contractOrder = orderKind === OrderKindType.SRM_ORDER
  const isSrmOrder = SRM_ORDER_MODE_LIST.includes(data.orderMode)
  const [checkProduct, setCheckProduct] = useState<any>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [deliveryProducts, setDeliveryProducts] = useState<PlatformDeliveryProductItem[]>([])
  const [deliveryProductsLoading, setDeliveryProductsLoading] = useState(false)
  const [deliveryVisible, setDeliveryVisible] = useState(false)
  const [logisticsVisible, setLogisticsVisible] = useState(false)
  const [logisticsBatchNo, setLogisticsBatchNo] = useState<number | undefined>(undefined)
  const warehouseRef = ModalFormTable.useTableRef()
  const couponRef = ModalFormTable.useTableRef()
  const activityRef = ModalFormTable.useTableRef()

  const isEditData = false
  const productComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const loadDeliveryProducts = useCallback(async () => {
    if (!orderNo || contractOrder) {
      return
    }
    setDeliveryProductsLoading(true)
    try {
      const { code, data: result } = await postOrderPlatformManageDeliveryProducts({ orderNo })
      if (code === 1000) {
        setDeliveryProducts(result || [])
      }
    } catch (error) {
      message.error('获取可发货商品失败')
      setDeliveryProducts([])
    } finally {
      setDeliveryProductsLoading(false)
    }
  }, [contractOrder, orderNo])

  useEffect(() => {
    loadDeliveryProducts()
  }, [loadDeliveryProducts])

  const productsWithDelivery = useMemo(() => {
    const deliveryProductMap = new Map(deliveryProducts.map((item) => [item.orderProductId, item]))
    return (product.products || []).map((item) => {
      const deliveryProduct = deliveryProductMap.get(item.orderProductId)
      return deliveryProduct
        ? {
            ...item,
            delivered: deliveryProduct.delivered,
            received: deliveryProduct.received,
            leftCount: deliveryProduct.leftCount,
            differCount: deliveryProduct.differCount,
          }
        : item
    })
  }, [deliveryProducts, product.products])

  const hasDeliverableProducts = productsWithDelivery.some((item) => toNumber(item.leftCount) > 0)

  const deliveredBatchMap = useMemo(() => {
    const map = new Map<string, number[]>()
    ;(deliveryDetails || []).forEach((detail) => {
      ;(detail.products || []).forEach((item) => {
        const keys = [
          item.orderProductId ? `op:${item.orderProductId}` : '',
          item.skuId ? `sku:${item.skuId}` : '',
        ].filter(Boolean)
        if (!keys.length) {
          return
        }
        keys.forEach((key) => {
          const next = map.get(key) || []
          if (detail.batchNo && !next.includes(detail.batchNo)) {
            next.push(detail.batchNo)
          }
          map.set(key, next)
        })
      })
    })
    return map
  }, [deliveryDetails])

  const batchOptions = useMemo(
    () =>
      Array.from(new Set((deliveryDetails || []).map((item) => item.batchNo).filter(Boolean))).sort((a, b) => b - a),
    [deliveryDetails],
  )

  const handleSave = (row) => {
    const newData = [...product.products]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    ctl.setData({
      ...data,
      product: { products: newData },
    })
  }

  const handlePreviewWarehouse = (record) => {
    setCheckProduct(record)
    warehouseRef.current.setVisible(true)
    warehouseRef.current.reload()
  }

  const handlePreviewActivity = (record) => {
    setCheckProduct(record)
    activityRef.current.setVisible(true)
    activityRef.current.reload()
  }

  const handleOpenDelivery = () => {
    if (!selectedRowKeys.length) {
      message.warning('请先选择未发货商品')
      return
    }
    setDeliveryVisible(true)
  }

  const handleDeliverySuccess = () => {
    setDeliveryVisible(false)
    setSelectedRowKeys([])
    loadDeliveryProducts()
    reloadFormData?.()
  }

  const handleOpenLogistics = (record) => {
    const batches =
      deliveredBatchMap.get(`op:${record.orderProductId}`) || deliveredBatchMap.get(`sku:${record.skuId}`) || []
    setLogisticsBatchNo(batches[0])
    setLogisticsVisible(true)
  }

  const productInfoColumns: any[] = [
    {
      title: '商品ID',
      dataIndex: 'skuId',
      key: 'skuId',
      width: 100,
    },
    {
      title: '商品名称/规格',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: COLUMNS_LARGE_WIDTH,
      render: (t, r) => <Tooltip title={`${t}/${r.spec}`}>{`${t}/${r.spec}`}</Tooltip>,
    },
    {
      title: '品类',
      dataIndex: 'category',
      key: 'category',
      width: 152,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 128,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
      width: 80,
    },
    {
      title: '单价(元)',
      dataIndex: 'price',
      align: 'left',
      key: 'price',
      width: 128,
      editable: isEditData,
    },
    {
      title: '采购数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 96,
    },
    {
      title: '含税',
      dataIndex: 'tax',
      key: 'tax',
      render: (t) => (t ? '是' : '否'),
      width: 96,
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      key: 'taxRate',
      render: (t) => (t ? `${t}%` : null),
      width: 96,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
    },
    {
      title: '配送方式',
      dataIndex: 'deliverType',
      key: 'deliverType',
      render: (text, record) =>
        text && text === 2 ? (
          <AddressPop pickInfo={record}>{record.deliverTypeName}</AddressPop>
        ) : (
          record.deliverTypeName
        ),
      width: 96,
    },
    {
      title: '已发货',
      dataIndex: 'delivered',
      key: 'delivered',
      width: 96,
    },
    {
      title: '未发货',
      dataIndex: 'leftCount',
      key: 'leftCount',
      width: 96,
    },
    {
      title: '操作',
      dataIndex: 'record',
      key: 'record',
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH + 60,
      render: (_, record) => {
        const delivered = toNumber(record.delivered) > 0
        return (
          <>
            {delivered ? (
              <Button type="link" onClick={() => handleOpenLogistics(record)}>
                查看物流
              </Button>
            ) : null}
            <Button type="link" onClick={() => handlePreviewWarehouse(record)}>
              查看库存记录
            </Button>
            <Button type="link" onClick={() => handlePreviewActivity(record)}>
              查看活动记录
            </Button>
          </>
        )
      },
    },
  ]

  const materialInfo: any[] = [
    { title: '物料编号', dataIndex: 'productNo', key: 'productNo', width: 80 },
    {
      title: '物料名称/规格',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: COLUMNS_LARGE_WIDTH,
      render: (t, r) => <Tooltip title={`${t}/${r.spec}`}>{`${t}/${r.spec}`}</Tooltip>,
    },
    { title: '品类', dataIndex: 'category', key: 'category', width: 152 },
    { title: '品牌', dataIndex: 'brand', key: 'brand', width: 128 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 80 },
    {
      title: '关联报价商品ID/名称/品类/品牌',
      dataIndex: 'quotedSkuId',
      key: 'quotedSkuId',
      ellipsis: true,
      width: COLUMNS_LARGE_WIDTH,
      render: (t, r) =>
        t ? (
          <Tooltip title={`${t}/${r.quotedName}/${r.quotedCategory}/${r.quotedBrand}`}>
            {`${t}/${r.quotedName}/${r.quotedCategory}/${r.quotedBrand}`}
          </Tooltip>
        ) : (
          ''
        ),
    },
    { title: '单价(元)', dataIndex: 'price', align: 'left', key: 'price', width: 128 },
    { title: '采购数量', dataIndex: 'quantity', key: 'quantity', width: 96 },
    { title: '含税', dataIndex: 'tax', key: 'tax', render: (t) => (t ? '是' : '否'), width: 96 },
    { title: '税率', dataIndex: 'taxRate', key: 'taxRate', render: (t) => (t ? `${t}%` : null), width: 96 },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 160 },
    {
      title: '配送方式',
      dataIndex: 'deliverType',
      key: 'deliverType',
      render: (text, record) =>
        text && text === 2 ? (
          <AddressPop pickInfo={record}>{record.deliverTypeName}</AddressPop>
        ) : (
          record.deliverTypeName
        ),
      width: 96,
    },
  ]

  const fetchWarehouseData = useCallback(
    async (params) => {
      if (checkProduct.skuId) {
        const { data: result } = await getProductPlatformPositionDeductionRecordList({
          ...params,
          productId: String(checkProduct.skuId),
          stockId: checkProduct.stockId,
        })
        return result
      }
      return { data: [], totalCount: 0 }
    },
    [checkProduct],
  )

  const fetchCouponData = useCallback(
    async (params) => {
      const { data: result, code } = await getOrderVendorDetailCoupon({ ...params, orderId: String(orderId) })
      return code === 1000 ? result : []
    },
    [orderId],
  )

  const fetchActivityData = useCallback(
    async (params) => {
      if (checkProduct.orderProductId) {
        const { data: result, code } = await getOrderVendorDetailPromotion({
          ...params,
          orderProductId: String(checkProduct?.orderProductId),
        })
        return code === 1000 ? result : []
      }
      return { data: [], totalCount: 0 }
    },
    [checkProduct],
  )

  const columns = productInfoColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  const rowSelection = contractOrder
    ? undefined
    : {
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys),
        getCheckboxProps: (record) => ({
          disabled: toNumber(record.leftCount) <= 0,
        }),
      }

  return (
    <MellowCard
      title={isSrmOrder || contractOrder ? '订单物料' : '订单商品'}
      extra={
        !contractOrder && hasDeliverableProducts ? (
          <Button type="primary" disabled={!selectedRowKeys.length} onClick={handleOpenDelivery}>
            去发货
          </Button>
        ) : null
      }
      style={{ marginTop: themeConfig['@margin-md'] }}
      bordered={false}
    >
      <Table
        columns={contractOrder ? materialInfo : columns}
        dataSource={productsWithDelivery}
        components={productComponents}
        loading={deliveryProductsLoading}
        rowKey="orderProductId"
        pagination={false}
        rowSelection={hasDeliverableProducts ? rowSelection : undefined}
        scroll={{ x: 1400 }}
      />
      <MoneyTotalBox
        dataSource={data}
        isEditData={isEditData}
        setCouponModalVisible={() => {
          couponRef.current?.setVisible(true)
        }}
      />

      <PlatformDeliveryModal
        visible={deliveryVisible}
        orderNo={orderNo}
        orderDigest={digest}
        buyerMemberName={buyerMemberName}
        createTime={createTime}
        amount={amount}
        selectedOrderProductIds={selectedRowKeys.map((item) => Number(item))}
        onClose={() => setDeliveryVisible(false)}
        onSuccess={handleDeliverySuccess}
      />

      <PlatformLogisticsModal
        visible={logisticsVisible}
        orderNo={orderNo}
        batchNo={logisticsBatchNo}
        batchOptions={batchOptions}
        onClose={() => setLogisticsVisible(false)}
      />

      <ModalFormTable
        modalTitle="营销活动使用记录"
        actionRef={activityRef}
        request={fetchActivityData}
        columns={activityColumns}
        rowKey="id"
        pagination={false}
        onOk={() => activityRef.current?.setVisible(false)}
        modalProps={{ destroyOnClose: true }}
      />

      <ModalFormTable
        modalTitle="优惠券使用记录"
        actionRef={couponRef}
        request={fetchCouponData}
        columns={couponColumns}
        rowKey="id"
        pagination={false}
        onOk={() => couponRef.current?.setVisible(false)}
        modalProps={{ destroyOnClose: true }}
      />

      <ModalFormTable
        modalTitle="仓位库存扣减记录"
        actionRef={warehouseRef}
        request={fetchWarehouseData}
        columns={warehouseColumns}
        rowKey="id"
        pagination={false}
        onOk={() => warehouseRef.current?.setVisible(false)}
      />
    </MellowCard>
  )
}

OrderProductTable.defaultProps = {}

export default OrderProductTable
