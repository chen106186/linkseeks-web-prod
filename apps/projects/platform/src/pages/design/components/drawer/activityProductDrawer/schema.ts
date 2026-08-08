import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        id: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'common.text.search' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'editor.drawer.activity.product.search.id' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            aotoRow: true,
          },
          properties: {
            activityName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'editor.drawer.activity.columns.activityName' }),
              },
            },
            activityType: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'editor.drawer.activity.columns.activityType' }),
              },
            },
            '[startTime, endTime]': {
              'x-mega-props': {
                span: 2,
              },
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'common.form.activity.startTime.placeholder' }),
                  intl.formatMessage({ id: 'common.form.activity.endTime.placeholder' }),
                ],
              },
            },
            product: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'editor.drawer.activity.columns.activityName' }),
              },
            },
            merchantName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'common.table.columns.memberName' }),
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'common.button.query' }),
              },
            },
          },
        },
      },
    },
  },
}

export default schema
