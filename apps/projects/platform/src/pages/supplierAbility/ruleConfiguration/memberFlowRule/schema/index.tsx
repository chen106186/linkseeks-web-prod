/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 16:04:23
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:07:10
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
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
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.memberFlowRule.name.placeholder' }),
                tip: intl.formatMessage({ id: 'member.memberFlowRule.name.tip' }),
                advanced: false,
              },
            },
          },
        },
      },
    },
  },
}
