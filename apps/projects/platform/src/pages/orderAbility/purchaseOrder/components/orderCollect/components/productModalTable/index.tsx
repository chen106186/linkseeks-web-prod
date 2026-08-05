import React, { useEffect } from 'react'
import ModalTable, { ModalTableProps } from '@/components/ModalTable'
import { fetchOrderApi } from '../../apis'
import { FormEffectHooks, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { DELIVERY_TYPE, OrderModalType } from '@/constants/order'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { addOrderModalSchema } from '@/components/ModalTable/schema'
import Search from '@/components/NiceForm/components/Search'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import Submit from '@/components/NiceForm/components/Submit'
import DateSelect from '@/components/NiceForm/components/DateSelect'
import { searchCustomerCategoryOptionEffect } from '../../effects'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import { getLogisticsShipperAddressGet } from '@apps/apis'

export interface ProductModalTableProps extends ModalTableProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
  sectionProps: any
  confirmModal?()
}

export const productColumns: any[] = [
  {
    title: '商品ID',
    dataIndex: 'id',

    key: 'id',
  },
  {
    title: '商品名称',
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: '品类',
    dataIndex: 'customerCategoryName',

    key: 'customerCategoryName',
  },
  {
    title: '品牌',
    dataIndex: 'brandName',

    key: 'brandName',
  },
  {
    title: '单位',
    dataIndex: 'unitName',

    key: 'unitName',
  },
  {
    title: '库存数量',
    dataIndex: 'stockCount',

    key: 'stockCount',
  },
]

// 下单类型->商城类型映射
const orderProductShopTypeMaps = {
  [OrderModalType.HAND_ORDER]: 1,
  [OrderModalType.CONSOLIDATED_ORDER]: 1,
  [OrderModalType.CHANNEL_DIRECT_MINING_ORDER]: 3,
  [OrderModalType.CHANNEL_SPOT_MANUAL_ORDER]: 4,
}

export const filterProductDataById = (data, targetData) => {
  return targetData.reduce(async (prev: any[], next) => {
    const { logistics } = next
    // 由于自选商品和购物车商品字段不一致，需手动同步

    next.brand = next.brand || next.brandName
    next.category = next.category || next.customerCategoryName
    next.unit = next.unit || next.unitName
    next.productName = next.productName || next.name

    // if (logistics.deliveryType === 2) {
    //   const { code, data } = await getLogisticsShipperAddressGet({
    //     id: logistics.sendAddress
    //   }, { ttl: 60 * 1000, useCache: true })
    //   logistics.render = code === 1000 ? <AddressPop pickInfo={data}>{DELIVERY_TYPE[logistics.deliveryType]}</AddressPop> : DELIVERY_TYPE[logistics.deliveryType]
    // } else {
    //   logistics.render = DELIVERY_TYPE[logistics.deliveryType]
    // }
    if (logistics.deliveryType === 2 && logistics.sendAddress) {
      const { code, data } = await getLogisticsShipperAddressGet(
        {
          id: logistics.sendAddress,
        },
        { ttl: 60 * 1000, useCache: true },
      )
      logistics.render = data
    } else {
      logistics.render = DELIVERY_TYPE[logistics.deliveryType]
    }
    // 配送方式外置, 用于接口字段冗余
    next.deliveryType = logistics.deliveryType

    // id 存在集合中， 采用target中的数据， 否则采用data中的数据
    const findResult = data.find((v) => v.id === next.id)

    // 由于迭代时，会出现promise的 已完成状态， 需转换一下，实现异步转同步化
    if (!Array.isArray(prev)) {
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
  const { type = 'checkbox', schemaAction, confirmModal, currentRef, sectionProps, ...restProps } = props
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
    // 判断所选择的商品是否属于同一个工作流
    // @ts-ignore
    const res = await postOrderIsWorkFlow(
      {
        memberId: rowSelectionCtl.selectRow[0].memberId,
        memberRoleId: rowSelectionCtl.selectRow[0].memberRoleId,
        productIds: rowSelectionCtl.selectedRowKeys,
        orderModel: schemaAction.getFieldValue('orderModel'),
      },
      { ctlType: 'none' },
    )

    if (res.code === 1000) {
      const productData = schemaAction.getFieldValue('orderProductRequests')
      schemaAction.setFieldValue(
        'orderProductRequests',
        await filterProductDataById(productData, rowSelectionCtl.selectRow),
      )
      confirmModal && confirmModal()
      setVisible(false)
    }
    // else {
    //   message.error(res.message)
    // }
  }

  const fetchProductList = (values) => {
    const modelType = schemaAction.getFieldValue('orderModel')
    const supplyMembersId = schemaAction.getFieldValue('supplyMembersId')
    const params = {
      ...values,
      shopType: orderProductShopTypeMaps[modelType],
      environment: 1,
      memberId: supplyMembersId,
      // 手工下单/合并订单下单时，查询现货价格商品
      priceTypeList:
        modelType === OrderModalType.CONSOLIDATED_ORDER || modelType === OrderModalType.HAND_ORDER ? [1] : undefined,
      shopId: schemaAction.getFieldValue('shopId'),
    }
    return fetchOrderApi.getProductList(params)
  }

  return (
    <ModalTable
      modalTitle="选择订单商品"
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
          components: { ModalSearch: Search, SearchSelect, Submit, DateSelect, CustomCategorySearch },
          effects: ($, actions) => {
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            // actions.setFieldState('customerCategoryId', state => {
            //   state.props['x-component-props'].queryParams = {
            //     memberId: schemaAction.getFieldValue('supplyMembersId'),
            //     memberRoleId: schemaAction.getFieldValue('supplyMembersRoleId')
            //   }
            // })
            FormEffectHooks.onFieldChange$('customerCategoryId').subscribe((state) => {
              searchCustomerCategoryOptionEffect(schemaAction, actions, 'customerCategoryId')
            })
            actions.setFieldState('brandId', (state) => {
              state.props['x-component-props'].queryParams = {
                memberId: schemaAction.getFieldValue('supplyMembersId'),
                memberRoleId: schemaAction.getFieldValue('supplyMembersRoleId'),
              }
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
