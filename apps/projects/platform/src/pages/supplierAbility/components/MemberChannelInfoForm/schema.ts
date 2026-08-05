/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-27 10:41:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:36:49
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

export const schema: ISchema = {
  type: 'object',
  properties: {
    INVESTIGATE_INFO: {
      type: 'object',
      'x-component': 'ColumnLayout',
      'x-component-props': {},
      properties: {
        MEGA_LAYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 20,
            labelAlign: 'left',
          },
          properties: {
            channelLevel: {
              type: 'text',
              title: intl.formatMessage({ id: 'member.components.MemberChannelInfoForm.channelLevel' }),
            },
            channelTypeId: {
              type: 'string',
              enum: [],
              title: intl.formatMessage({ id: 'member.components.MemberChannelInfoForm.channelTypeId' }),
              required: true,
              'x-component-props': {},
            },
          },
        },
        MEGA_LAYOUT_2: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 20,
            labelAlign: 'left',
          },
          properties: {
            upperRelationId: {
              type: 'string',
              enum: [],
              title: intl.formatMessage({ id: 'member.components.MemberChannelInfoForm.upperRelationId' }),
              required: true,
              'x-component-props': {},
            },
            remark: {
              type: 'string',
              title: intl.formatMessage({ id: 'member.components.MemberChannelInfoForm.remark' }),
              required: true,
              'x-component': 'TextArea',
              'x-component-props': {
                // rows: 4,
                placeholder: intl.formatMessage({ id: 'member.components.MemberChannelInfoForm.remark.placeholder' }),
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 200,
                },
              ],
            },
          },
        },
        MEGA_LAYOUT_3: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 20,
            labelAlign: 'left',
          },
          properties: {
            areaCodes: {
              type: 'array',
              title: intl.formatMessage({ id: 'member.components.MemberChannelInfoForm.areaCodes' }),
              required: true,
              'x-component': 'CustomAddArray',
              default: [],
              items: {
                type: 'object',
                properties: {
                  provinceCode: {
                    type: 'string',
                    enum: [],
                    'x-component-props': {
                      allowClear: true,
                    },
                  },
                  cityCode: {
                    type: 'string',
                    enum: [],
                    'x-component-props': {
                      allowClear: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}
