import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { docTime } from '../../common'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        noticeNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'handling.sousuotongzhidanhao' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'handling.shurutongzhidanhaojinhang' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.tongzhidanzhaiyao' }),
                allowClear: true,
              },
            },
            processName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.jiagongqiyeming' }),
                allowClear: true,
              },
            },
            docTime: {
              type: 'string',
              default: 0,
              enum: docTime,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.danjushijianquanbu' }),
                allowClear: true,
              },
            },
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.waibuzhuangtaiquanbu' }),
                allowClear: true,
              },
            },
            innerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.neibuzhuangtaiquanbu' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'handling.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}

/**
 * @description 待生产通知单列表页
 */
export const tobeAddQuerySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              // 'x-component': 'Children',
              // 'x-component-props': {
              //   children: '{{controllerBtns}}',
              // },
              'x-component': 'controllerBtns',
            },
            noticeNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.sousuotongzhidanhao' }),
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
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.tongzhidanzhaiyao' }),
                allowClear: true,
              },
            },
            processName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.jiagongqiyemingcheng' }),
                allowClear: true,
              },
            },
            docTime: {
              type: 'string',
              default: 0,
              enum: docTime,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.danjushijianquanbu' }),
                allowClear: true,
              },
            },
            // outerStatus: {
            //   type: 'string',
            //   default: undefined,
            //   enum: [],
            //   'x-component-props': {
            //     placeholder: intl.formatMessage({id: 'handling.waibuzhuangtaiquanbu'}),
            //     allowClear: true,
            //   },
            // },
            // innerStatus: {
            //   type: 'string',
            //   default: undefined,
            //   enum: [],
            //   'x-component-props': {
            //     placeholder: intl.formatMessage({id: 'handling.neibuzhuangtaiquanbu'}),
            //     allowClear: true,
            //   },
            // },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'handling.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}
