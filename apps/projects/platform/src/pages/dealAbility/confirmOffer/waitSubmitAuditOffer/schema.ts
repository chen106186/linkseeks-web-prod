import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const WAITSUBMITAUDITOFFERSCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'controllerBtns',
        },
        quotationNo: {
          //报价单号
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }),
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
        },
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        inquiryListNo: {
          //需求单号
          type: 'string',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
          },
        },

        details: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.baojiadanzhaiyao' }),
          },
        },
        offerMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.baojiahuiyuan' }),
          },
        },
        '[startDocumentsTime,endDocumentsTime]': {
          type: 'string',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'dealAbility.kaishishijian' }),
              intl.formatMessage({ id: 'dealAbility.jieshushijian' }),
            ],
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'dealAbility.chaxun' }),
          },
        },
      },
    },
  },
}
