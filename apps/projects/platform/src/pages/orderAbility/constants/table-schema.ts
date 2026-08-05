import { getPurchaseOrderSelectOption, getSaleOrderSelectOption } from '../assets/effect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

/**
 * 采购订单高级筛选 公用
 */

export const tableListSchema: any = () => {
  const res = getPurchaseOrderSelectOption()
  if (res) {
    const {
      orderTypes: OrderType,
      innerStatus: PurchaseOrderInsideWorkStateTexts,
      outerStatus: PurchaseOrderOutWorkStateTexts,
    } = res

    return {
      type: 'object',
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
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            FLEX_END_LAYOUT: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-end',
                },
                colStyle: {
                  marginLeft: 16,
                },
              },
              properties: {
                orderNo: {
                  type: 'object',
                  'x-component': 'Search',
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.orderNo' }),
                    align: 'flex-end',
                  },
                },
                columnsConfigure: {
                  type: 'object',
                  'x-component': 'EnhanceCustomColumnsConfigure',
                },
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
            },
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            digest: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.digest' }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.memberName' }),
              },
            },
            orderType: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.orderType' }),
              },
              enum: OrderType.map((item) => ({
                label: item.text,
                value: item.id,
              })),
            },
            outerStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'common.text.pleaseSelect',
                })}${intl.formatMessage({ id: 'purchaseOrder.waibuzhuangtai' })}`,
              },
              enum: PurchaseOrderOutWorkStateTexts.map((item) => ({
                label: item.text,
                value: item.id,
              })),
            },
            innerStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseRequisition.qingxuanzeneibu' }),
              },
              enum: PurchaseOrderInsideWorkStateTexts.map((item) => ({
                label: item.text,
                value: item.id,
              })),
            },
            '[startDate, endDate]': {
              type: 'daterange',
              // "x-component": 'DateRangePickerUnix',
              'x-component-props': {
                // showTime: true,
                placeholder: [
                  intl.formatMessage({ id: 'purchaseRequisition.kaishishijian' }),
                  intl.formatMessage({ id: 'purchaseRequisition.jieshushijian' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-component-props': {
                children: intl.formatMessage({ id: 'purchaseRequisition.chaxun' }),
              },
            },
          },
        },
      },
    }
  }
}

/**
 * 销售订单高级筛选 销售订单查询
 */

export const saleTableListSchema: any = () => {
  const res = getSaleOrderSelectOption()
  if (res) {
    const {
      orderTypes: OrderType,
      innerStatus: SaleOrderInsideWorkStateTexts,
      outerStatus: SaleOrderOutWorkStateTexts,
    } = res

    return {
      type: 'object',
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
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            FLEX_END_LAYOUT: {
              type: 'object',
              'x-component': 'flex-layout',
              'x-component-props': {
                rowStyle: {
                  justifyContent: 'flex-end',
                },
                colStyle: {
                  marginLeft: 16,
                },
              },
              properties: {
                orderNo: {
                  type: 'object',
                  'x-component': 'Search',
                  'x-component-props': {
                    placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.orderNo' }),
                    align: 'flex-end',
                  },
                },
                columnsConfigure: {
                  type: 'object',
                  'x-component': 'EnhanceCustomColumnsConfigure',
                },
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
            },
            colStyle: {
              marginLeft: 20,
            },
          },

          properties: {
            digest: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.digest' }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'saleOrder.qingshurucaigouMemberName' }),
              },
            },
            orderType: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'saleOrder.qingxuanzedingdanOrderType' }),
              },
              enum: OrderType.map((item) => ({
                label: item.text,
                value: item.id,
              })),
            },
            outerStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'common.text.pleaseSelect',
                })}${intl.formatMessage({ id: 'purchaseOrder.waibuzhuangtai' })}`,
              },
              enum: SaleOrderOutWorkStateTexts.map((item) => ({
                label: item.text,
                value: item.id,
              })),
            },
            innerStatus: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaseRequisition.qingxuanzeneibu' }),
              },
              enum: SaleOrderInsideWorkStateTexts.map((item) => ({
                label: item.text,
                value: item.id,
              })),
            },
            '[startDate,endDate]': {
              type: 'daterange',
              // "x-component": 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'purchaseRequisition.kaishishijian' }),
                  intl.formatMessage({ id: 'purchaseRequisition.jieshushijian' }),
                ],
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-component-props': {
                children: intl.formatMessage({ id: 'purchaseRequisition.chaxun' }),
              },
            },
          },
        },
      },
    }
  }
}
