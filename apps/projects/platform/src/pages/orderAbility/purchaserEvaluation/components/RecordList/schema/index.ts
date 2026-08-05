/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-19 18:08:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-10-19 18:09:31
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'flex-Layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
        },
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        star: {
          type: 'string',
          enum: [
            {
              label: intl.formatMessage({ id: 'purchaserEvaluation.yixing' }),
              value: 1,
            },
            {
              label: intl.formatMessage({ id: 'purchaserEvaluation.erxing' }),
              value: 2,
            },
            {
              label: intl.formatMessage({ id: 'purchaserEvaluation.sanxing' }),
              value: 3,
            },
            {
              label: intl.formatMessage({ id: 'purchaserEvaluation.sixing' }),
              value: 4,
            },
            {
              label: intl.formatMessage({ id: 'purchaserEvaluation.wuxing' }),
              value: 5,
            },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'purchaserEvaluation.pinglunxingji' }),
            allowClear: true,
            style: {
              width: 206,
            },
          },
        },
        '[dealTimeStart, dealTimeEnd]': {
          type: 'string',
          default: '',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'purchaserEvaluation.jiaoyishijian' }),
            allowClear: true,
            style: {
              width: 206,
            },
          },
        },
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'purchaserEvaluation.sousuo' }),
            align: 'flex-left',
            advanced: false,
          },
        },
      },
    },
  },
}
