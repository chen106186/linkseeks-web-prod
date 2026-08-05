import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { docTime } from '..'
const intl = getIntl()
export const basicSchema: ISchema = {
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
            placeholder: intl.formatMessage({ id: 'handling.sousuo' }),
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
            supplierName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.gongyinghuiyuan' }),
                allowClear: true,
              },
            },
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.tongzhidanzhaiyao' }),
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
 * 指派生产通知单 -  待审核生产通知单（一级）
 *               -  待审核生产通知单 (二级)
 */

export const pendingFirstQuerySchema: ISchema = {
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
              //   children: '{{batchUpdateBtn}}',
              // },
              'x-component': 'controllerBtns',
            },
            noticeNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.sousuoshengchantongzhidanhao' }),
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
            supplierName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'handling.gongyinghuiyuan' }),
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
