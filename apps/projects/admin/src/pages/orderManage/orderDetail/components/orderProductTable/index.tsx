import React, { useContext, useState, useRef, useEffect, useCallback } from 'react'
import { Table, Form, Input, Row, Col, Button, Modal, Space, Popover, Tooltip } from 'antd'
import { OrderDetailContext } from '../../context'
import { EditOutlined, EnvironmentOutlined, SettingOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import MellowCard from '@/components/MellowCard'
import { OrderKindType } from '../../constant'
import { ModalFormTable, ModalFormTableRef } from '@apps/components'
import { formatTimeString } from '@/utils'
import { getProductPlatformPositionDeductionRecordList } from '@apps/apis'
import { getOrderVendorDetailCoupon, getOrderVendorDetailPromotion } from '@apps/apis'
import { SRM_ORDER_MODE_LIST } from '@/constants'
import themeConfig from '@apps/config/lingxi.theme.config'
import { COLUMNS_ACTION_WIDTH, COLUMNS_LARGE_WIDTH } from '@/constants/const/table'
import OrderLogisticsAction from '../orderLogisticsAction'
import styles from './index.less'

export interface OrderProductTableProps {}

// 订单商品cell切换
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
  {
    dataIndex: 'freightSpaceId',
    key: 'freightSpaceId',
    title: '仓位ID',
    align: 'center',
  },
  {
    dataIndex: 'freightSpaceName',
    key: 'freightSpaceName',
    title: '仓位名称',
    align: 'center',
  },
  {
    dataIndex: 'warehouseName',
    key: 'warehouseName',
    title: '对应仓库',
    align: 'center',
  },
  {
    dataIndex: 'goodsName',
    key: 'goodsName',
    title: '对应物料',
    align: 'center',
  },
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

// 优惠券使用记录
const couponColumns: any[] = [
  {
    dataIndex: 'couponId',
    key: 'couponId',
    title: '券码',
    align: 'center',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: '优惠券名称',
    align: 'center',
  },
  {
    dataIndex: 'couponTypeName',
    key: 'couponTypeName',
    title: '优惠券类型',
    align: 'center',
  },
  {
    dataIndex: 'belongTypeName',
    key: 'belongTypeName',
    title: '优惠券归属',
    align: 'center',
  },
  {
    dataIndex: 'amount',
    key: 'amount',
    title: '面额',
    align: 'center',
    render: (t) => `￥${t}`,
  },
  {
    dataIndex: 'startTime',
    key: 'startTime',
    title: '有效期',
    align: 'center',
    render: (t, r) => `${t}至${r.expireTime}`,
  },
]

// 营销活动使用记录
const activityColumns: any[] = [
  {
    dataIndex: 'promotionId',
    key: 'promotionId',
    title: '活动ID',
    align: 'center',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: '活动名称',
    align: 'center',
  },
  {
    dataIndex: 'promotionTypeName',
    key: 'promotionTypeName',
    title: '活动类型',
    align: 'center',
  },
  {
    dataIndex: 'belongTypeName',
    key: 'belongTypeName',
    title: '活动归属',
    align: 'center',
  },
  {
    dataIndex: 'startTime',
    key: 'startTime',
    title: '活动有效期',
    align: 'center',
    render: (t, r) => `${t}至${r.expireTime}`,
  },
]

const modalPriceActions = createFormActions()
// 总计金额联动框
export const MoneyTotalBox = ({ dataSource, isEditData, setCouponModalVisible }) => {
  const { product, orderMode, sumPrice, amount, orderKind } = dataSource || {}
  const creditsCommodity = orderMode === 24 || orderMode === 25 // @todo 积分或渠道积分下单模式

  const sum = amount || product.products.reduce((prev, next) => prev + Number(next.price || 0), 0)
  const modelRef = useRef<any>({})
  const [freePrice, setFreePrice] = useState<number>(0)
  const handleSetting = () => {
    modelRef.current.setVisible(true)
  }

  const handleConfirm = () => {
    setFreePrice(parseInt(modalPriceActions.getFieldValue('freePrice') || 0))
    modelRef.current.setVisible(false)
  }

  const handlePreivewCoupon = () => {
    setCouponModalVisible(true)
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
              onClick={handlePreivewCoupon}
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
        <div>运费 {isEditData && <SettingOutlined style={{ marginLeft: 8 }} onClick={handleSetting} />}</div>
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
              'x-component-props': {
                labelAlign: 'top',
              },
              properties: {
                freePrice: {
                  type: 'string',
                  title: '设置运费',
                  'x-props': {
                    addonBefore: '￥',
                  },
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

// 自提地址框
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
  title,
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
  const save = async (e) => {
    try {
      const values = await form.validateFields()
      values.price = parseInt(values.price)
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  const cancel = () => {
    console.log('cancel')
    setEditing(false)
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0, width: 140 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `此项为必填项`,
          },
        ]}
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

const OrderProductTable: React.FC<OrderProductTableProps> = (props) => {
  const { ctl, data } = useContext(OrderDetailContext)
  const { product, orderMode, orderKind, orderId } = data || {}
  const creditsCommodity = orderMode === 24 || orderMode === 25 // 积分或渠道积分下单模式
  // 合同下单模式
  const contractOrder = orderKind === OrderKindType.SRM_ORDER

  // srm订单
  const isSrmOrder = SRM_ORDER_MODE_LIST.includes(data.orderMode)
  const [checkProduct, setCheckProduct] = useState<any>({}) // 选中的商品id
  const [selectedProductKeys, setSelectedProductKeys] = useState<React.Key[]>([])
  const warehouseRef = ModalFormTable.useTableRef()
  const couponRef = ModalFormTable.useTableRef()
  const activityRef = ModalFormTable.useTableRef()

  // 判断是否可操作当前表格
  const isEditData = false
  const productComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

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

  const hasLogisticsInfo = (record) =>
    record === product.products[0] ||
    Boolean(record.logisticsOrderId || record.logisticsId || record.logisticsOrderNo || record.logisticsNo)

  const unshippedProducts = product.products.filter((record) => !hasLogisticsInfo(record))

  const rowSelection = {
    selectedRowKeys: selectedProductKeys,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedProductKeys(selectedRowKeys),
    getCheckboxProps: (record) => ({
      disabled: hasLogisticsInfo(record),
    }),
  }

  const productInfoColumns: any[] = [
    {
      title: 'ID',
      dataIndex: 'skuId',
      key: 'skuId',
      width: 80,
    },
    {
      title: isSrmOrder ? '物料名称' : '商品名称',
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
      title: creditsCommodity ? '所需积分' : '单价（元）',
      dataIndex: 'price',
      align: 'left',
      key: 'price',
      editable: isEditData,
      width: 128,
    },
    {
      title: '会员折扣',
      dataIndex: 'discount',
      key: 'discount',
      render: (text, record) => text + '%',
      width: 96,
    },
    {
      title: creditsCommodity ? '兑换数量' : '采购数量',
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
      title: creditsCommodity ? '所需积分小计' : '金额',
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
      title: '操作',
      dataIndex: 'record',
      key: 'record',
      render: (_, record) => (
        <div className={styles.actionList}>
          <Button type="link" onClick={() => handlePreviewWarehouse(record)}>
            查看库存记录
          </Button>
          <Button type="link" onClick={() => handlePreviewActivity(record)}>
            查看活动记录
          </Button>
          {hasLogisticsInfo(record) && <OrderLogisticsAction action="view" />}
        </div>
      ),
      fixed: 'right',
      width: COLUMNS_ACTION_WIDTH,
    },
  ]

  // 订单物料
  const materialInfo: any[] = [
    {
      title: '物料编号',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 80,
    },
    {
      title: '物料名称/规格',
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
      title: '关联报价商品ID/名称/规格/品类/品牌',
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
    {
      title: '单价（元）',
      dataIndex: 'price',
      align: 'left',
      key: 'price',
      width: 128,
    },
    // {
    //   title: '供方库存',
    //   dataIndex: 'stock',
    //   key: 'stock',
    // },
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
      render: (t, r) => (t ? '是' : '否'),
      width: 96,
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      key: 'taxRate',
      render: (t, r) => (t ? `${t}%` : null),
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
  ]

  const fetchWarehouseData = useCallback(
    async (params) => {
      if (checkProduct.skuId) {
        const { data } = await getProductPlatformPositionDeductionRecordList({
          ...params,
          productId: String(checkProduct.skuId),
          stockId: checkProduct.stockId,
        })
        return data
      } else {
        return {
          data: [],
          totalCount: 0,
        }
      }
    },
    [checkProduct],
  )

  const fetchCouponData = useCallback(
    async (params) => {
      const { data, code } = await getOrderVendorDetailCoupon({ ...params, orderId: String(orderId) })
      return code === 1000 ? data : []
    },
    [checkProduct],
  )

  const fetchActivityData = useCallback(
    async (params) => {
      if (checkProduct.orderProductId) {
        const { data, code } = await getOrderVendorDetailPromotion({
          ...params,
          orderProductId: String(checkProduct?.orderProductId),
        })
        return code === 1000 ? data : []
      } else {
        return {
          data: [],
          totalCount: 0,
        }
      }
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
        handleSave: handleSave,
      }),
    }
  })
  return (
    <MellowCard
      title={isSrmOrder || contractOrder ? '订单物料' : '订单商品'}
      extra={
        !contractOrder && unshippedProducts.length ? (
          <OrderLogisticsAction action="shipment" disabled={!selectedProductKeys.length} />
        ) : null
      }
      style={{
        marginTop: themeConfig['@margin-md'],
      }}
      bordered={false}
    >
      <Table
        columns={contractOrder ? materialInfo : columns}
        dataSource={product.products}
        components={productComponents}
        rowKey="orderProductId"
        rowSelection={!contractOrder && unshippedProducts.length ? rowSelection : undefined}
        pagination={false}
        scroll={{ x: 1200 }}
      />
      <MoneyTotalBox
        dataSource={data}
        isEditData={isEditData}
        setCouponModalVisible={() => {
          couponRef.current?.setVisible(true)
        }}
      />

      <ModalFormTable
        modalTitle="营销活动使用记录"
        actionRef={activityRef}
        request={fetchActivityData}
        columns={activityColumns}
        rowKey="id"
        pagination={false}
        onOk={() => activityRef.current?.setVisible(false)}
        modalProps={{
          destroyOnClose: true,
        }}
      />

      <ModalFormTable
        modalTitle="优惠券使用记录"
        actionRef={couponRef}
        request={fetchCouponData}
        columns={couponColumns}
        rowKey="id"
        pagination={false}
        onOk={() => couponRef.current?.setVisible(false)}
        modalProps={{
          destroyOnClose: true,
        }}
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
