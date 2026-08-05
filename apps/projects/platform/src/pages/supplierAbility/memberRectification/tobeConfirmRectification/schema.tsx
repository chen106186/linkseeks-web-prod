import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'

const intl = getIntl()

const confirmEditResultSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 5,
        labelAlign: 'left',
        full: true,
      },
      properties: {
        result: {
          title: `${intl.formatMessage({
            id: 'member.memberRectification.common.columns.queryColumns.rectifyResult',
          })}`,
          type: 'string',
          enum: [
            {
              label: `${intl.formatMessage({
                id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyUnPass',
              })}`,
              value: 0,
            },
            {
              label: `${intl.formatMessage({
                id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyPass',
              })}`,
              value: 1,
            },
          ],
          'x-rules': [
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'member.memberRectification.tobeConfirmRectification.schema.plzFillResult',
              })}`,
            },
          ],
          'x-linkages': [
            {
              type: 'value:schema',
              // 考评人打分没勾选， 这几项都为必填
              target: 'reason',
              condition: `{{ $value === 0 }}`,
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
        reason: {
          title: `${intl.formatMessage({
            id: 'member.memberRectification.common.hooks.useGetDetailCommon.resultReason',
          })}`,
          type: 'textarea',
          'x-rules': [
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'member.memberRectification.tobeConfirmRectification.schema.plzFillResultReason',
              })}`,
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 120,
            },
          ],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
            }),
          },
        },
      },
    },
  },
}
export default confirmEditResultSchema

/**
 * 会员考评页scheam
 */
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${intl.formatMessage({
              id: 'supplier.supplierInspection.common.schema.add.searchsupplierName',
            })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({ id: 'supplier.supplierEvaluate.allQuery.schema.searchForsupplierName' })}`,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            subject: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyTopic',
                })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[rectifyDayStart,rectifyDayEnd]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  `${intl.formatMessage({ id: 'member.memberRectification.common.schema.index.rectifyBeginTime' })}`,
                  `${intl.formatMessage({
                    id: 'member.memberRectification.tobeConfirmRectification.schema.rectifyCompleteTime',
                  })}`,
                ],
                allowClear: true,
                style: {
                  width: 240,
                },
              },
            },
            outerStatus: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberRectification.common.columns.queryColumns.outState',
                })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.query' })}`,
              },
            },
          },
        },
      },
    },
  },
}
