/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 10:39:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-29 18:06:15
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { dateLocale } from '@/components/NiceForm/utils/locale'

const intl = getIntl()

export const blockedModalSchema: ISchema = {
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
          title: intl.formatMessage({ id: 'customerAbility.management.maintain.black.getBlocked.form.date' }),
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'customerAbility.management.maintain.black.getBlocked.form.select.placeholder',
            }),
            locale: dateLocale(),
            style: {
              width: '100%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'customerAbility.management.maintain.black.getBlocked.form.date.placeholder',
              }),
            },
          ],
        },
        reason: {
          type: 'string',
          title: intl.formatMessage({ id: 'customerAbility.management.maintain.black.getBlocked.form.reason' }),
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'customerAbility.management.maintain.black.getBlocked.form.reason.placeholder',
            }),
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'customerAbility.management.maintain.black.getBlocked.form.reason.rules-required',
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
