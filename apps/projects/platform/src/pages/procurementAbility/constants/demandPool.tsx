import { formatTimeString } from '@/utils'
import { Button, TreeSelect } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
import { history } from '@linkseeks/router-manager'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { customAuthUrl as AuthUrl } from '@apps/domains'
const { SHOW_CHILD } = TreeSelect

const translate = getWebIntl()

/** 采购 需求池schmea */
export const demandPoolSchema: any = () => {
  const intl = useIntl()
  return {
    type: 'object',
    properties: {
      mageLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'controllerBtns',
              },
              productNo: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'purchaseRequisition.qingshuruhuohao' }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              colStyle: {
                marginLeft: 20,
              },
            },

            properties: {
              name: {
                type: 'string',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'commodity.goods.addGoods.form.name.message' }),
                },
              },
              categoryIds: {
                type: 'string',
                'x-component': 'TreeSelect',
                'x-component-props': {
                  placeholder: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
                  allowClear: true,
                  style: { width: '180px' },
                  showSearch: true,
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                  expandTrigger: 'hover',
                  multiple: true,
                  treeCheckable: true,
                  maxTagCount: 1,
                  showCheckedStrategy: SHOW_CHILD,
                },
              },
              submit: {
                'x-component': 'Submit',
                'x-component-props': {
                  children: intl.formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
                },
              },
            },
          },
        },
      },
    },
  }
}

/** 需求池 */
export const demandPoolColumns: any = () => {
  const intl = useIntl()

  return [
    {
      title: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
      dataIndex: 'category',
      key: 'category',
      width: 128,
      fixed: 'left',
    },
    {
      title: intl.formatMessage({ id: 'material.code' }),
      dataIndex: 'productNo',
      key: 'productNo',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'material.name' }),
      dataIndex: 'name',
      key: 'name',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.sourceType' }),
      dataIndex: 'sourceTypeName',
      key: 'sourceTypeName',
      width: 96,
    },
    {
      title: translate('web.resource.order.laiyuandanhao'),
      dataIndex: 'sourceNo',
      key: 'sourceNo',
      width: 128,
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            history.push(
              `/procurementAbility/purchaseRequisition/purchaseRequisitionList/preview?id=${record.purchaseRequisitionId}`,
            )
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.danjuzhaiyao' }),
      dataIndex: 'digest',
      key: 'digest',
      width: 192,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.gongyinghuiyuan' }),
      dataIndex: 'vendorMemberName',
      key: 'vendorMemberName',
      width: 160,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.yujiaoriqi' }),
      dataIndex: 'advanceDeliveryDate',
      key: 'advanceDeliveryDate',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseOrder.peisongfangshi' }),
      dataIndex: 'deliveryMethodName',
      key: 'deliveryMethodName',
      width: 96,
    },
    {
      title: intl.formatMessage({ id: 'purchaseAbility.demandPool.deliveryTypeName' }),
      dataIndex: 'deliveryTypeName',
      key: 'deliveryTypeName',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'contract.purchase.address' }),
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 256,
    },
    {
      title: intl.formatMessage({ id: 'purchaseRequisition.yugudanjia' }),
      dataIndex: 'price',
      key: 'price',
      width: 128,
      render: (text) => `${intl.formatMessage({ id: 'common.money' })}${text}`,
    },
    // {
    //   title: intl.formatMessage({ id: 'material.priceLibrary' }),
    //   dataIndex: 'orderPrice',
    //   key: 'orderPrice',
    //   width: 128,
    //   render: (text) => `${intl.formatMessage({ id: 'common.money' })}${text}`
    // },
    {
      title: intl.formatMessage({ id: 'detail.purchase.needCount' }),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseAbility.demandPool.remainQuantity' }),
      dataIndex: 'remainQuantity',
      key: 'remainQuantity',
      width: 128,
    },
    {
      title: intl.formatMessage({ id: 'purchaseAbility.demandPool.transferOrderQuantity' }),
      dataIndex: 'transferOrderQuantity',
      key: 'transferOrderQuantity',
      width: 128,
    },
    // {
    //   title: intl.formatMessage({ id: 'handling.yifahuo' }),
    //   dataIndex: 'deliveryQuantity',
    //   key: 'deliveryQuantity',
    //   width: 128,
    // },
    // {
    //   title: intl.formatMessage({ id: 'handling.yishouhuo' }),
    //   dataIndex: 'receiveQuantity',
    //   key: 'receiveQuantity',
    //   width: 128,
    // },
  ]
}
