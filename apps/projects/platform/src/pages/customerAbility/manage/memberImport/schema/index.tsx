import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const importSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        controllerWrap: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'MemberControllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.import.query.name.placeholder' }),
                tip: intl.formatMessage({ id: 'customerAbility.management.import.query.name.placeholder-tip' }),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Flex-Layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.import.query.memberTypeId.placeholder',
                }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            roleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.import.query.roleId.placeholder' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.import.query.outerStatus.placeholder',
                }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.import.query.date.placeholder' }),
                allowClear: true,
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
                children: intl.formatMessage({ id: 'customerAbility.management.import.query.query' }),
              },
            },
          },
        },
      },
    },
  },
}
