/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-02 10:04:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 16:50:24
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

export const schema: ISchema = {
  type: 'object',
  properties: {
    VERIFY_APPLY: {
      type: 'object',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.drawer.form.title' }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 18,
            labelAlign: 'left',
          },
          properties: {
            agree: {
              type: 'string',
              title: intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.drawer.form.agree' }),
              default: 1,
              'x-component': 'Radio',
              required: true,
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'member.management.memberPrVerifyComingData.drawer.form.agree.pass',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'member.management.memberPrVerifyComingData.drawer.form.agree.noPass',
                  }),
                  value: 0,
                },
              ],
              'x-component-props': {},
            },
            reason: {
              type: 'string',
              title: intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.drawer.form.reason' }),
              'x-component': 'Textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.memberPrVerifyComingData.drawer.form.placeholder',
                }),
                rows: 5,
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 120,
                },
              ],
            },
          },
        },
      },
    },
  },
}
