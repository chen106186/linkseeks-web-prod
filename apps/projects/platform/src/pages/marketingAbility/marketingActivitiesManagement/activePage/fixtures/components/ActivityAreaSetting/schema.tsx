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
            placeholder: `${intl.formatMessage({ id: 'activePage.search' })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({ id: 'activityPage.inputIDTosearch' })}`,
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
                placeholder: `${intl.formatMessage({ id: 'activePage.Activityname' })}`,
              },
            },
            activityType: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'activePage.activitytype' })}`,
              },
            },
            '[startTime, endTime]': {
              'x-mega-props': {
                span: 2,
              },
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  `${intl.formatMessage({ id: 'activePage.Activitystarttime' })}`,
                  `${intl.formatMessage({ id: 'activePage.Activityendtime' })}`,
                ],
                showTime: true,
              },
            },
            productName: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'activePage.Tradename' })}`,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: `${intl.formatMessage({ id: 'activePage.query' })}`,
              },
            },
          },
        },
      },
    },
  },
}

export default schema
