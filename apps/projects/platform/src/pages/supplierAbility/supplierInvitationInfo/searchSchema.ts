import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const searchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'common.text.search', defaultMessage: '搜索' }),
            tip: intl.formatMessage({
              id: 'supplier.invitationInfo.tip',
              defaultMessage: '输入 邀请方客户名称 进行搜索',
            }),
            align: 'flex-left',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 8,
          },
          properties: {
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'supplier.invitationInfo.query.date.placeholder',
                  defaultMessage: '时间范围(全部)',
                }),
                allowClear: true,
                style: {
                  mainWidth: 180,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'common.button.search', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}

export default searchSchema
