import { useToggle } from '@linkseeks/hooks'
import { Modal, Table, message } from '@linkseeks/ui'
import { useIntl } from '@linkseeks/i18n'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { StandardFormTable } from '@apps/components'
import { getProductMaterielGetConfirmedMaterielList } from '@apps/apis'
import { useProductForm, useCustomerCategoryIdField, useBrandIdField } from '@apps/services/commodity'
import { useWebIntl } from '@apps/locales'
const MaterialModal = forwardRef((props, ref) => {
  const [visible, toggle] = useToggle()
  const intl = useIntl()
  const actionRef = useRef<any>({})
  const { setMaterialDataSource } = useProductForm()
  const customerCategoryValue = useCustomerCategoryIdField()
  const brandValue = useBrandIdField()
  const translate = useWebIntl()
  useImperativeHandle(ref, () => {
    return {
      toggle: () => {
        if (!customerCategoryValue) {
          message.error(translate('web.resource.commodity.qingxuanzepinlei'))
          return
        }

        toggle()
      },
    }
  })

  /**
   * 选择条件自带以下两个
   * 物料关联品类 = 当前商品选择的品类；
   * 物料关联品牌 = 当前商品选择品牌（无选择则无需）
   */
  const getMaterialData = async (params) => {
    const customerCategoryId = customerCategoryValue[customerCategoryValue.length - 1]
    const { data } = await getProductMaterielGetConfirmedMaterielList({
      customerCategoryId: customerCategoryId,
      brandId: brandValue,
      ...params,
    })
    return data
  }
  const columns: any = [
    {
      title: intl.formatMessage({
        id: 'commodity.products.addProductsItem.selectGoodsForm.goodsColumns.materialCode',
      }),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.products.addProductsItem.selectGoodsForm.goodsColumns.materialName',
      }),
      dataIndex: 'name',
      key: 'name',
      searchField: {
        main: true,
      },
    },
    {
      title: intl.formatMessage({
        id: 'commodity.products.addProductsItem.selectGoodsForm.goodsColumns.materialGroup',
      }),
      dataIndex: ['materialGroup', 'name'],
      key: 'materialGroup',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.products.addProductsItem.selectGoodsForm.goodsColumns.type',
      }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.products.addProductsItem.selectGoodsForm.goodsColumns.customerCategory',
      }),
      dataIndex: ['customerCategory', 'name'],
      key: 'customerCategory',
    },
    {
      title: intl.formatMessage({
        id: 'commodity.products.addProductsItem.selectGoodsForm.goodsColumns.brand',
      }),
      dataIndex: ['brand', 'name'],
      key: 'brand',
    },
    {
      title: translate('web.common.unit'),
      key: 'unitName',
    },
    {
      title: translate('web.resource.commodity.chenbenjia'),
      dataIndex: 'costPrice',
      key: 'costPrice',
    },
  ]

  const handleSubmit = () => {
    setMaterialDataSource(actionRef.current.getSelectionItems())
    toggle()
  }
  return (
    <Modal open={visible} onCancel={toggle} closable onOk={handleSubmit} width={1000} title="关联物料" destroyOnClose>
      <StandardFormTable columns={columns} actionRef={actionRef} request={getMaterialData} rowKey="id" isRowSelection />
    </Modal>
  )
})

export default MaterialModal
