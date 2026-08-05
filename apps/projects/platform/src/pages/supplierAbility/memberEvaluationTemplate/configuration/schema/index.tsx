import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()

/** 基本信息 */
const basicInfo: ISchema = {
  'x-index': 0,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: translate('web.common.jibenxinxi'),
    id: 'basicInfo',
  },
  properties: {
    NO_SUBMIT_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperWidth: 600,
        labelAlign: 'left',
        grid: true,
        full: true,
        autoRow: true,
        columns: 1,
      },
      properties: {
        id: {
          type: 'number',
          visible: false,
        },
        templateName: {
          type: 'string',
          title: translate('web.resource.member.pingfenmubanmingcheng'),
          'x-component-props': {
            placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 20, chineseNum: 10 }),
          },
          'x-rules': [
            {
              required: true,
              message: translate('web.resource.member.qingtianxiepingfenmubanmingcheng'),
            },
            {
              limitByte: true,
              maxByte: 20,
              placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 20, chineseNum: 10 }),
            },
          ],
        },
        templateType: {
          title: translate('web.resource.member.pingfenmubanleixing'),
          'x-component': 'Select',
          'x-component-props': {
            placeholder: translate('web.common.qingxuanze'),
          },
          'x-rules': [
            {
              required: true,
              message: translate('web.resource.member.qingxuanzepingfenmubanleixing'),
            },
          ],
          enum: [],
        },
        templateDescribe: {
          type: 'string',
          title: translate('web.resource.member.pingfenmubanshuoming'),
          'x-component': 'textarea',
          'x-component-props': {
            placeholder: translate('web.common.tip_byteLengthLimit', { byteNum: 80, chineseNum: 40 }),
            rows: 1,
          },
          'x-rules': [
            {
              limitByte: true,
              maxByte: 80,
              message: translate('web.common.tip_byteLengthLimit', { byteNum: 80, chineseNum: 40 }),
            },
          ],
        },
      },
    },
  },
}

/** 标准指标 */
const targetDefinition: ISchema = {
  'x-index': 1,
  type: 'object',
  'x-component': 'MellowCard',
  'x-component-props': {
    title: translate('web.resource.member.biaozhunzhibiao'),
    id: 'targetDefinition',
  },
  properties: {
    templateIndicatorSubmitListCtl: {
      type: 'string',
      'x-component': 'TemplateIndicatorSubmitListCtl',
      'x-rules': [
        {
          required: true,
          message: translate('web.resource.member.qingxuanzebiaozhunzhibiao'),
        },
      ],
    },
    templateIndicatorSubmitList: {
      type: 'array',
      'x-component': 'TagsPane',
      'x-component-props': {
        size: 'large',
        extra: '{{TagsExtra}}',
        closable: '{{areTagsEditable}}',
        onTagsChange: '{{handleTagsPaneTagsChange}}',
      },
      items: {
        type: 'object',
        'x-component-props': {
          sortable: '{{areTagsEditable}}',
        },
        properties: {
          details: {
            type: 'array',
            'x-component': 'TemplateIndicatorSubmitList',
            'x-component-props': {},
          },
        },
      },
      visible: false,
    },
  },
}

/** 新增表单 schema */
export const memberEvaluationTemplateFormSchema: ISchema = {
  type: 'object',
  properties: {
    basicInfo,
    targetDefinition,
  },
}

/** 列表查询 schema */
export const memberEvaluationTemplateListQuerySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'OperationButtons',
            },
            templateName: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'supplier.memberEvaluationTemplate.query.templateName.placeholder',
                  defaultMessage: '搜索',
                }),
                tip: intl.formatMessage({
                  id: 'supplier.memberEvaluationTemplate.query.templateName.tip',
                  defaultMessage: '输入 评分模板名称 进行搜索',
                }),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            id: {
              type: 'number',
              default: undefined,
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'supplier.memberEvaluationTemplate.query.id.placeholder',
                  defaultMessage: '评分模板ID',
                }),
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
                children: intl.formatMessage({
                  id: 'supplier.memberEvaluationTemplate.query.query',
                  defaultMessage: '查询',
                }),
              },
            },
          },
        },
      },
    },
  },
}
