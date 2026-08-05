import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import { ModalFormTable, StandardFormTable, ModalFormTableRef } from '@apps/components'
import { useWebIntl } from '@apps/locales'
import { fetchOrderApi } from '../../apis'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { DELIVERY_TYPE, OrderModalType } from '@/constants/order'
import { getLogisticsShipperAddressGet } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { message } from 'antd'

export interface ProductModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  searchSelectMaps?: any
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  confirmModal?: () => any
  tableRef: React.MutableRefObject<ModalFormTableRef>
  selectedIds: number[]
}

export const productColumns = StandardFormTable.createColumns([
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.id' }),
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.name' }),
    dataIndex: 'name',
    key: 'name',
    searchField: {
      main: true,
    },
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.productModalTable.customerCategoryName',
    }),
    dataIndex: 'customerCategoryName',
    key: 'customerCategoryName',
    searchField: {
      type: 'Select',
      name: 'customerCategoryId',
    },
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.productModalTable.brandName',
    }),
    dataIndex: 'brandName',
    key: 'brandName',
    searchField: {
      type: 'Select',
      name: 'brandId',
    },
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.unitName' }),
    dataIndex: 'unitName',

    key: 'unitName',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.productModalTable.stockCount',
    }),
    dataIndex: 'stockCount',

    key: 'stockCount',
  },
])

// 下单类型->商城类型映射
const orderProductShopTypeMaps = {
  [OrderModalType.PURCHASE_ORDER]: 1,
  [OrderModalType.CHANNEL_DIRECT_PURCHASE_ORDER]: 3,
  [OrderModalType.CHANNEL_EXISTING_PURCHASE_ORDER]: 4,
}

export const filterProductDataById = (data, targetData) => {
  return targetData.reduce(async (prev: any[], next) => {
    const { logistics } = next
    // 由于自选商品和购物车商品字段不一致，需手动同步

    next.brand = next.brand || next.brandName
    next.category = next.category || next.customerCategoryName
    next.unit = next.unit || next.unitName
    next.productName = next.productName || next.name
    next.deliverType = next.logistics.sendAddress // 保证和详情编辑字段一致

    if (logistics.deliveryType === 2 && logistics.sendAddress) {
      const { data: _data } = await getLogisticsShipperAddressGet(
        {
          id: logistics.sendAddress,
        },
        { ttl: 60 * 1000, useCache: true },
      )
      logistics.render = { ..._data, deliveryType: logistics.deliveryType }
    } else {
      logistics.render = DELIVERY_TYPE[logistics.deliveryType]
    }

    // 配送方式外置, 用于接口字段冗余
    next.deliveryType = logistics.deliveryType

    // id 存在集合中， 采用target中的数据， 否则采用data中的数据
    const findResult = data.find((v) => v.id === next.id)

    // 由于迭代时，会出现promise的 已完成状态， 需转换一下，实现异步转同步化
    if (!Array.isArray(prev)) {
      // eslint-disable-next-line no-param-reassign
      prev = await prev
    }
    if (findResult) {
      // 已经选中过这一项, 则需要采用原有的商品列表
      prev.push(findResult)
    } else {
      prev.push(next)
    }

    return prev
  }, [])
}

const ProductModalTable: React.FC<ProductModalTableProps> = (props) => {
  const {
    schemaAction,
    confirmModal,
    selectedIds,
    tableRef,
    searchSelectMaps,
    currentRef,
    sectionProps,
    ...restProps
  } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = sectionProps
  const translate = useWebIntl()

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  const handleConfirmProduct = async () => {
    const selectionItems = tableRef.current?.getSelectionItems()
    if (selectionItems.length > 0) {
      const newData = selectionItems.map((v) => {
        v.orderMode = schemaAction.getFieldValue('orderMode')
        v.shopId = schemaAction.getFieldValue('shopId')
        return v
      })
      const products = schemaAction.getFieldValue('products') || []
      const newProducts = await filterProductDataById([], newData)
      schemaAction.setFieldValue('products', [...products, ...newProducts])
      tableRef.current?.setVisible(false)
      tableRef.current?.clearSelection()
    } else {
      message.info(translate('web.common.selectOneRequest'))
    }
  }

  const fetchProductList = (values) => {
    const modelType = schemaAction.getFieldValue('orderMode')
    const supplyMembersId = schemaAction.getFieldValue('vendorMemberId')

    if (supplyMembersId) {
      const params = {
        ...values,
        shopType: orderProductShopTypeMaps[modelType],
        environment: 1,
        memberId: supplyMembersId,
        priceTypeList: 1,
        shopId: schemaAction.getFieldValue('shopId'),
      }
      return fetchOrderApi.getProductList(params)
    }
    return {
      data: [],
      totolCount: 0,
    }
  }

  return (
    <ModalFormTable
      modalTitle={getIntl().formatMessage({
        id: 'purchaseOrder.orderCollect.productModalTable.title',
        defaultMessage: '选择订单商品',
      })}
      actionRef={tableRef}
      width={900}
      columns={productColumns}
      isRowSelection
      rowSelectionType="checkbox"
      request={fetchProductList}
      searchSelectMaps={searchSelectMaps}
      onOk={handleConfirmProduct}
      onClose={() => {
        tableRef.current?.clearSelection()
      }}
      getCheckboxProps={(record) => {
        return {
          disabled: selectedIds.includes(record.id),
        }
      }}
    />
  )
}

ProductModalTable.defaultProps = {}

export default ProductModalTable
