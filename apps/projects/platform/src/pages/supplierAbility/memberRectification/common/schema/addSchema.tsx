import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import React from 'react'

const intl = getIntl()

export const rectificationAddSchema: ISchema = {
  type: 'object',
  properties: {
    tabs: {
      type: 'object',
      'x-component': 'tab',
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
              },
              properties: {
                subject: {
                  title: `${intl.formatMessage({
                    id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyTopic',
                  })}`,
                  type: 'string',
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberRectification.common.schema.add.plzFillRectifyTopic',
                      })}`,
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 60,
                    },
                  ],
                  'x-component-props': {
                    placeholder: `${intl.formatMessage({ id: 'detail.purchase.placeholder4' })}`,
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
                  title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.schema.add.subRoleId' })}`,
                  type: 'string',
                  display: false,
                },
                '[rectifyDayStart, rectifyDayEnd]': {
                  type: 'object',
                  title: (
                    <div>
                      {intl.formatMessage({
                        id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyDeadline',
                      })}
                      <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
                    </div>
                  ),
                  'x-component': 'FormilyRangeTime',
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberRectification.common.schema.add.plzChooseDeadline',
                      })}`,
                    },
                  ],
                },
                reason: {
                  title: `${intl.formatMessage({
                    id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyReason',
                  })}`,
                  type: 'textarea',
                  'x-component-props': {
                    style: {
                      width: '100%',
                    },
                    placeholder: intl.formatMessage({
                      id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberRectification.common.schema.add.plzFillRectifyReason',
                      })}`,
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 120,
                    },
                  ],
                },
                require: {
                  title: `${intl.formatMessage({
                    id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyRequire',
                  })}`,
                  type: 'textarea',
                  'x-component-props': {
                    style: {
                      width: '100%',
                    },
                    placeholder: intl.formatMessage({
                      id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
                    }),
                  },
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'member.memberRectification.common.schema.add.plzFillRectifyRequire',
                      })}`,
                    },
                    {
                      limitByte: true, // 自定义校验规则
                      maxByte: 120,
                    },
                  ],
                },
                attachments: {
                  title: `${intl.formatMessage({
                    id: 'member.memberRectification.common.schema.add.rectifyAppendix',
                  })}`,
                  type: 'array',
                  'x-component': 'FormilyUploadFiles',
                  'x-rules': [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'common.form.upload.placeholder',
                      })} ${intl.formatMessage({
                        id: 'member.memberRectification.common.schema.add.rectifyAppendix',
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
