/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 10:39:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-29 18:13:35
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

export const unfriendModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        date: {
          type: 'string',
          title: intl.formatMessage({ id: 'member.management.maintain.eliminate.remove.form.date' }),
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.qingxuanze' }),
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'member.management.maintain.eliminate.remove.form.date.rules-required',
              }),
            },
          ],
        },
        reason: {
          type: 'string',
          title: intl.formatMessage({ id: 'member.management.maintain.eliminate.remove.form.reason' }),
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.eliminate.remove.form.reason.placeholder',
            }),
            maxLength: 60,
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'member.management.maintain.eliminate.remove.form.reason.rules-required',
              }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 120,
            },
          ],
        },
      },
    },
  },
}
