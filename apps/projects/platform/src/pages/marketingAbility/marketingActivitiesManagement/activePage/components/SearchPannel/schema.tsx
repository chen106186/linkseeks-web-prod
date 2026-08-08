import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        full: true,
        labelAlign: 'top',
      },
      properties: {
        statusLayout: {
          type: 'object',
          'x-component': 'VerticalLayout',
          'x-component-props': {
            title: `${intl.formatMessage({ id: 'activePage.Status' })}`,
          },
          properties: {
            status: {
              type: 'string',
              title: '',
              'x-component': 'FormilyCheckBox',
              'x-component-props': {
                isRadio: true,
              },
              enum: [
                {
                  label: `${intl.formatMessage({ id: 'activePage.readyOnline' })}`,
                  value: 1,
                },
                {
                  label: `${intl.formatMessage({ id: 'activePage.alreadyOnline' })}`,
                  value: 2,
                },
                {
                  label: `${intl.formatMessage({ id: 'activePage.going' })}`,
                  value: 3,
                },
                {
                  label: `${intl.formatMessage({ id: 'activePage.alreadyOffline' })}`,
                  value: 4,
                },
                {
                  label: `${intl.formatMessage({ id: 'activePage.alreadyEnd' })}`,
                  value: 5,
                },
              ],
            },
          },
        },
        timeLayout: {
          type: 'string',
          'x-component': 'VerticalLayout',
          'x-component-props': {
            title: `${intl.formatMessage({ id: 'activePage.validTime' })}`,
          },
          properties: {
            startTime: {
              title: `${intl.formatMessage({ id: 'activePage.start' })}`,
              'x-component': 'DatePicker',
              'x-component-props': {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm:ss',
              },
            },
            endTime: {
              title: `${intl.formatMessage({ id: 'activityPage.end' })}:`,
              type: 'string',
              'x-component': 'DatePicker',
              'x-component-props': {
                showTime: true,
                format: 'YYYY-MM-DD HH:mm:ss',
              },
            },
          },
        },
        environmentLayout: {
          type: 'object',
          'x-component': 'VerticalLayout',
          'x-component-props': {
            title: `${intl.formatMessage({ id: 'activePage.suitEnviroment' })}`,
          },
          properties: {
            environment: {
              type: 'string',
              title: '',
              'x-component': 'FormilyCheckBox',
              'x-component-props': {
                isRadio: true,
              },
              enum: [
                {
                  label: 'WEB',
                  value: 1,
                },
                {
                  label: 'H5',
                  value: 2,
                },
                {
                  label: `${intl.formatMessage({ id: 'activePage.samllApp' })}`,
                  value: 3,
                },
                {
                  label: 'APP',
                  value: 4,
                },
              ],
            },
          },
        },
      },
    },
  },
}

export default schema
