import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const modalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        autoRow: true,
        columns: 1,
        labelCol: 6,
        wrapperCol: 18,
        labelAlign: 'left',
      },
      properties: {
        formData: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              visible: false,
            },
            eightDRectificationNo: {
              type: 'string',
              visible: false,
            },
            cancelTime: {
              type: 'string',
              title: intl.formatMessage({
                id: 'eightD.quxiaoshijian',
                defaultMessage: '取消时间',
              }),
              required: true,
              'x-component-props': {
                disabled: true,
              },
            },
            cancelReason: {
              type: 'string',
              title: intl.formatMessage({
                id: 'eightD.quxiaoyuanyin',
                defaultMessage: '取消原因',
              }),
              'x-component': 'TextArea',
              required: true,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'eightD.zuida100gezifu50ge',
                  defaultMessage: '最大100个字符,50个文字',
                }),
                row: 3,
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'eightD.quxiaoyuanyinbukeweikong',
                    defaultMessage: '取消原因不可为空',
                  }),
                },
                {
                  limitByte: true,
                  maxByte: 100,
                },
              ],
            },
          },
        },
      },
    },
  },
}
