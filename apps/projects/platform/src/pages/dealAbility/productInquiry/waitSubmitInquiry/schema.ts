import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const WAITSUBMITINQUIRYSCHEMA: ISchema = {
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
        inquiryListNo: {
          //报价单号
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xunjiadanhaosousuo' }),
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
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.xunjiadanzhaiyao' }),
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'dealAbility.beixunjiahuiyuan' }),
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

/** 内部状态颜色 */
export const EXTERNALSTATE_COLOR = {
  1: 'default',
  2: 'default',
  3: 'default',
  4: 'success',
  5: 'error',
}

/** 外部状态颜色 */
export const INTERNALSTATE_COLOR = {
  1: 'default',
  2: 'default',
  3: 'default',
  4: 'default',
  5: 'success',
  6: 'error',
  7: 'error',
}
