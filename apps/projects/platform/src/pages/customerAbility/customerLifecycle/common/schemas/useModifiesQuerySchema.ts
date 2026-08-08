/*
 * @Description: 列表查询 schema
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
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
            placeholder: translate('web.resource.member.memberName'),
            align: 'flex-left',
            tip: translate('web.resource.member.tip_kehumingchen'),
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
                placeholder: translate('web.resource.member.shenqingdanhao'),
                allowClear: true,
              },
            },
            changeRequestSummary: {
              type: 'string',
              'x-component-props': {
                placeholder: translate('web.resource.member.shenqingdanzhaiyao'),
                allowClear: true,
              },
            },
            '[changeRequestFromTimeStart, changeRequestFromTimeEnd]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.query.date', defaultMessage: '时间范围(全部)' }),
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
