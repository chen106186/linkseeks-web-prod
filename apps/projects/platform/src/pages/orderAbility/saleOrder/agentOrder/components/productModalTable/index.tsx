import React, { useEffect } from 'react'
import type { ModalTableProps } from '@/components/ModalTable'
import ModalTable from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import type { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { FormEffectHooks } from '@apps/formily'
import { DELIVERY_TYPE, OrderModalType } from '@/constants/order'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { addOrderModalSchema } from '@/components/ModalTable/schema'
import Search from '@/components/NiceForm/components/Search'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Submit from '@/components/NiceForm/components/Submit'
import DateSelect from '@/components/NiceForm/components/DateSelect'
import { searchBrandOptionEffect, searchCustomerCategoryOptionEffect } from '../../effects'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import CustomInputSearch from '@/components/NiceForm/components/CustomInputSearch'
import { getLogisticsShipperAddressGet } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

export interface ProductModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  confirmModal?: () => any
}

export const productColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.id' }),
    dataIndex: 'id',

    key: 'id',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.productModalTable.name' }),
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => `${name}/${record.commodityAttribute}`,
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.productModalTable.customerCategoryName',
    }),
    dataIndex: 'customerCategoryName',

    key: 'customerCategoryName',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.productModalTable.brandName',
    }),
    dataIndex: 'brandName',

    key: 'brandName',
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
]

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
    // next.price = Object.values(next.unitPrice)[0]

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
  const { schemaAction, confirmModal, currentRef, sectionProps, ...restProps } = props
  const { visible, setVisible, rowSelection, rowSelectionCtl } = sectionProps

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
    schemaAction.setFieldValue('products', [])
    const newData = rowSelectionCtl.selectRow.map((v) => {
      v.orderMode = schemaAction.getFieldValue('orderMode')
      v.shopId = schemaAction.getFieldValue('shopId')
      v.buyerMemberId = schemaAction.getFieldValue('buyerMemberId')
      v.buyerRoleId = schemaAction.getFieldValue('buyerRoleId')
      return v
    })

    schemaAction.setFieldValue('products', await filterProductDataById([], newData))
    confirmModal?.()
    setVisible(false)
  }

  const fetchProductList = (values) => {
    const modelType = schemaAction.getFieldValue('orderMode')
    const buyerMembersId = schemaAction.getFieldValue('buyerMemberId')
    const buyerRoleId = schemaAction.getFieldValue('buyerRoleId')
    const params = {
      ...values,
      shopType: orderProductShopTypeMaps[modelType],
      environment: 1,
      memberId: buyerMembersId,
      memberRoleId: buyerRoleId,
      priceTypeList: 1,
      shopId: schemaAction.getFieldValue('shopId'),
    }
    return fetchOrderApi.getProductList(params)
  }

  return (
    <ModalTable
      modalTitle={getIntl().formatMessage({
        id: 'purchaseOrder.orderCollect.productModalTable.title',
      })}
      width={900}
      columns={productColumns}
      visible={visible}
      confirm={handleConfirmProduct}
      cancel={() => setVisible(false)}
      fetchTableData={fetchProductList}
      rowSelection={rowSelection}
      resetModal={{ destroyOnClose: true, forceRender: true }}
      modalType="none"
      tableProps={{
        rowKey: 'id',
        onRow: (record) => ({
          onClick: () => {
            rowSelectionCtl.appendSelectRow(record)
            rowSelectionCtl.appendSelectRowKeys(record.id)
          },
        }),
      }}
      formilyProps={{
        ctx: {
          schema: addOrderModalSchema,
          components: {
            ModalSearch: Search,
            SearchSelect,
            Submit,
            DateSelect,
            CustomCategorySearch,
            CustomInputSearch,
          },
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            FormEffectHooks.onFieldChange$('customerCategoryId').subscribe(() => {
              searchCustomerCategoryOptionEffect(schemaAction, actions, 'customerCategoryId')
            })
            FormEffectHooks.onFieldChange$('brandId').subscribe(() => {
              searchBrandOptionEffect(schemaAction, actions, 'brandId')
            })
          },
        },
      }}
      {...restProps}
    />
  )
}

ProductModalTable.defaultProps = {}

export default ProductModalTable
