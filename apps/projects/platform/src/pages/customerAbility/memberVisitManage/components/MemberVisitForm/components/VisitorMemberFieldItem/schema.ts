import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

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
            placeholder: intl.formatMessage({
              id: 'member.memberVisitManage.fullName.placeholder',
              defaultMessage: '搜索',
            }),
            align: 'flex-left',
            tip: intl.formatMessage({
              id: 'member.memberVisitManage.fullName.tip',
              defaultMessage: '输入 姓名 进行搜索',
            }),
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
                placeholder: intl.formatMessage({ id: 'member.memberVisitManage.orgName', defaultMessage: '所属机构' }),
                allowClear: true,
              },
            },
            jobTitle: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.memberVisitManage.job', defaultMessage: '职位' }),
                allowClear: true,
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
