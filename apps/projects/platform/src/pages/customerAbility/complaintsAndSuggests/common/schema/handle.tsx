/**
 * 处理投诉建议schema
 */

import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const handleFormSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        full: true,
        labelAlign: 'left',
      },
      properties: {
        handleResult: {
          title: `${intl.formatMessage({
            id: 'member.complaintsAndSuggests.common.hooks.useGetAnchorHeader.dealResult',
          })}`,
          type: 'string',
          'x-rules': [
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'member.complaintsAndSuggests.common.schema.handle.plzFillDealResult',
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
        handleTime: {
          title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.dealTime' })}`,
          type: 'date',
          'x-component-props': {
            format: 'YYYY-MM-DD HH:mm:ss',
          },
          'x-rules': [
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'member.complaintsAndSuggests.common.schema.handle.plzChooseDealTime',
              })}`,
            },
          ],
        },
        handleUserEditName: {
          title: `${intl.formatMessage({
            id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.dealMan',
          })}`,
          type: 'string',
          // "x-component": 'FormilySelectMember',
          // "x-component-props": {
          //   customizeRender: "{{connectMember}}",
          //   fetchData: "{{handleFetchUserData}}"
          // },
          'x-component-props': {
            addonAfter: '{{connectUser}}',
          },
          'x-rules': [
            {
              required: true,
              message: `${intl.formatMessage({ id: 'supplier.supplierEvaluate.schema.add.plzChoosesupplier' })}`,
            },
          ],
        },
        handleUserId: {
          title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.schema.handle.dealId' })}`,
          type: 'string',
          display: false,
          'x-component-props': {},
        },
        handleUserEditPhone: {
          type: 'string',
          title: `${intl.formatMessage({
            id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.dealPhone',
          })}`,
          // 'x-component': 'FormilyCountryPhone',
          'x-component-props': {},
          // enum: [
          //   {
          //     label: '123',
          //     value: '123'
          //   }
          // ]
        },
        handleAttachments: {
          title: `${intl.formatMessage({
            id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.deakAppendix',
          })}`,
          type: 'object',
          'x-component': 'FormilyUploadFiles',
        },
      },
    },
  },
}
