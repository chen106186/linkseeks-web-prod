import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const OFFERSEARCHSCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        quotationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.baojiadanhao' }),
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
        inquiryListNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xunjiadanhao' }),
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xunjiahuiyuan' }),
          },
        },
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.baojiadanzhaiyao' }),
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
        externalState: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.waibuzhuangtai' }),
            style: {
              width: 160,
            },
          },
          enum: [],
        },
        interiorState: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.neibuzhuangtai' }),
            style: {
              width: 160,
            },
          },
          enum: [],
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
