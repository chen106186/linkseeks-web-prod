import { ISchema } from '@apps/formily'
import { environmentList } from '@/constants/environment'
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
        columns: 2,
        grid: true,
        labelCol: 5,
        wrapperCol: 18,
      },
      properties: {
        left: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'left',
          },
          properties: {
            name: {
              type: 'string',
              title: `${intl.formatMessage({ id: 'activePage.activityPageName' })}`,
              'x-rules': [
                {
                  required: true,
                },
                {
                  limitByte: true,
                  maxByte: 60,
                },
              ],
            },
            environment: {
              type: 'string',
              enum: environmentList,
              title: `${intl.formatMessage({ id: 'activePage.activityPageNameEnviroment' })}`,
              required: true,
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: 'template',
                  condition: '{{!!$value}}',
                },
              ],
            },
          },
        },
        right: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'left',
          },
          properties: {
            '[startTime, endTime]': {
              type: 'object',
              title: `${intl.formatMessage({ id: 'activePage.activityValidTime' })}`,
              'x-component': 'RangeTime',
              'x-component-props': {
                showTime: true,
              },
              required: true,
            },
            shopId: {
              type: 'string',
              title: `${intl.formatMessage({ id: 'activePage.activitySuitMall' })}`,
              enum: [],
              required: true,
            },
            shopName: {
              type: 'string',
              title: `${intl.formatMessage({ id: 'activePage.MallName' })}`,
              display: false,
            },
          },
        },
      },
    },
  },
}

export default schema
