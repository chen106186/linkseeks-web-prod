import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const useAssessmentResultSchema = (): ISchema => {
  return {
    properties: {
      totalScore: {
        title: translate('web.resource.member.kaopingzuizhongfenshu'),
        type: 'string',
        editable: false,
      },
      notifyMember: {
        title: `{{ text('${translate('web.resource.member.tongzhikehukaopingjieguo')}', help('${translate(
          'web.resource.member.biangengdanshenhetongguohou',
        )}')) }}`,
        type: 'string',
        'x-mega-props': {
          labelWidth: 160,
        },
        'x-component': 'Checkbox',
        'x-component-props': {},
        required: true,
      },
      result: {
        type: 'string',
        title: translate('web.resource.member.kaopinjieguo'),
        'x-component': 'TextArea',
        'x-component-props': {
          placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 120, chineseNum: 60 }),
          rows: 1,
        },
        'x-rules': [
          {
            required: true,
          },
          {
            limitByte: true, // 自定义校验规则
            maxByte: 120,
          },
        ],
      },
      resultAttachments: {
        type: 'string',
        title: translate('web.resource.member.fujian'),
        'x-mega-props': {
          labelWidth: 160,
        },
        'x-component': 'FormilyUploadFiles',
        'x-component-props': {},
      },
    },
  }
}

export default useAssessmentResultSchema
