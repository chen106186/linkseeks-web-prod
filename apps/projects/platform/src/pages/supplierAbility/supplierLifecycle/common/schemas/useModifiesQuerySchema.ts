/*
 * @Description: 列表查询 schema
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

const useModifiesQuerySchema = (): ISchema => ({
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
            placeholder: intl.formatMessage({ id: 'supplier.profile.name' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'supplier.query.name.tip' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 5,
          },
          properties: {
            changeRequestFormNo: {
              type: 'string',
              'x-component-props': {
                placeholder: '申请单号',
                allowClear: true,
              },
            },
            changeRequestSummary: {
              type: 'string',
              'x-component-props': {
                placeholder: '申请单摘要',
                allowClear: true,
              },
            },
            '[changeRequestFromTimeStart, changeRequestFromTimeEnd]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'supplier.query.date', defaultMessage: '时间范围(全部)' }),
                allowClear: true,
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
})

export default useModifiesQuerySchema
