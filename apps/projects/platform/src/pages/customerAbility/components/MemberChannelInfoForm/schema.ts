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
              title: intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfoForm.channelLevel',
                defaultMessage: '渠道级别',
              }),
            },
            channelTypeId: {
              type: 'string',
              enum: [],
              title: intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfoForm.channelTypeId',
                defaultMessage: '渠道类型',
              }),
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
              title: intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfoForm.upperRelationId',
                defaultMessage: '上级渠道',
              }),
              required: true,
              'x-component-props': {},
            },
            remark: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfoForm.remark',
                defaultMessage: '渠道描述',
              }),
              required: true,
              'x-component': 'TextArea',
              'x-component-props': {
                // rows: 4,
                placeholder: intl.formatMessage({
                  id: 'customerAbility.components.MemberChannelInfoForm.remark.placeholder',
                  defaultMessage: '最大200个字符，100个汉字',
                }),
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
              title: intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfoForm.areaCodes',
                defaultMessage: '代理城市',
              }),
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
