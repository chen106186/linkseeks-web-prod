/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 15:51:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-04 10:44:01
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'

const intl = getIntl()

export const editModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
        // full: true,
      },
      properties: {
        quota: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.quota',
          }),
          'x-component-props': {
            placeholder: '',
            addonBefore: intl.formatMessage({
              id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.quota.addonBefore',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.quota.message',
              }),
            },
          ],
        },
        quotaSlide: {
          type: 'number',
          title: '',
          'x-component': 'range',
          'x-component-props': {
            min: 0,
            // max: 1024,
            // marks: {
            //   0: {
            //     label: '{{MinMarks}}',
            //   },
            //   1024: {
            //     label: '{{MaxMarks}}',
            //   },
            // },
            step: 0.01,
            style: {
              width: '95%',
              margin: '0 20px 28px',
            },
          },
        },
        billDay: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.billDay',
          }),
          'x-component-props': {
            placeholder: '',
            addonAfter: intl.formatMessage({
              id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.billDay.addonBefore',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.billDay.message.1',
              }),
            },
            {
              pattern: PATTERN_MAPS.quantity,
              message: intl.formatMessage({
                id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.billDay.message.2',
              }),
            },
            {
              validator(value) {
                const intVal = +value
                return intVal > 28 || intVal < 0
                  ? intl.formatMessage({
                      id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.billDay.message.3',
                    })
                  : ''
              },
            },
          ],
        },
        repayPeriod: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.repayPeriod',
          }),
          'x-component-props': {
            placeholder: '',
            addonAfter: intl.formatMessage({
              id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.repayPeriod.addonAfter',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.repayPeriod.message.1',
              }),
            },
            {
              pattern: PATTERN_MAPS.quantity,
              message: intl.formatMessage({
                id: 'payandSettle.creditManage.components.quotaApplicationInfo.editModalSchema.repayPeriod.message.2',
              }),
            },
          ],
        },
      },
    },
  },
}
