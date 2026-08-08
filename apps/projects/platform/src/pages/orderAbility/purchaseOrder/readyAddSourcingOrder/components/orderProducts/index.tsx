import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Button } from '@linkseeks/ui'
import { Form, message, Modal, Select, Table, Row, Col } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { accAdd, accMul } from '@apps/utils'
import { PlusIcon } from '@linkseeks/icons'
import { StandardFormTable } from '@apps/components'
import { postLogisticsFreightTemplateCalFreightPrice, getProductFreightGetCommoditySkuStockList } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import { useOrder } from '../../orderProvider'
import { orderProductColumns } from '../../constants/columns'

export interface ProductItemType {
  /**
   * 上游供应商会员Id
   */
  supplyMemberId?: number
  /**
   * 上游供应商会员角色Id
   */
  supplyRoleId?: number
  /**
   * 上游供应商会员名称
   */
  supplyMemberName?: string
  /**
   * 商品Id
   */
  productId: number
  /**
   * 商品SkuId
   */
  skuId: number
  /**
   * 渠道商品库存Id
   */
  stockId?: number
  /**
   * 购物车Id
   */
  cartId?: number
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品品类
   */
  category: string
  /**
   * 商品品牌
   */
  brand?: string
  /**
   * 计价单位
   */
  unit: string
  /**
   * 商品Logo Url
   */
  logo: string
  /**
   * 商品规格
   */
  spec?: string
  /**
   * 商品价格
   */
  price: number
  /**
   * 商品价格类型，1-现货价格，2-询价价格，3-积分兑换，4-赠品
   */
  priceType: number
  /**
   * 会员折扣（百分比的分子部分）
   */
  discount?: number
  /**
   * 采购数量
   */
  quantity: number
  /**
   * 是否含税（true-含税，false-不含税）
   */
  tax?: boolean
  /**
   * 税率（百分比的分子部分）
   */
  taxRate?: number
  /**
   * 商品配送方式：1-物流，2-自提，3-无需配送
   */
  deliveryType: number
  /**
   * 供方库存
   */
  stock?: number
  /**
   * 商品重量，配送方式为物流时要大于0
   */
  weight?: number
  /**
   * 物流运费模板Id,配送方式为物流时要大于0
   */
  logisticsTemplateId?: number
  /**
   * 自提地址（如配送方式为自提，必填）
   */
  address?: string
  /**
   * 接收人（如配送方式为自提，必填）
   */
  receiver?: string
  /**
   * 接收人电话（如配送方式为自提，必填）
   */
  phone?: string
  shopId?: number
  shopName?: string
}

interface IProps {
  value?: ProductItemType[]
  onChange?: (value: ProductItemType[]) => void
}

const OrderProducts: React.FC<IProps> = (props) => {
  const { value } = props
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [freightPrice, setFreightPrice] = useState<number>(0)

  const tableRef = StandardFormTable.useTableRef()
  const { form, skuList } = useOrder()

  const consignee = Form.useWatch('consignee', form)
  const translate = useWebIntl()

  const DELIVERY_TYPE = {
    1: translate('web.resource.mall.wuliu'),
    2: translate('web.resource.mall.ziti'),
    3: translate('web.resource.mall.wuxupeisong'),
    4: translate('web.resource.commodity.wuliuleixing3'),
  }

  /** 获取运费 */
  const getFreightPrice = (receiverAddressId: number) => {
    const orderProductList: any[] = []
    if (value && value.length > 0) {
      for (const item of value) {
        if (item.deliveryType === 1 && item.logisticsTemplateId) {
          orderProductList.push({
            templateId: item.logisticsTemplateId,
            weight: item.weight || 0,
            count: item.quantity || 0,
          })
        }
      }
    }
    const paload: any = {
      orderProductList,
      receiverAddressId,
    }
    postLogisticsFreightTemplateCalFreightPrice(paload, { ctlType: 'none' }).then((res) => {
      if (res.code === 1000) {
        setFreightPrice(res.data || 0)
      }
    })
  }

  useEffect(() => {
    const receiverAddressId = consignee?.id
    if (value && value.length > 0 && receiverAddressId) {
      getFreightPrice(receiverAddressId)
    }
  }, [value, consignee])

  const handleDeleteItem = (skuId: number) => {
    const products = form.getFieldValue('products')
    form.setFieldValue(
      'products',
      products.filter((item) => item.skuId !== skuId),
    )
  }

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'skuId',
    },
    {
      title: translate('web.resource.commodity.name'),
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'category',
    },
    {
      title: translate('web.resource.mall.brand'),
      dataIndex: 'brand',
    },
    {
      title: translate('web.common.unit'),
      dataIndex: 'unit',
    },
    {
      title: translate('web.common.danjia'),
      dataIndex: 'price',
    },
    {
      title: translate('web.resource.mall.kucun'),
      dataIndex: 'stock',
    },
    {
      title: translate('web.resource.order.caigoushuliang'),
      dataIndex: 'quantity',
    },
    {
      title: translate('web.resource.commodity.shifouhanshui'),
      dataIndex: 'tax',
      render: (tax) => (tax ? translate('web.common.shi') : translate('web.common.fou')),
    },
    {
      title: translate('web.resource.payment.shuilv'),
      dataIndex: 'taxRate',
    },
    {
      title: translate('web.resource.payment.jine'),
      dataIndex: 'amount',
      render: (_, record) => accMul(record.price, record.quantity),
    },
    {
      title: translate('web.resource.logistics.peisongfangshi'),
      dataIndex: 'deliveryType',
      width: 120,
      render: (deliveryType, record, index) => {
        if (record.editDeliveryType) {
          return (
            <Form.Item name={['products', index, 'deliveryType']} initialValue={1} noStyle>
              <Select>
                <Select.Option value={1}>{translate('web.resource.mall.wuliu')}</Select.Option>
                <Select.Option value={2}>{translate('web.resource.mall.ziti')}</Select.Option>
              </Select>
            </Form.Item>
          )
        } else {
          return DELIVERY_TYPE[deliveryType] || ''
        }
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'ctl',
      render: (_, record) => (
        <Button type="link" onClick={() => handleDeleteItem(record.skuId)}>
          {translate('web.common.delete')}
        </Button>
      ),
    },
  ]

  const handleSelect = () => {
    tableRef.current.clearSelection()
    setModalVisible(true)
  }

  /**
   * 获取sku商品库存
   */
  const getSkuStocks = async (selectProducts: any[]) => {
    const param: any = {
      shopIdList: selectProducts.map((item) => item.shopId),
      commoditySkuIdList: selectProducts.map((item) => item.skuId),
    }
    const list = form.getFieldValue('products') || []
    form.setFieldValue('shopId', selectProducts[0].shopId)
    form.setFieldValue('shopName', selectProducts[0].shopName)
    const res = await getProductFreightGetCommoditySkuStockList(param)
    if (res.code === 1000) {
      const stockList = res.data
      const result = selectProducts.map((item) => {
        const stockInfo = stockList.find((stockItem) => stockItem.commoditySkuId === item.skuId)
        if (stockInfo) {
          return {
            ...item,
            stock: stockInfo.stock,
          }
        }
        return item
      })
      form.setFieldValue('products', [...list, ...result])
    } else {
      form.setFieldValue('products', [...list, ...selectProducts])
    }
    setModalVisible(false)
    tableRef.current.clearSelection()
  }

  const handleSelectProduct = async () => {
    const selectItems = tableRef.current.getSelectionItems()
    if (selectItems.length === 0) {
      message.info(translate('web.common.selectOneRequest'))
      return
    } else {
      if (!selectItems.every((item) => item.shopId === selectItems[0].shopId)) {
        message.info(translate('web.resource.order.qingxuanzecaigouqudaoyizhideshangpin'))
        return
      }
    }
    getSkuStocks(selectItems)
  }

  const productAmount = useMemo(() => {
    if (value && value.length > 0) {
      return value.reduce((accumulator, current) => {
        return accumulator + accMul(current.price, current.quantity)
      }, 0)
    }
    return 0
  }, [value])

  const amount = useMemo(() => {
    return accAdd(productAmount, freightPrice)
  }, [productAmount, freightPrice])

  useEffect(() => {
    if (tableRef && tableRef.current.reload) {
      tableRef.current.reload()
    }
  }, [skuList])

  return (
    <Fragment>
      <Button icon={<PlusIcon />} block style={{ marginBottom: 16 }} onClick={handleSelect}>
        {translate('web.resource.order.xuanzedingdanshangpin')}
      </Button>
      <Table columns={columns} dataSource={value || []} pagination={false} rowKey="skuId" />
      <Row style={{ marginTop: 12 }} justify="end">
        <Col span={2}>
          <div style={{ marginBottom: 12 }}>{translate('web.resource.order.hejijine')}</div>
          <div>{productAmount}</div>
        </Col>
        <Col span={2}>
          <div style={{ marginBottom: 12 }}>{translate('web.resource.order.yunfei')}</div>
          <div>{freightPrice}</div>
        </Col>
        <Col span={2}>
          <div style={{ marginBottom: 12 }}>{translate('web.resource.order.zongjijine')}</div>
          <div>{amount}</div>
        </Col>
      </Row>
      <Modal
        open={modalVisible}
        title={translate('web.resource.order.xuanzexiadanshangpin')}
        width={800}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setModalVisible(false)}
        forceRender
        onOk={() => {
          handleSelectProduct()
        }}
      >
        <StandardFormTable
          rowKey="skuId"
          isRowSelection
          getCheckboxProps={(record) => {
            const shopIds = value?.map((item) => item.shopId)
            return {
              disabled:
                value?.map((item) => item.skuId).includes(record.skuId) ||
                (shopIds && shopIds.length > 0 && !shopIds.includes(record.shopId)),
            }
          }}
          actionRef={tableRef}
          tableProps={{
            pagination: false,
          }}
          request={() => ({
            data: skuList || [],
            totalCount: skuList?.length || 0,
          })}
          columns={orderProductColumns}
        />
      </Modal>
    </Fragment>
  )
}

export default OrderProducts
