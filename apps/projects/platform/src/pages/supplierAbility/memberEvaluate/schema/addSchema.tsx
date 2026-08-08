import { getIntl } from '@linkseeks/i18n'
import { FormPath, ISchema } from '@apps/formily'
import React from 'react'

const intl = getIntl()

export const evaluateAddSchema: ISchema = {
  type: 'object',
  properties: {
    tabs: {
      type: 'object',
      'x-component': 'tab',
      // "x-component-props": {
      //   "defaultActiveKey": "tab-2"
      // },
      properties: {
        'tab-1': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.baseInfo' })}`,
          },
          properties: {
            layout: {
              type: 'object',
              'x-component': 'mega-layout',
              'x-component-props': {
                labelCol: 4,
                wrapperCol: 10,
                labelAlign: 'left',
                full: true,
              },
              properties: {
                subject: {
                  title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTopic' })}`,
                  type: 'string',
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'member.memberEvaluate.schema.add.plzFillEvaluateTopic' })}`,
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 40,
                    },
                  ],
                  'x-component-props': {
                    placeholder: `${intl.formatMessage({
                      id: 'member.memberEvaluate.schema.add.max40CharOr20ChineseChar',
                    })}`,
                  },
                },
                name: {
                  title: `${intl.formatMessage({
                    id: 'supplier.supplierInspection.common.columns.index.supplierName',
                  })}`,
                  type: 'string',
                  'x-component-props': {
                    disabled: true,
                    addonAfter: '{{connectMember}}',
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'supplier.supplierEvaluate.schema.add.plzChoosesupplier',
                      })}`,
                    },
                  ],
                },
                subMemberId: {
                  title: `${intl.formatMessage({ id: 'supplier.management.import.query.supplierId' })}`,
                  type: 'string',
                  display: false,
                },
                subRoleId: {
                  title: `${intl.formatMessage({
                    id: 'member.memberInspection.common.columns.memberColumns.memberRole',
                  })}`,
                  type: 'string',
                  display: false,
                },
                '[appraisalDayStart, appraisalDayEnd]': {
                  title: (
                    <div>
                      {intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateArea' })}
                      <span style={{ color: '#ff4d4f', fontSize: '16px', marginLeft: '4px' }}>*</span>
                    </div>
                  ),
                  type: 'object',
                  'x-component': 'FormilyRangeTime',
                  'x-component-props': {
                    shouldGtCurrent: false,
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'member.memberEvaluate.schema.add.plzChooseTime' })}`,
                    },
                  ],
                },
                completeDay: {
                  title: `${intl.formatMessage({
                    id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateComplateTime',
                  })}`,
                  type: 'date',
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'member.memberEvaluate.schema.add.plzChooseTime' })}`,
                    },
                  ],
                },
                attachments: {
                  title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.appendix' })}`,
                  type: 'array',
                  'x-component': 'FormilyUploadFiles',
                },
              },
            },
          },
        },
        'tab-2': {
          type: 'object',
          'x-component': 'tabpane',
          'x-component-props': {
            tab: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.detail' })}`,
          },
          properties: {
            selectProject: {
              type: 'object',
              'x-component': 'EvaluateProject',
              'x-component-props': {
                // children: '{{selectProject}}',
              },
            },
            items: {
              type: 'array',
              'x-component': 'arraytable',
              'x-component-props': {
                // operations: false,
                renderAddition: '{{renderAddition}}',
                renderRemove: '{{renderListTableRemove}}',
                renderMoveDown: () => null,
                renderMoveUp: () => null,
                operations: {
                  title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
                },
                scroll: {
                  x: '1100px',
                },
              },
              'x-rules': [
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'member.memberEvaluate.schema.add.plzFillEvaluateProject' })}`,
                },
              ],
              items: {
                type: 'object',
                properties: {
                  id: {
                    title: `${intl.formatMessage({
                      id: 'member.memberInspection.common.columns.userColumns.memberSerial',
                    })}`,
                    type: 'string',
                    editable: false,
                    'x-render': (props) => {
                      const numberIndex = FormPath.transform((props as any).name, /\d/, ($1) => {
                        return `${$1}`
                      })
                      return <div style={{ marginBottom: '24px' }}>{+numberIndex + 1}</div>
                    },
                    'x-props': {
                      width: 65,
                      fixed: 'left',
                    },
                    'x-component-props': {},
                  },
                  name: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateProject' })}`,
                    type: 'string',
                    'x-component-props': {},
                    'x-props': {
                      width: 160,
                      fixed: 'left',
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: `${intl.formatMessage({
                          id: 'member.memberEvaluate.schema.add.plzFillEvaluateProject',
                        })}`,
                      },
                    ],
                  },
                  content: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateContent' })}`,
                    type: 'textarea',
                    'x-props': {
                      width: 424,
                    },
                    'x-component-props': {
                      row: 1,
                      style: {
                        height: 32,
                      },
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: `${intl.formatMessage({
                          id: 'member.memberEvaluate.schema.add.plzFillEvaluateContent',
                        })}`,
                      },
                    ],
                  },
                  memberName: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluater' })}`,
                    type: 'object',
                    'x-props': {
                      width: 128,
                    },
                    'x-component': 'FormilySelectMember',
                    'x-component-props': {
                      // children: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.chooseEvaluater'})}`
                      fetchData: '{{fetchUserData}}',
                    },
                    'x-rules': [
                      {
                        required: true,
                        message: `${intl.formatMessage({ id: 'member.memberEvaluate.schema.add.plzChooseEvaluater' })}`,
                      },
                    ],
                    'x-linkages': [
                      {
                        type: 'value:state',
                        target: '..[].*(memberName,name,content)',
                        // true 的时候不能填
                        state: {
                          editable: '{{$value && $value.userId !== 0}}',
                        },
                      },
                    ],
                  },
                  sendAppraisal: {
                    title: `{{ text('${intl.formatMessage({
                      id: 'member.memberEvaluate.columns.detail.evaluaterScore',
                    })}', help('${intl.formatMessage({
                      id: 'member.memberEvaluate.schema.add.needEvaluaterScore',
                    })}')) }}`,
                    type: 'string',
                    'x-component': 'FormilyCheckbox',
                    'x-props': {
                      width: 110,
                    },
                    'x-linkages': [
                      {
                        type: 'value:state',
                        target: '..[].*(grade,reports)',
                        // true 的时候不能填
                        state: {
                          visible: '{{!$value}}',
                        },
                      },
                      {
                        type: 'value:schema',
                        // 考评人打分没勾选， 这几项都为必填
                        target: '..[].*(grade,scoreWeight)',
                        condition: `{{ !$value }}`,
                        schema: {
                          'x-rules': [
                            {
                              required: true,
                            },
                            {
                              pattern: /^\d+$/,
                              message: intl.formatMessage({
                                id: 'member.evaluate.validate.number',
                                defaultMessage: '请填写正整数',
                              }),
                            },
                          ],
                        },
                        otherwise: {
                          'x-rules': [
                            {
                              required: false,
                            },
                            {
                              pattern: /^\d+$/,
                              message: intl.formatMessage({
                                id: 'member.evaluate.validate.number',
                                defaultMessage: '请填写正整数',
                              }),
                            },
                          ],
                        },
                      },
                      {
                        type: 'value:schema',
                        // 考评人打分没勾选， 这几项都为必填
                        target: '..[].*(templates,reports)',
                        condition: `{{ !$value }}`,
                        schema: {
                          'x-rules': [
                            {
                              required: true,
                            },
                          ],
                        },
                        otherwise: {
                          'x-rules': [
                            {
                              required: false,
                            },
                          ],
                        },
                      },
                    ],
                  },
                  scoreWeight: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.schema.add.evaluateWieght' })}`,
                    type: 'string',
                    'x-props': {
                      width: 125,
                    },
                    'x-component-props': {
                      addonAfter: '%',
                    },
                  },
                  grade: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateScore' })}`,
                    type: 'string',
                    'x-props': {
                      width: 95,
                    },
                    'x-component-props': {},
                  },
                  score: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.score' })}`,
                    'x-props': {
                      width: 95,
                    },

                    editable: false,
                    'x-component-props': {},
                    type: 'string',
                  },
                  templates: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTemplate' })}`,
                    type: 'array',
                    'x-component': 'FormilyUploadFiles',
                    'x-component-props': {
                      mode: 'link',
                      buttonText: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.upload' })}`,
                      fileContainerClassName: 'customizeFileContainer',
                      showError: false,
                    },
                    'x-props': {
                      width: 180,
                    },
                  },
                  reports: {
                    title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateReport' })}`,
                    type: 'array',
                    'x-component': 'FormilyUploadFiles',
                    'x-component-props': {
                      mode: 'link',
                      buttonText: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.upload' })}`,
                      fileContainerClassName: 'customizeFileContainer',
                      showError: false,
                    },
                    'x-props': {
                      width: 180,
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

export default evaluateAddSchema
