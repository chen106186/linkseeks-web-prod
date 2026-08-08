import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const useAssessmentResultSchema = (): ISchema => {
  return {
    properties: {
      totalScore: {
        title: translate('web.resource.member.zuizhongpingfenfenshu'),
        type: 'string',
        editable: false,
      },
      notifyMember: {
        title: `{{ text('${translate('web.resource.member.tongzhikehubiangengjieguo')}', help('${translate(
          'web.resource.member.biangengdanshenhetongguohou',
        )}')) }}`,
        type: 'string',
        'x-component': 'Checkbox',
        'x-component-props': {},
        required: true,
      },
      scoringResult: {
        title: translate('web.resource.member.pingfenjieguo'),
        type: 'string',
        'x-component': 'RadioGroup',
        'x-component-props': {},
        enum: [
          {
            label: translate('web.resource.member.tongyibiangeng'),
            value: 1,
          },
          {
            label: translate('web.resource.member.butongyibiangeng'),
            value: 0,
          },
        ],
        required: true,
      },
      resultAttachments: {
        type: 'string',
        title: translate('web.resource.member.fujian'),
        'x-component': 'FormilyUploadFiles',
        'x-component-props': {},
      },
      scoringResultContent: {
        type: 'string',
        title: translate('web.resource.member.yuanyin'),
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
    },
  }
}

export default useAssessmentResultSchema
