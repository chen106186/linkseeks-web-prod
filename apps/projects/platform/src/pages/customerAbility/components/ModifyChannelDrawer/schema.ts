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
        title: intl.formatMessage({
          id: 'customerAbility.components.ModifyChannelDrawer.form.channel',
          defaultMessage: '渠道信息',
        }),
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
              title: intl.formatMessage({
                id: 'customerAbility.components.ModifyChannelDrawer.form.upperRelationId',
                defaultMessage: '上级渠道',
              }),
              required: true,
              'x-component-props': {},
            },
            channelLevel: {
              type: 'text',
              title: intl.formatMessage({
                id: 'customerAbility.components.ModifyChannelDrawer.form.channelLevel',
                defaultMessage: '渠道级别',
              }),
            },
            channelTypeId: {
              type: 'string',
              enum: [],
              title: intl.formatMessage({
                id: 'customerAbility.components.ModifyChannelDrawer.form.channelTypeId',
                defaultMessage: '渠道类型',
              }),
              required: true,
              'x-component-props': {},
            },
            areaCodes: {
              type: 'array',
              title: intl.formatMessage({
                id: 'customerAbility.components.ModifyChannelDrawer.form.areaCodes',
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
            remark: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.components.ModifyChannelDrawer.form.remark',
                defaultMessage: '渠道描述',
              }),
              required: true,
              'x-component': 'TextArea',
              'x-component-props': {
                rows: 4,
                placeholder: intl.formatMessage({
                  id: 'customerAbility.components.ModifyChannelDrawer.form.remark.placeholder',
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
      },
    },
  },
}
