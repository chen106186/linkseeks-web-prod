import { ISchema } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import { Cascader } from 'antd'
import TableModal from '@/pages/customerAbility/components/TableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getProductMaterielGetSubMaterielList } from '@apps/apis'
import { fetchBrand, fetchCategoryData, useAsyncCascader } from '../common/useGetTableSearchData'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'

interface Props {
  visible: boolean
  setVisible?: (bool) => void
  handleOnOk?: () => void
  checkedValue?: any[]
  rowSelection?: any
}
export default (props: Props) => {
  const { visible = false, setVisible, handleOnOk, checkedValue = [], rowSelection } = props
  const intl = useIntl()
  const handleFetchData = async (params) => {
    const { data, code } = await getProductMaterielGetSubMaterielList(params)
    if (code === 1000) {
      let list = []
      if (data?.data?.length > 0) {
        list = data.data.map((item) => ({
          name: item?.userName,
          materielNo: item?.code,
          memberId: item?.memberId,
          roleId: item?.memberRoleId,
          userName: item?.contactMemberName,
          phone: item?.contactMemberPhone,
          manufacturer: item?.materialsManufacturer,
          origin: item?.materialsOrigin,
          departure: item?.materialsDeparture,
          deliveryCycle: item?.materialsDeliverPeriod,
          deliveryMethod: item?.materialsDeliveryMethod,
          materialId: item?.id,
          id: item?.id,
          uniqueId: item?.id,
          materialName: item?.name,
          type: item?.type,
          category: item?.customerCategory?.category?.name,
          brand: item?.brand?.name,
          unitName: item?.unitName,
        }))
      }
      return { data: list, totalCount: data?.totalCount || 0 }
    }
  }
  const columns = [
    {
      title: intl.formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
      dataIndex: 'materialName',
    },
    {
      title: intl.formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
      dataIndex: 'type',
    },
    {
      title: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'material.unit', defaultMessage: '单位' }),
      dataIndex: 'unitName',
    },
  ]
  const suppilerSchema: ISchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          userName: {
            type: 'string',
            'x-component': 'Search',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
              align: 'flex-left',
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                justifyContent: 'flex-start',
              },
              colStyle: {
                marginRight: 20,
              },
            },
            properties: {
              name: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
                  allowClear: true,
                },
              },
              categoryId: {
                type: 'string',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
                  allowClear: true,
                  style: { width: '150px' },
                  showSearch: true,
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                },
              },
              brandId: {
                type: 'string',
                enum: [],
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
                  allowClear: true,
                  showSearch: true,
                  style: { width: '150px' },
                },
              },
              type: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
                  allowClear: true,
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: intl.formatMessage({ id: 'balance.accountsReceivable.invoice.schema.submit' }),
                },
              },
            },
          },
        },
      },
    },
  }
  return (
    <TableModal
      rowSelection={rowSelection}
      modalType="Drawer"
      visible={visible}
      onClose={() => setVisible?.(false)}
      title={intl.formatMessage({ id: 'material.add.supplier.material', defaultMessage: '添加供应商物料' })}
      columns={columns}
      schema={suppilerSchema}
      onOk={handleOnOk}
      fetchData={handleFetchData}
      tableProps={{ rowKey: 'materialId' }}
      components={{ Cascader }}
      effects={($, actions) => {
        useStateFilterSearchLinkageEffect($, actions, 'userName', FORM_FILTER_PATH)
        useAsyncCascader('categoryId', fetchCategoryData)
        useAsyncSelect('brandId', fetchBrand, ['name', 'id'])
      }}
      mode={'checkbox'}
    />
  )
}
