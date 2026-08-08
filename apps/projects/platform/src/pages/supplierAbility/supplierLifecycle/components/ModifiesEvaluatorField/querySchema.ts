import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

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
            placeholder: '搜索',
            align: 'flex-left',
            tip: '输入 姓名 进行搜索',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 3,
          },
          properties: {
            orgName: {
              type: 'string',
              'x-component-props': {
                placeholder: '部门',
                allowClear: true,
              },
            },
            phone: {
              type: 'string',
              'x-component-props': {
                placeholder: '电话',
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'member.management.maintain.query.query', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}
