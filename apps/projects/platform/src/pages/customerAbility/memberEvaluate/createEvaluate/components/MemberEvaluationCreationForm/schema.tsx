import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import {
  SUPPLIER_EVALUATIONS_BASIC,
  SUPPLIER_EVALUATIONS_ASSESSMENT_PROJECT,
  SUPPLIER_EVALUATIONS_ASSESSMENT_RESULT,
  // SUPPLIER_EVALUATIONS_ASSESSMENT_HISTORY,
} from './config'
import useAssessmentProjectSchema from '../../common/schemas/useAssessmentProjectSchema'
import useAssessmentResultSchema from '../../common/schemas/useAssessmentResultSchema'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
const createSchema = (mode: 'creation' | 'edition' | 'preview' = 'creation'): ISchema => ({
  type: 'object',
  properties: {
    BASIC_INFO: {
      type: 'object',
      'x-component': 'AnchorPageItemCard',
      'x-component-props': {
        title: translate('web.common.jibenxinxi'),
        anchorKey: SUPPLIER_EVALUATIONS_BASIC,
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            columns: 1,
            autoRow: true,
            labelCol: 5,
            labelAlign: 'left',
            wrapperWidth: 600,
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
              title: translate('web.resource.member.memberName'),
              type: 'string',
              'x-component': 'CustomerSelect',
              'x-component-props': {},
              'x-rules': [
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'customerAbility.evaluation.subMember.required' })}`,
                },
              ],
            },
            subMemberId: {
              title: `${intl.formatMessage({ id: 'supplier.management.import.query.supplierId' })}`,
              type: 'string',
              display: false,
            },
            subRoleId: {
              title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.memberColumns.memberRole' })}`,
              type: 'string',
              display: false,
            },
            '[appraisalDayStart, appraisalDayEnd]': {
              title: (
                <div>{intl.formatMessage({ id: 'member.memberEvaluate.hooks.useEvaluateColumn.evaluateArea' })}</div>
              ),
              type: 'object',
              editable: mode === 'creation',
              'x-component': 'FormilyRangeTime',
              'x-component-props': {
                shouldGtCurrent: false,
                containerStyle: {
                  width: 284,
                },
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
              'x-component-props': {
                style: {
                  width: 600,
                },
              },
              'x-rules': [
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'member.memberEvaluate.schema.add.plzChooseTime' })}`,
                },
              ],
            },
            attachments: {
              title: translate('web.resource.member.zhenggaiyaoqiufujian'),
              type: 'array',
              'x-component': 'FormilyUploadFiles',
            },
          },
        },
      },
    },
    ASSESSMENT_PROJECT: {
      type: 'object',
      'x-component': 'AnchorPageItemCard',
      'x-component-props': {
        title: translate('web.resource.member.kaopinjilu'),
        anchorKey: SUPPLIER_EVALUATIONS_ASSESSMENT_PROJECT,
      },
      properties: {
        assessmentProjectCtl: {
          type: 'string',
          'x-component': 'EvaluationsAssessmentProjectCtl',
          required: true,
          visible: mode === 'creation',
        },
        assessmentProject: {
          type: 'array',
          'x-component': 'TagsPane',
          'x-component-props': {
            tags: [],
          },
          items: useAssessmentProjectSchema(true, false, true), // 默认自己评价
          visible: false,
        },
      },
    },
    ASSESSMENT_RESULT: {
      type: 'object',
      'x-component': 'AnchorPageItemCard',
      'x-component-props': {
        title: translate('web.resource.member.kaopinjieguo'),
        anchorKey: SUPPLIER_EVALUATIONS_ASSESSMENT_RESULT,
      },
      properties: {
        MEGA_LADYOUT_1: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
            full: true,
            columns: 2,
            autoRow: true,
            labelWidth: 144,
            labelAlign: 'left',
          },
          ...useAssessmentResultSchema(),
        },
      },
    },
    // ASSESSMENT_HISTORY: {
    //   type: 'object',
    //   'x-component': 'AnchorPageItemCard',
    //   'x-component-props': {
    //     title: '考评记录',
    //     anchorKey: SUPPLIER_EVALUATIONS_ASSESSMENT_HISTORY,
    //   },
    //   properties: {
    //     ASSESSMENT_HISTORY_LIST: {
    //       type: 'object',
    //       'x-component': 'CustomerAssessmentHistory',
    //       'x-component-props': {},
    //     },
    //   },
    // },
  },
})

export default createSchema
