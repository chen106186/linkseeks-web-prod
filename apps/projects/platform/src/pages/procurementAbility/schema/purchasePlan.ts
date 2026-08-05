import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/** 采购需求查询 */
export const PURCHASEPLANSERCH_SECHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchasePlanNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.purchasePlanNo' }),
            align: 'flex-left',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
            rowStyle: {
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
            },
            colStyle: {
              //改变间隔
              marginRight: 20,
            },
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendSummary' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
              },
            },
            innerStatusList: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
          },
        },
      },
    },
  },
}

/** 待提交审核采购计划(一级) & (二级) & 待提交审核采购计划 & 待执行采购计划 */
export const PURCHASEPLAN_SECHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchasePlanNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.purchasePlanNo' }),
            align: 'flex-left',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
            rowStyle: {
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
            },
            colStyle: {
              //改变间隔
              marginRight: 20,
            },
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.summary' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
              },
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
          },
        },
      },
    },
  },
}
