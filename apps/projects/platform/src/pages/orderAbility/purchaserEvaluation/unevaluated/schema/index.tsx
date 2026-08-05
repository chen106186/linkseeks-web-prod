/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-11 19:55:25
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const listSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'purchaserEvaluation.sousuo' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'purchaserEvaluation.shurudingdanhao' }),
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
            digest: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaserEvaluation.dingdanzhaiyao' }),
                allowClear: true,
              },
            },
            memberName: {
              type: 'string',
              default: undefined,
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaserEvaluation.gongyinghuiyuan' }),
                allowClear: true,
              },
            },
            '[createTimeStart, createTimeEnd]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaserEvaluation.xiadanshijian' }),
                allowClear: true,
              },
            },
            orderType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'purchaserEvaluation.dingdanleixing' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'purchaserEvaluation.chaxun' }),
              },
            },
          },
        },
      },
    },
  },
}
