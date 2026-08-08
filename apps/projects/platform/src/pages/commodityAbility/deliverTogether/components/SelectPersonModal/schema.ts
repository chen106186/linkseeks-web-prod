import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

export const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'customerAbility.songyang.person.name.placeholder',
              defaultMessage: '请输入名字',
            }),
            align: 'flex-left',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            org: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({
                  id: 'customerAbility.songyang.person.org.placeholder',
                  defaultMessage: '请输入所属机构',
                }),
              },
            },
            jobTitle: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({
                  id: 'customerAbility.songyang.person.jobTitle.placeholder',
                  defaultMessage: '请输入职位',
                }),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({
                  id: 'customerAbility.management.common.schames.query',
                }),
              },
            },
          },
        },
      },
    },
  },
}
