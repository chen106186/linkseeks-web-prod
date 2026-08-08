import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

/**
 * 修改考评打分
 */
export const modifyEvaluateScore: ISchema = {
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
        id: {
          title: 'id',
          type: 'string',
          display: false,
        },
        name: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateProject' })}`,
          type: 'string',
          editable: false,
        },
        content: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.tobeSubmitSummary.schema.projectContent' })}`,
          type: 'string',
          editable: false,
        },
        userName: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluater' })}`,
          type: 'string',
          editable: false,
        },
        sendAppraisal: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.evaluaterScore' })}`,
          type: 'string',
          editable: false,
          'x-component': 'FormilyCheckbox',
        },
        scoreWeight: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.columns.detail.weight' })}`,
          type: 'string',
          'x-rules': [
            {
              pattern: /^\d+$/,
              message: `${intl.formatMessage({ id: 'member.memberEvaluate.tobeSubmitSummary.schema.plzFillInteger' })}`,
            },
          ],
        },
        grade: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateScore' })}`,
          type: 'string',
          'x-rules': [
            {
              pattern: /^((\d+)(\.\d{1,2})?)$/,
              message: intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.plzFillNumberCanTwoDecimal' }),
            },
          ],
        },
        templates: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateTemplate' })}`,
          type: 'object',
          'x-component': 'FormilyUploadFiles',
          'x-component-props': {
            fileContainerClassName: 'customizeFileContainer',
          },
        },
        appraisalReport: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.evaluateReport' })}`,
          type: 'object',
          'x-component': 'FormilyUploadFiles',
          'x-component-props': {
            fileContainerClassName: 'customizeFileContainer',
          },
        },
      },
    },
  },
}

/**
 * 考评结果
 */

export const evaluateScoreRes: ISchema = {
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
        totalScore: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateLastScore' })}`,
          type: 'number',
          default: 0,
          editable: false,
          // require: true,
          // 'x-rules': [
          //   {
          //     required: true,
          //     message: `${intl.formatMessage({ id: 'member.memberEvaluate.tobeSubmitSummary.schema.plzFillEvaluateLastScore'})}`,
          //   },
          //   {
          //     pattern: /^((\d+)(\.\d{1,2})?)$/,
          //     message: intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.plzFillNumberCanTwoDecimal'})
          //   }
          // ],
          // 'x-component-props': {
          //   placeholder: intl.formatMessage({ id: 'member.memberEvaluate.allQuery.schema.plzFillNumberCanTwoDecimal'})
          // }
        },
        result: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.allQuery.detail.evaluateResult' })}`,
          type: 'textarea',
          'x-rules': [
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'member.memberEvaluate.tobeSubmitSummary.schema.plzFillEvaluateResult',
              })}`,
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 120,
            },
          ],
          'x-component-props': {
            placeholder: `${intl.formatMessage({
              id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
            })}`,
          },
        },
        notifyMember: {
          title: `{{ text('${intl.formatMessage({
            id: 'member.memberEvaluate.hooks.useGetDetailCommon.notifyEvaluateResult',
          })}', help('${intl.formatMessage({
            id: 'supplier.supplierEvaluate.tobeSubmitSummary.schema.nofitysupplier',
          })}')) }}`,
          type: 'string',
          'x-component': 'FormilyCheckbox',
        },
        resultAttachments: {
          title: `${intl.formatMessage({ id: 'member.memberEvaluate.hooks.useGetDetailCommon.appendix' })}`,
          type: 'object',
          'x-component': 'FormilyUploadFiles',
          'x-component-props': {
            fileContainerClassName: 'customizeFileContainer',
          },
        },
      },
    },
  },
}
