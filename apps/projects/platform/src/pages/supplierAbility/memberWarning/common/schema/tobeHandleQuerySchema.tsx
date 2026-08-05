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

export const handleFormSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'string',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 20,
        labelAlign: 'left',
      },
      properties: {
        name: {
          title: `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
          type: 'string',
        },
        project: {
          title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnProject' })}`,
          type: 'string',
        },
        tips: {
          title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnTip' })}`,
          type: 'string',
        },
        date: {
          title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnDate' })}`,
          type: 'string',
        },
        level: {
          title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.warnLevel' })}`,
          type: 'string',
        },
        solution: {
          title: `${intl.formatMessage({ id: 'member.memberWarning.common.columns.queryColumns.dealPlan' })}`,
          type: 'textarea',
        },
      },
    },
  },
}

export default querySchema
