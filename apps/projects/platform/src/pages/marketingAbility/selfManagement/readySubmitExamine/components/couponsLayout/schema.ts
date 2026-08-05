import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const schema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        inline: true,
      },
      properties: {
        type: {
          type: 'string',
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'selfManagement.couponType' })}`,
            style: {
              width: 160,
            },
          },
          enum: [],
        },
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'selfManagement.theNameOfTheCoupon' })}`,
            align: 'flex-left',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
          marginRight: 20,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            activityName: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'selfManagement.theNameOfTheEvent' })}`,
                style: {
                  width: 160,
                },
              },
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: `${intl.formatMessage({ id: 'selfManagement.theQuery' })}`,
          },
        },
      },
    },
  },
}
