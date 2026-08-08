import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    inviteTenderCode: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhaobiao1' }),
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        projectName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingshuruzhaobiao' }),
          },
        },
        '[evaluationStartTime, evaluationEndTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'table.purchase.pingbiaokaishishi' }),
              intl.formatMessage({ id: 'table.purchase.pingbiaojieshushi' }),
            ],
          },
        },
        status: {
          type: 'number',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.qingxuanzezhuangtai' }),
          },
          enum: [
            {
              label: intl.formatMessage({ id: 'table.purchase.daiqueren' }),
              value: 2,
            },
            {
              label: intl.formatMessage({ id: 'table.purchase.yiqueren' }),
              value: 3,
            },
            {
              label: intl.formatMessage({ id: 'table.purchase.yijujue' }),
              value: 4,
            },
          ],
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}
