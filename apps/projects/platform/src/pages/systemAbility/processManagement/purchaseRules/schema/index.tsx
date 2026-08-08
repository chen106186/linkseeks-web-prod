import React from 'react'
import { ISchema } from '@apps/formily'
import { padRequiredMessage } from '@/utils'
import { getIntl } from '@linkseeks/i18n'

// 新增规则
export const ruleDetailSchema: ISchema = padRequiredMessage({
  type: 'object',
  properties: {
    REPOSIT_TABS: {
      type: 'object',
      'x-component': 'tab',
      'x-component-props': {
        type: 'card',
      },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'processRuleSetting.jibenxinxi', defaultMessage: '基本信息' }),
          },
          properties: {
            MEGA_LAYOUT1: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
                style: { height: '400px' },
              },
              properties: {
                name: {
                  type: 'string',
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.guizemingcheng',
                    defaultMessage: '规则名称',
                  }),
                  'x-component-props': {
                    placeholder: getIntl().formatMessage({
                      id: 'processRuleSetting.qingshuruguize',
                      defaultMessage: '请输入规则名称',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                    },
                    {
                      limitByte: true,
                      maxByte: 48,
                    },
                  ],
                },
                baseProcessId: {
                  type: 'string',
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.liuchengxuanze',
                    defaultMessage: '流程选择',
                  }),
                  'x-component': 'SelectProcesss',
                  'x-mega-props': {
                    style: {
                      full: true,
                    },
                  },
                  'x-component-props': {
                    dataSource: [],
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: getIntl().formatMessage({
                        id: 'processRuleSetting.qingxuanzeliucheng',
                        defaultMessage: '请选择流程配置',
                      }),
                    },
                  ],
                },
                type: {
                  type: 'number',
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.liuchengleixing',
                    defaultMessage: '流程类型',
                  }),
                  visible: false,
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: getIntl().formatMessage({ id: 'processRuleSetting.shiyonghetong', defaultMessage: '适用合同' }),
          },
          properties: {
            MEGA_LAYOUT3: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                labelAlign: 'left',
              },
              properties: {
                allContracts: {
                  type: 'radio',
                  enum: [
                    {
                      label: getIntl().formatMessage({
                        id: 'processRuleSetting.suoyouhetong',
                        defaultMessage: '所有合同(默认)',
                      }),
                      value: true,
                    },
                    {
                      label: getIntl().formatMessage({
                        id: 'processRuleSetting.zhidinghetong',
                        defaultMessage: '指定合同',
                      }),
                      value: false,
                    },
                  ],
                  title: getIntl().formatMessage({
                    id: 'processRuleSetting.shiyonghetong',
                    defaultMessage: '适用合同',
                  }),
                  default: true,
                  required: true,
                  'x-linkages': [
                    {
                      type: 'value:visible',
                      target: 'contracts',
                      condition: '{{!$value}}',
                    },
                  ],
                },
                contracts: {
                  type: 'array:number',
                  'x-component': 'MultTable',
                  'x-component-props': {
                    rowKey: 'id',
                    columns: '{{tableColumns}}',
                    prefix: '{{tableAddButton}}',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
})
