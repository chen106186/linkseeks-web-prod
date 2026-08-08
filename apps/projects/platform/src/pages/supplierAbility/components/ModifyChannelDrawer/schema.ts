/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-07 13:48:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:58:41
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
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'member.components.ModifyChannelDrawer.form.channel' }),
      },
      properties: {
        MEGA_LAYOUT: {
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
              title: intl.formatMessage({ id: 'member.components.ModifyChannelDrawer.form.upperRelationId' }),
              required: true,
              'x-component-props': {},
            },
            channelLevel: {
              type: 'text',
              title: intl.formatMessage({ id: 'member.components.ModifyChannelDrawer.form.channelLevel' }),
            },
            channelTypeId: {
              type: 'string',
              enum: [],
              title: intl.formatMessage({ id: 'member.components.ModifyChannelDrawer.form.channelTypeId' }),
              required: true,
              'x-component-props': {},
            },
            areaCodes: {
              type: 'array',
              title: intl.formatMessage({ id: 'member.components.ModifyChannelDrawer.form.areaCodes' }),
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
            remark: {
              type: 'string',
              title: intl.formatMessage({ id: 'member.components.ModifyChannelDrawer.form.remark' }),
              required: true,
              'x-component': 'TextArea',
              'x-component-props': {
                rows: 4,
                placeholder: intl.formatMessage({
                  id: 'member.components.ModifyChannelDrawer.form.remark.placeholder',
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
      },
    },
  },
}
