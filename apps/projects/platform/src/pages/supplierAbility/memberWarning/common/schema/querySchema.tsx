import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'

const intl = getIntl()

const querySchema: ISchema = {
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
            placeholder: `${intl.formatMessage({
              id: 'supplier.supplierInspection.common.schema.add.searchsupplierName',
            })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({ id: 'supplier.supplierEvaluate.allQuery.schema.searchForsupplierName' })}`,
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
            handler: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'member.memberWarning.common.schema.querySchema.dealz' })}`,
              },
            },
            project: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberWarning.common.columns.queryColumns.warnProject',
                })}`,
              },
            },
            level: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberWarning.common.columns.queryColumns.warnLevel',
                })}`,
              },
            },
            rangeDate: {
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  `${intl.formatMessage({ id: 'member.memberWarning.common.schema.querySchema.warnBeginTime' })}`,
                  `${intl.formatMessage({ id: 'member.memberWarning.common.schema.querySchema.warnEndTime' })}`,
                ],
              },
            },
            handleDate: {
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  `${intl.formatMessage({ id: 'member.memberWarning.common.schema.querySchema.dealBeginTime' })}`,
                  `${intl.formatMessage({ id: 'member.memberWarning.common.schema.querySchema.dealEndTime' })}`,
                ],
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
export default querySchema
