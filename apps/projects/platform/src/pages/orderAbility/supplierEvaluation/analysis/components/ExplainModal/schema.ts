/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-11 14:23:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-11 14:58:47
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        content: {
          type: 'string',
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'supplierEvaluation.zaicishurunideneirong' }),
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'supplierEvaluation.qingshuruneirong' }),
            },
          ],
        },
      },
    },
  },
}

export default schema
