import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        columns: 1,
      },
      properties: {
        name: {
          type: 'string',
          'x-mega-props': {
            wrapperCol: 12,
          },
          'x-component': 'Search',
          'x-component-props': {
            placeholder: translate('web.common.search'),
            align: 'flex-left',
            tip: translate('web.resource.member.qingshuruxingmingjinxingsousuo'),
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
            org: {
              type: 'string',
              'x-component-props': {
                placeholder: translate('web.resource.member.suoshujigou'),
                allowClear: true,
              },
            },
            jobTitle: {
              type: 'string',
              'x-component-props': {
                placeholder: translate('web.resource.member.zhiwei'),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: translate('web.common.chaxun'),
              },
            },
          },
        },
      },
    },
  },
}
