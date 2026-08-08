import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'

const intl = getIntl()

const memberSchema: ISchema = {
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
            placeholder: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.schema.add.searchName' })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.searchForName' })}`,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 4,
          },
          properties: {
            orgName: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberInspection.common.columns.userColumns.agency',
                })}`,
                allowClear: true,
              },
            },
            jobTitle: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.userColumns.post' })}`,
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-component-props': {
                children: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.query' })}`,
              },
            },
          },
        },
      },
    },
  },
}
export default memberSchema
