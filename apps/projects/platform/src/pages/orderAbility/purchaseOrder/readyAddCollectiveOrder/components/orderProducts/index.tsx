import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Button } from '@linkseeks/ui'
import { Form, message, Modal, Select, Row, Col } from 'antd'
import { accAdd, accMul } from '@apps/utils'
import { EditFillIcon, PlusIcon } from '@linkseeks/icons'
import { StandardFormTable } from '@apps/components'
import {
  postLogisticsFreightTemplateCalFreightPrice,
  getProductFreightGetCommoditySkuStockList,
  getPurchaseQuotedPriceGetQuoteCommodityList,
  getLogisticsSelectListMemberShipperAddress,
  getPurchaseOnlineBiddingGetQuoteCommodityList,
} from '@apps/apis'
import useEditTable from '@apps/components/src/web/StandardFormTable/hooks/useEditTable'
import { useWebIntl } from '@apps/locales'
import { useOrder } from '../../orderProvider'
import { orderProductColumns, biddingOrderProductColumns } from '../../constants/columns'
import { INQUIRY_SOURCE_TYPE } from '../../form'

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
  id: number
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
  sourceType?: number
  onChange?: (value: ProductItemType[]) => void
}

const OrderProducts: React.FC<IProps> = (props) => {
  const { value, sourceType } = props
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [freightPrice, setFreightPrice] = useState<number>(0)
  const tableRef = StandardFormTable.useTableRef()
  const { form, skuList, productsRef } = useOrder()
  const editTableProps = useEditTable({ rowKey: 'skuId' })
  const consignee = Form.useWatch('consignee', form)
  const quotedPriceId = Form.useWatch('quoteId')
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
    if (orderProductList.length === 0) {
      setFreightPrice(0)
      return
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
    productsRef.current.reload()
  }

  const handleEdit = (record) => {
    editTableProps.handleEdit(record)
    editTableProps.editForm.setFieldsValue(record)
  }

  const handleSaveCount = async (record) => {
    const payload = await editTableProps.editForm.validateFields()
    const products = form.getFieldValue('products')
    form.setFieldValue(
      'products',
      products.map((item) => {
        if (item.skuId === record.skuId) {
          return {
            ...item,
            quantity: payload.quantity,
          }
        } else {
          return item
        }
      }),
    )
    editTableProps.setEditKey('')
    productsRef.current.reload()
  }

  const columns = StandardFormTable.createColumns([
    {
      title: 'ID',
      dataIndex: 'skuId',
      key: 'skuId',
    },
    {
      title: translate('web.resource.commodity.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: translate('web.resource.commodity.category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: translate('web.resource.mall.brand'),
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: translate('web.common.unit'),
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: translate('web.common.danjia'),
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: translate('web.resource.mall.kucun'),
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: translate('web.resource.order.caigoushuliang'),
      dataIndex: 'quantity',
      key: 'quantity',
      editable: true,
      render: (text: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
          <EditFillIcon
            color="#91959B"
            size={14}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleEdit(record)
            }}
          />
        </div>
      ),
    },
    {
      title: translate('web.resource.commodity.shifouhanshui'),
      dataIndex: 'tax',
      key: 'tax',
      render: (tax) => (tax ? translate('web.common.shi') : translate('web.common.fou')),
    },
    {
      title: translate('web.resource.payment.shuilv'),
      dataIndex: 'taxRate',
      key: 'taxRate',
      render: (taxProbability) => `${taxProbability}%`,
    },
    {
      title: translate('web.resource.payment.jine'),
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record) => accMul(record.price, record.quantity),
    },
    {
      title: translate('web.resource.logistics.peisongfangshi'),
      dataIndex: 'deliveryType',
      key: 'deliveryType',
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
      key: 'ctl',
      fixed: 'right',
      format: 'Control',
      formatPayload: {
        controlList: [
          {
            children: translate('web.common.save'),
            onClick: handleSaveCount,
            show: (record) => editTableProps.validateEditStatus(record.skuId),
          },
          {
            children: translate('web.common.cancel'),
            onClick: editTableProps.handleCancel,
            show: (record) => editTableProps.validateEditStatus(record.skuId),
          },
          {
            children: translate('web.common.delete'),
            onClick: (record) => handleDeleteItem(record.skuId),
            key: 'delete',
            danger: true,
            show: (record) => !editTableProps.validateEditStatus(record.skuId),
          },
        ],
        hiddenBound: 10,
      },
    },
  ])

  const handleSelect = () => {
    if (quotedPriceId) {
      tableRef.current.clearSelection()
      tableRef.current.reload()
      setModalVisible(true)
    } else {
      message.warning(translate('web.resource.order.qingxuanzebaojiadan'))
    }
  }

  /**
   * 获取sku商品库存
   */
  const getSkuStocks = async (selectProducts: any[]) => {
    const param: any = {
      shopIdList: selectProducts.map((item) => item.shopId),
      commoditySkuIdList: selectProducts.map((item) =>
        sourceType === INQUIRY_SOURCE_TYPE ? item.productId : item.commoditySkuId,
      ),
    }
    let resultList: any[] = []
    const list = form.getFieldValue('products') || []
    form.setFieldValue('shopId', selectProducts[0].shopId)
    form.setFieldValue('shopName', selectProducts[0].shopName)
    const res = await getProductFreightGetCommoditySkuStockList(param)
    if (res.code === 1000) {
      const stockList = res.data
      const result = selectProducts.map((item) => {
        const stockInfo = stockList.find((stockItem) => stockItem.commoditySkuId === item.productId)
        if (stockInfo) {
          return {
            ...item,
            stock: stockInfo.stock,
          }
        }
        return item
      })
      resultList = [...list, ...result]
    } else {
      resultList = [...list, ...selectProducts]
    }
    let selfPickupAddress: any = undefined
    if (resultList.some((item) => item.logistics?.deliveryType === 2 || item.logistics?.deliveryType === 4)) {
      const { data: deliveryAddress } = await getLogisticsSelectListMemberShipperAddress({
        memberId: resultList[0].memberId,
        roleId: resultList[0].memberRoleId,
      })
      if (deliveryAddress && deliveryAddress.length > 0) {
        selfPickupAddress = deliveryAddress[0]
      }
    }

    resultList = resultList.map((item) => {
      return {
        productId: item.commodityId,
        skuId: sourceType === INQUIRY_SOURCE_TYPE ? item.productId : item.commoditySkuId,
        name: sourceType === INQUIRY_SOURCE_TYPE ? item.productName : item.commodityName,
        category: sourceType === INQUIRY_SOURCE_TYPE ? item.productCategory : item.commodityCategory,
        brand: sourceType === INQUIRY_SOURCE_TYPE ? item.productBrand : item.commodityBrand,
        memberId: item.memberId,
        memberRoleId: item.memberRoleId,
        unit: item.unit,
        logo: item.commodityLogo,
        spec: item.productAttributeJson,
        price: sourceType === INQUIRY_SOURCE_TYPE ? item.taxUnitPrice : item.unitPrice,
        priceType: item.priceType,
        quantity: item?.purchaseCount || 1,
        discount: 1,
        tax: item.isTax ? true : false,
        taxRate: sourceType === INQUIRY_SOURCE_TYPE ? item.taxProbability : item.taxRate,
        isCrossBorder: item.isCrossBorder || false,
        deliveryType: item.logistics?.deliveryType === 4 ? 1 : item.logistics?.deliveryType || 1,
        editDeliveryType: item.logistics?.deliveryType === 4 ? true : false,
        stock: item.stockCount || 0,
        weight: item.logistics.weight,
        logisticsTemplateId: item.logistics.templateId,
        shopId: item?.shopId,
        shopName: item?.shopName,
        address: selfPickupAddress?.fullAddress,
        receiver: selfPickupAddress?.shipperName,
        phone: selfPickupAddress?.phone,
      }
    })
    form.setFieldValue('products', resultList)
    setModalVisible(false)
    tableRef.current.clearSelection()
    productsRef.current.reload()
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

  const fetchDate = async (param: any) => {
    if (quotedPriceId) {
      if (sourceType === INQUIRY_SOURCE_TYPE) {
        const res = await getPurchaseQuotedPriceGetQuoteCommodityList({
          ...param,
          quotedPriceId,
        })
        return res.data
      } else {
        const res = await getPurchaseOnlineBiddingGetQuoteCommodityList({
          ...param,
          biddingQuotedId: quotedPriceId,
        })
        return res.data
      }
    }
    return {
      data: [],
      totalCount: 0,
    }
  }

  return (
    <Fragment>
      <Button icon={<PlusIcon />} block style={{ marginBottom: 16 }} onClick={handleSelect}>
        {translate('web.resource.order.xuanzedingdanshangpin')}
      </Button>
      <StandardFormTable
        actionRef={productsRef as any}
        columns={columns}
        dataSource={value || []}
        pagination={false}
        editableProps={editTableProps}
        rowKey="skuId"
        request={() => {
          return {
            data: value || [],
            totalCount: value?.length || 0,
          }
        }}
      />
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
        width={860}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setModalVisible(false)}
        forceRender
        onOk={() => {
          handleSelectProduct()
        }}
      >
        <StandardFormTable
          rowKey={'id'}
          isRowSelection
          autoScrollX
          getCheckboxProps={(record) => {
            const shopIds = value?.map((item) => item.shopId)
            return {
              disabled:
                value
                  ?.map((item) => item.productId)
                  .includes(sourceType === INQUIRY_SOURCE_TYPE ? record.productId : record.commodityId) ||
                (shopIds && shopIds.length > 0 && !shopIds.includes(record.shopId)),
            }
          }}
          actionRef={tableRef}
          tableProps={{
            pagination: false,
          }}
          request={fetchDate}
          columns={sourceType === INQUIRY_SOURCE_TYPE ? orderProductColumns : biddingOrderProductColumns}
        />
      </Modal>
    </Fragment>
  )
}

export default OrderProducts
