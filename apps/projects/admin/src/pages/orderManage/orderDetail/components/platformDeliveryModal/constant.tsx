import type { ISchema } from '@apps/formily'

export const schema: ISchema = {
  type: 'object',
  properties: {
    NO_SUBMIT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        autoRow: true,
        labelCol: 4,
        labelAlign: 'left',
        columns: 2,
      },
      properties: {
        addressId: {
          type: 'string',
          'x-component': 'CustomAddressSelect',
          enum: [],
          title: '发货地址',
          'x-rules': [{ required: true, message: '请选择发货地址' }],
        },
        deliveryTime: {
          type: 'string',
          'x-component': 'date',
          title: '发货日期',
          'x-component-props': {
            showTime: true,
            style: { width: '100%' },
          },
          'x-rules': [{ required: true, message: '请选择发货日期' }],
        },
        logisticsNo: {
          type: 'string',
          title: '物流单号',
        },
        logisticsCompanyId: {
          type: 'string',
          enum: [],
          'x-component-props': {
            showSearch: true,
            optionFilterProp: 'name',
          },
          title: '物流公司',
        },
        products: {
          type: 'array',
          'x-component': 'MultTable',
          'x-component-props': {
            rowKey: 'orderProductId',
            columns: '{{productColumns}}',
            components: '{{productComponents}}',
            span: 24,
          },
        },
        address: {
          type: 'string',
          display: false,
        },
        company: {
          type: 'string',
          display: false,
        },
        companyCode: {
          type: 'string',
          display: false,
        },
      },
    },
  },
}

export const productColumns: any[] = [
  { title: '商品ID', dataIndex: 'skuId', align: 'center', key: 'skuId' },
  { title: '商品名称', dataIndex: 'name', align: 'center', key: 'name' },
  { title: '品类', dataIndex: 'category', align: 'center', key: 'category' },
  { title: '品牌', dataIndex: 'brand', align: 'center', key: 'brand' },
  { title: '单位', dataIndex: 'unit', align: 'center', key: 'unit' },
  { title: '已发货', dataIndex: 'delivered', align: 'center', key: 'delivered' },
  { title: '未发货', dataIndex: 'leftCount', align: 'center', key: 'leftCount' },
  { title: '已收货', dataIndex: 'received', align: 'center', key: 'received' },
  { title: '差异数量', dataIndex: 'differCount', align: 'center', key: 'differCount' },
  {
    title: '发货数量',
    dataIndex: 'deliveryCount',
    align: 'left',
    key: 'deliveryCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
]
