import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useModalTable } from '../../model/useModalTable'
import ModalTable from '@/components/ModalTable'
import { columnsSetProduct } from '../../constant'
import { GlobalConfig } from '@/global/config'
import { formProduct } from '../../schema'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import ModalSearch from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import CustomCategorySearch from '@/components/NiceForm/components/CustomCategorySearch'
import SearchSelect from '@/components/NiceForm/components/SearchSelect'
import { clearModalParams } from '@/utils'
import { FormEffectHooks } from '@apps/formily'
import { searchCustomerCategoryOptionEffect } from '../../effect'
import { getProductCommodityUnitPriceStrategyGetStrategyCommodityList } from '@apps/apis'

export interface ProductModalProps {
  type?: 'radio' | 'checkbox'
  schemaAction: ISchemaFormActions | ISchemaFormAsyncActions
  currentRef?: any
}

const ProductModal: React.FC<ProductModalProps> = (props) => {
  const { type = 'radio', schemaAction, currentRef, ...restProps } = props
  const intl = useIntl()

  const { visible, setVisible, rowSelection, rowSelectionCtl } = useModalTable({ type })

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        setVisible,
        visible,
        rowSelectionCtl,
      }
    }
  }, [])

  // 指定商品
  const fetchProductList = async (params) => {
    const values = schemaAction.getFieldState('shopId')['values']
    const res = await getProductCommodityUnitPriceStrategyGetStrategyCommodityList({
      ...params,
      type: values[1]['type'],
      environment: values[1]['environment'],
      shopId: values[0],
      // priceTypeList: '1,2',
    })
    return res.data
  }

  // 商品添加弹窗控制
  const handleOkAddProduct = async () => {
    setVisible(false)
    const selectResult = rowSelectionCtl.selectRow[0]
    if (!selectResult) {
      return null
    }

    schemaAction.setFieldValue('productName', selectResult.name)
    schemaAction.setFieldValue('productId', selectResult.id)
    schemaAction.setFieldValue('minOrder', selectResult.minOrder)

    clearModalParams()
  }

  const handleCancel = () => {
    setVisible(false)
    clearModalParams()
  }

  return (
    <ModalTable
      modalTitle={intl.formatMessage({ id: 'priceManage.priceStrategy.productModal.modalTitle' })}
      confirm={handleOkAddProduct}
      cancel={handleCancel}
      visible={visible}
      columns={columnsSetProduct}
      rowSelection={rowSelection}
      fetchTableData={(params) => fetchProductList(params)}
      formilyProps={{
        ctx: {
          schema: formProduct,
          components: {
            ModalSearch,
            SearchSelect,
            Submit,
            CustomCategorySearch,
          },
          effects: ($, actions) => {
            actions.reset()
            useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
            FormEffectHooks.onFieldChange$('customerCategoryId').subscribe((state) => {
              searchCustomerCategoryOptionEffect(actions, 'customerCategoryId')
            })
          },
        },
      }}
      resetModal={{
        destroyOnClose: true,
      }}
      tableProps={{
        rowKey: 'id',
      }}
    />
  )
}

ProductModal.defaultProps = {}

export default ProductModal
