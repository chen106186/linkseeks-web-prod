import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
/** 采购竞价 - 采购竞价单查询 */
export const PURCHASEBIDORDER_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        biddingNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.biddingNo' }),
            align: 'flex-left',
            allowClear: true,
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
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.biddingDetails' }),
                allowClear: true,
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder18' }),
                allowClear: true,
              },
            },
            externalState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
                style: {
                  width: 160,
                },
                allowClear: true,
              },
              enum: [],
            },
            interiorState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
                style: {
                  width: 160,
                },
                allowClear: true,
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

/** 采购竞价 - 待新增采购竞价单&待审核(一级)&待审核(二级)&待审核结果(一级)&待审核结果(二级)&待提交审核结果 */
export const PURCHASEBIDREADYADD_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
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
        biddingNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.biddingNo' }),
            allowClear: true,
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
        colStyle: {},
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
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.biddingDetails' }),
                allowClear: true,
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder18' }),
                allowClear: true,
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

/** 采购竞价 - 待审核竞价报名&待确认&待审核报名&待提交 */
export const PURCHASEBIDOSIGNUP_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        biddingNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.biddingNo' }),
            align: 'flex-left',
            allowClear: true,
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
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.biddingDetails' }),
                allowClear: true,
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder18' }),
                allowClear: true,
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
