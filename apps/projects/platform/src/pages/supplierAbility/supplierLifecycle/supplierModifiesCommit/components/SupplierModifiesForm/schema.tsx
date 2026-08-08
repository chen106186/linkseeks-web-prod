import { ISchema } from '@apps/formily'
import {
  SUPPLIER_MODIFIES_BASIC,
  SUPPLIER_MODIFIES_ASSESSMENT_PROJECT,
  SUPPLIER_MODIFIES_ASSESSMENT_RESULT,
  SUPPLIER_MODIFIES_ASSESSMENT_HISTORY,
  // SUPPLIER_MODIFIES_ASSESSMENT_SUPPLYLIST,
} from './config'
import useAssessmentProjectSchema from '../../../common/schemas/useAssessmentProjectSchema2'
import useAssessmentResultSchema from '../../../common/schemas/useAssessmentResultSchema'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const createSchema = (editable = false): ISchema => ({
  type: 'object',
  properties: {
    BASIC_INFO: {
      type: 'object',
      'x-component': 'AnchorPageItemCard',
      'x-component-props': {
        title: translate('web.common.jibenxinxi'),
        anchorKey: SUPPLIER_MODIFIES_BASIC,
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
            labelCol: 6,
            labelAlign: 'left',
          },
          properties: {
            changeRequestSummary: {
              title: translate('web.resource.member.biangengshenqingdanzhaiyao'),
              type: 'string',
              required: true,
              'x-component-props': {
                placeholder: translate('web.common.qingxuanze'),
              },
            },
            targetLifecycleStageName: {
              type: 'string',
              display: false,
            },
            targetLifecycleStageId: {
              title: translate('web.resource.member.daibiangengmubiaojieduan'),
              type: 'string',
              enum: [],
              required: true,
              'x-component-props': {
                placeholder: translate('web.common.qingxuanze'),
              },
            },
            subMember: {
              title: translate('web.resource.member.gongyingshang'),
              type: 'string',
              'x-component': 'SupplierSelect',
              'x-component-props': {},
              'x-rules': [
                {
                  required: true,
                  message: translate('web.common.qingxuanze'),
                },
              ],
            },
            currentLifecycleStageName: {
              title: translate('web.resource.member.dangqianjieduan'),
              type: 'object',
              'x-component': 'ModifiesStatusTag',
            },
            currentLifecycleStageId: {
              title: translate('web.resource.member.dangqianjieduan'),
              type: 'string',
              display: false,
            },
            remark: {
              title: translate('web.common.remark'),
              type: 'string',
              'x-component': 'TextArea',
              'x-component-props': {
                placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 300, chineseNum: 150 }),
                rows: 1,
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 300,
                },
              ],
            },
          },
        },
      },
    },
    ASSESSMENT_PROJECT: {
      type: 'object',
      'x-component': 'AnchorPageItemCard',
      'x-component-props': {
        title: translate('web.resource.member.kaopinxiangmu'),
        anchorKey: SUPPLIER_MODIFIES_ASSESSMENT_PROJECT,
      },
      properties: {
        assessmentProjectCtl: {
          type: 'string',
          'x-component': 'ModifiesAssessmentProjectCtl',
          required: true,
        },
        assessmentProject: {
          type: 'array',
          'x-component': 'TagsPane',
          'x-component-props': {
            tags: [],
          },
          items: useAssessmentProjectSchema(true, !editable, true), // 默认自己评价
          visible: false,
        },
      },
    },
    ASSESSMENT_RESULT: {
      type: 'object',
      'x-component': 'AnchorPageItemCard',
      'x-component-props': {
        title: translate('web.resource.member.kaopinjieguo'),
        anchorKey: SUPPLIER_MODIFIES_ASSESSMENT_RESULT,
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
            labelCol: 6,
            labelAlign: 'left',
          },
          ...useAssessmentResultSchema(),
        },
      },
    },
    ASSESSMENT_HISTORY: {
      type: 'object',
      'x-component': 'AnchorPageItemCard',
      'x-component-props': {
        title: translate('web.resource.member.kaopinjilu'),
        anchorKey: SUPPLIER_MODIFIES_ASSESSMENT_HISTORY,
      },
      properties: {
        ASSESSMENT_HISTORY_LIST: {
          type: 'object',
          'x-component': 'SupplierAssessmentHistory',
          'x-component-props': {},
        },
      },
    },
  },
})

export default createSchema
