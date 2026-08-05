import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
/**
 *
 * @param rater 是否评分人评分
 * @param summay 是否汇总的
 * @returns
 */
const useAssessmentProjectSchema = (rater: boolean, summay = false, selfRating = false): ISchema => {
  const detailsItem: ISchema = {
    type: 'object',
    properties: {
      index: {
        type: 'string',
        title: translate('web.common.sortIndex'),
        editable: false,
        'x-component': 'IndexField',
        'x-component-props': {
          style: {
            width: 64,
          },
        },
      },
      standardIndicator: {
        type: 'string',
        title: translate('web.resource.member.biaozhunzhibiao'),
        editable: false,
      },
      scoreRange: {
        type: 'string',
        title: translate('web.resource.member.fenzhifanwei'),
        editable: false,
      },
      scoreStandard: {
        type: 'string',
        title: translate('web.resource.commodity.fenzhibiaozhun'),
        editable: false,
      },
      weight: {
        type: 'string',
        title: translate('web.resource.commodity.quanzhong'),
        editable: false,
        'x-component-props': {
          addonAfter: '%',
        },
      },
      evaluator: {
        type: 'string',
        title: translate('web.resource.member.kaopingren'),
        'x-component': 'EvaluationsEvaluator',
        'x-component-props': {},
        'x-rules': [
          {
            required: true,
            message: translate('web.common.qingxuanze'),
          },
        ],
        editable: !rater && !summay && !selfRating,
      },
      sendAppraisal: {
        type: 'string',
        title: translate('web.resource.member.kaopingrendafen'),
        'x-component': 'Checkbox',
        'x-component-props': {},
        editable: !summay,
      },
      grade: {
        type: 'string',
        title: translate('web.resource.member.kaopingjifen'),
        'x-component-props': {},
        'x-rules': [
          {
            required: true,
            message: translate('web.resource.member.qingshurukaopingjifen'),
          },
          {
            pattern: /^\d*(?:\.\d{0,1})?$/,
            message: translate('web.resource.member.gradepattern'),
          },
        ],
      },
      score: {
        type: 'string',
        title: translate('web.resource.member.defen'),
        editable: false,
      },
      reviewerFeedback: {
        type: 'string',
        title: translate('web.resource.member.kaopingrenfankui'),
        'x-component-props': {},
      },
      files: {
        type: 'string',
        title: translate('web.resource.member.kaopingbaogao'),
        'x-component': 'FormilyUploadFiles',
        'x-component-props': {
          containerStyle: {
            width: 192,
          },
        },
        // 'x-props': {
        //   width: 192,
        // },
      },
    },
  }

  if (rater && !selfRating) {
    delete (detailsItem as any).properties.sendAppraisal
  }

  return {
    type: 'object',
    properties: {
      details: {
        type: 'array',
        title: '',
        required: true,
        'x-component': 'ArrayTable',
        'x-component-props': {
          scroll: { x: 1600 },
          renderMoveDown: () => null,
          renderMoveUp: () => null,
          renderAddition: () => null,
          renderRemove: () => null,
          operationsWidth: '0',
          rowClassName: () => 'editable-row',
        },
        items: detailsItem,
      },
    },
  }
}

export default useAssessmentProjectSchema
