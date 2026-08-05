/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 16:13:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:18:09
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

const formSchema: ISchema = {
  type: 'object',
  properties: {
    tabs: {
      type: 'object',
      'x-component': 'Tab',
      'x-component-props': {
        type: 'card',
      },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'TabPane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'member.memberFlowRule.components.FlowRuleForm.form.basic' }),
          },
          properties: {
            MEGA_LAYOUT1: {
              type: 'object',
              'x-component': 'Mega-Layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                ruleName: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'member.memberFlowRule.components.FlowRuleForm.form.basic.ruleName',
                  }),
                  'x-component-props': {
                    placeholder: intl.formatMessage({
                      id: 'member.memberFlowRule.components.FlowRuleForm.form.basic.ruleName.placeholder',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberFlowRule.components.FlowRuleForm.form.basic.ruleName.placeholder',
                      })} ${intl.formatMessage({
                        id: 'member.memberFlowRule.components.FlowRuleForm.form.basic.ruleName',
                      })}`,
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 48,
                    },
                  ],
                },
                memberRole: {
                  type: 'string',
                  required: true,
                  title: intl.formatMessage({
                    id: 'customerAbility.flowRuleForm.memberRole',
                    defaultMessage: '适用客户角色',
                  }),
                  'x-component': 'MemberRoleFormItem',
                  'x-component-props': {},
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'common.text.pleaseSelect' })} ${intl.formatMessage({
                        id: 'customerAbility.flowRuleForm.memberRole',
                      })}`,
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'TabPane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'customerAbility.flowRuleForm.depotisFlow', defaultMessage: '客户入库流程' }),
          },
          properties: {
            MEGA_LAYOUT1: {
              type: 'object',
              'x-component': 'Mega-Layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                depositoryProcessId: {
                  type: 'string',
                  title: intl.formatMessage({
                    id: 'member.memberFlowRule.components.FlowRuleForm.form.flow.depositoryProcessId',
                  }),
                  'x-component': 'FlowListFormItem',
                  'x-component-props': {
                    dataSource: [],
                    type: 'success',
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'common.text.pleaseSelect' })} ${intl.formatMessage({
                        id: 'member.memberFlowRule.components.FlowRuleForm.form.flow.depositoryProcessId',
                      })}`,
                    },
                  ],
                },
              },
            },
          },
        },
        'tab-3': {
          type: 'object',
          'x-component': 'TabPane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'member.memberFlowRule.components.FlowRuleForm.form.platformConfig' }),
          },
          properties: {
            // MEGA_LAYOUT1: {
            //   type: 'object',
            //   'x-component': 'Mega-Layout',
            //   'x-component-props': {
            //     labelCol: 8,
            //     wrapperCol: 10,
            //     labelAlign: 'left',
            //     grid: true,
            //   },
            //   properties: {
            //     usePlatformConfig: {
            //       type: 'string',
            //       title: "{{ text('平台注册资料', help('会员在平台注册时已填写的资料')) }}",
            //       'x-component': 'CheckboxGroup',
            //       default: '1',
            //       enum: [
            //         { label: '使用平台注册资料(默认)', value: '1' },
            //       ],
            //       'x-component-props': {
            //         disabled: true,
            //       },
            //     },
            //     searchPlatformConfig: {
            //       type: 'object',
            //       'x-component': 'MySearch',
            //       'x-component-props': {
            //         placeholder: '搜索',
            //       },
            //     },
            //   },
            // },
            platformConfigTable: {
              type: 'object',
              'x-component': 'PlatformConfigTable',
              'x-component-props': {
                roleId: 0,
              },
            },
          },
        },
        'tab-4': {
          type: 'object',
          'x-component': 'TabPane',
          'x-component-props': {
            tab: intl.formatMessage({ id: 'member.memberFlowRule.components.FlowRuleForm.form.configIds' }),
          },
          properties: {
            configIds: {
              type: 'string',
              'x-component': 'ComingConfigTable',
              'x-component-props': {},
            },
          },
        },
        'tab-5': {
          type: 'object',
          'x-component': 'TabPane',
          'x-component-props': {
            tab: intl.formatMessage({
              id: 'customerAbility.ruleConfiguration.flowRule.modifies',
              defaultMessage: '客户变更流程',
            }),
          },
          properties: {
            MEGA_LAYOUT1: {
              type: 'object',
              'x-component': 'Mega-Layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 8,
                labelAlign: 'left',
              },
              properties: {
                changedProcessId: {
                  type: 'string',
                  title: intl.formatMessage({ id: 'customerAbility.flowRuleForm.modifyFlow' }),
                  'x-component': 'FlowListFormItem',
                  'x-component-props': {
                    dataSource: [],
                    type: 'warning',
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'common.text.pleaseSelect' })} ${intl.formatMessage({
                        id: 'customerAbility.flowRuleForm.modifyFlow',
                      })}`,
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
}

export default formSchema
