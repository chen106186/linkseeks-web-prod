import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const intl = getIntl()
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
          title: intl.formatMessage({ id: 'transaction_components.fahuodizhi' }),
          'x-rules': [
            {
              message: intl.formatMessage({ id: 'transaction_components.qingxuanzefahuodizhi' }),
              required: true,
            },
          ],
        },
        deliveryTime: {
          type: 'string',
          'x-component': 'date',
          title: intl.formatMessage({ id: 'transaction_components.fahuoriqi' }),
          'x-component-props': {
            showTime: true,
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              message: intl.formatMessage({ id: 'transaction_components.qingxuanzefahuoriqi' }),
              required: true,
            },
          ],
        },
        logisticsNo: {
          type: 'string',
          title: intl.formatMessage({ id: 'transaction_components.wuliudanhao' }),
          'x-rules': [
            {
              limitByte: true,
              maxByte: 20,
            },
          ],
        },
        logisticsCompanyId: {
          type: 'string',
          enum: [],
          'x-component-props': {
            showSearch: true,
            optionFilterProp: 'name',
          },
          title: intl.formatMessage({ id: 'transaction_components.wuliugongsi' }),
        },
        outOfStockId: {
          type: 'string',
          title: '发货仓库',
          enum: [],
          visible: false,
          'x-rules': [
            {
              required: true,
              message: '请选择发货仓库',
            },
          ],
        },
        warehouseAdminName: {
          type: 'number',
          title: '仓库管理员名称',
          visible: false,
        },
        products: {
          type: 'array',
          'x-component': 'MultTable',
          'x-component-props': {
            rowKey: 'orderProductId',
            columns: '{{productColumns}}',
            components: '{{productComponents}}',
            span: 24,
            // expandable: "{{productChildren}}",
            // pagination: { size: 'small' }
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

// 商品列  @todo 补充积分类型文案
export const productColumns: any = [
  {
    title: intl.formatMessage({ id: 'transaction_components.shangpinID' }),
    dataIndex: 'skuId',
    align: 'center',
    key: 'skuId',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.shangpinmingcheng' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
    dataIndex: 'category',
    align: 'center',
    key: 'category',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
    dataIndex: 'brand',
    align: 'center',
    key: 'brand',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.danwei' }),
    dataIndex: 'unit',
    align: 'center',
    key: 'unit',
  },
  {
    title: intl.formatMessage({ id: 'order.orderProductPosition' }),
    dataIndex: 'orderProductPositionVOS',
    align: 'center',
    key: 'orderProductPositionVOS',
    isInventory: true,
    render: (text, record) => (
      <>
        {text?.map((item) => (
          <div>
            {item.positionName}:{item.positionQuantity}
          </div>
        ))}
      </>
    ),
  },
  // {
  //   title: intl.formatMessage({id: 'transaction_components.danjia'}),
  //   dataIndex: 'price',
  //   align: 'center',
  //   key: 'price',
  // },
  {
    title: intl.formatMessage({ id: 'transaction_components.yifahuo' }),
    dataIndex: 'delivered',
    align: 'center',
    key: 'delivered',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.weifahuo' }),
    dataIndex: 'leftCount',
    align: 'center',
    key: 'leftCount',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.yishouhuo' }),
    dataIndex: 'received',
    align: 'center',
    key: 'received',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
    dataIndex: 'differCount',
    align: 'center',
    key: 'differCount',
  },
  {
    title: (
      <Tooltip title={intl.formatMessage({ id: 'stockSellStorage.occupiedInventory.tooltips' })}>
        {intl.formatMessage({ id: 'stockSellStorage.occupiedInventory' })}
        <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
      </Tooltip>
    ),
    dataIndex: 'occupyInventoryVOS',
    align: 'center',
    key: 'occupyInventoryVOS',
    isInventory: true,
    render: (text, record) => (
      <>
        {text?.map((item) => (
          <div>
            {item.positionName}:{item.positionQuantity}
          </div>
        ))}
      </>
    ),
  },
  {
    title: (
      <Tooltip title={intl.formatMessage({ id: 'stockSellStorage.availableForDeliveryQuantity.tooltips' })}>
        {intl.formatMessage({ id: 'stockSellStorage.availableForDeliveryQuantity' })}
        <QuestionCircleOutlined style={{ color: '#909399', marginLeft: 5 }} />
      </Tooltip>
    ),
    dataIndex: 'availableForDeliveryQuantity',
    align: 'center',
    key: 'availableForDeliveryQuantity',
    isInventory: true,
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.fahuoshuliang' }),
    dataIndex: 'deliveryCount',
    align: 'left',
    key: 'deliveryCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
]

// 物料列
export const materialColumns: any = [
  {
    title: 'ID',
    dataIndex: 'productId',
    align: 'center',
    key: 'productId',
    className: 'commonHide',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.wuliaobianhao' }),
    dataIndex: 'productNo',
    align: 'center',
    key: 'productNo',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.wuliaomingchengguige' }),
    dataIndex: 'name',
    align: 'center',
    key: 'name',
    // render: (t, r) => `${t}/${r.type}`
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.pinlei' }),
    dataIndex: 'category',
    align: 'center',
    key: 'category',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.pinpai' }),
    dataIndex: 'brand',
    align: 'center',
    key: 'brand',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.danwei' }),
    dataIndex: 'unit',
    align: 'center',
    key: 'unit',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.guanlianbaojiashangpinIDming' }),
    dataIndex: 'quotedSkuId',
    align: 'center',
    key: 'quotedSkuId',
    render: (t, r) => (t ? `${t}/${r.quotedName || ''}/${r.quotedCategory || ''}/${r.quotedBrand || ''}` : ''),
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.caigoushuliang' }),
    dataIndex: 'quantity',
    align: 'center',
    key: 'quantity',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.yifahuo' }),
    dataIndex: 'delivered',
    align: 'center',
    key: 'delivered',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.weifahuo' }),
    dataIndex: 'leftCount',
    align: 'center',
    key: 'leftCount',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.yishouhuo' }),
    dataIndex: 'received',
    align: 'center',
    key: 'received',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.chayishuliang' }),
    dataIndex: 'differCount',
    align: 'center',
    key: 'differCount',
  },
  {
    title: intl.formatMessage({ id: 'transaction_components.fahuoshuliang' }),
    dataIndex: 'deliveryCount',
    align: 'left',
    key: 'deliveryCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
]
