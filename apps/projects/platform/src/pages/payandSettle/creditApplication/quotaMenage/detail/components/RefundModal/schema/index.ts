/*
 * @Author: XieZhiXiong
 * @Date: 2020-12-30 14:49:11
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-13 11:50:14
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { PATTERN_MAPS } from '@/constants/regExp'

const intl = getIntl()

export const repaymentModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
        full: true,
      },
      properties: {
        repayQuota: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.repayQuota',
          }),
          'x-component-props': {
            placeholder: '',
            addonBefore: intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.repayQuota.addonBefore',
            }),
            step: 0.01,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.repayQuota.message.1',
              }),
            },
            {
              pattern: PATTERN_MAPS.money,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.repayQuota.message.2',
              }),
            },
            {
              validator: (value, rule, callback, source, options) => {
                const tradeType = source?.tradeType
                if (tradeType === 6 && +value > 100000) {
                  return '通联支付时还款金额不能大于100000元'
                }
                return ''
              },
            },
          ],
        },
        amountSlide: {
          type: 'number',
          title: '',
          'x-component': 'range',
          'x-component-props': {
            min: 0,
            // max: 20000,
          },
        },
        tradeType: {
          type: 'number',
          enum: [
            {
              label: intl.formatMessage({
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.tradeType.2',
              }),
              value: 2,
            },
            {
              label: '通联支付',
              value: 6,
            },
          ],
          default: 2,
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.tradeType',
          }),
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.tradeType.placeholder',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.tradeType.message',
              }),
            },
          ],
        },
        tradeChannel: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.tradeChannel',
          }),
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.tradeChannel.placeholder',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.refundModal.schema.repaymentModalSchema.tradeChannel.message',
              }),
            },
          ],
        },
      },
    },
  },
}
