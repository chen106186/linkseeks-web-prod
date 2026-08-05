import { useIntl } from '@linkseeks/i18n'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-23 17:41:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-01 14:59:45
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'ControllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'merchantCoupon.Search' }),
                tip: intl.formatMessage({ id: 'merchantCoupon.enterCouponNameSearch' }),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            id: {
              type: 'number',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'marketingAbility.youhuijuanID' })}`,
                allowClear: true,
              },
            },
            '[effectiveTimeStart, effectiveTimeEnd]': {
              type: 'object',
              'x-component': 'RangePicker',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'merchantCoupon.effectiveTimeEnd' }),
                  intl.formatMessage({ id: 'merchantCoupon.effectiveTimeStart' }),
                ],
              },
            },
            type: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'merchantCoupon.CouponTypeAll' }),
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: intl.formatMessage({ id: 'merchantCoupon.inquery' }),
              },
            },
          },
        },
      },
    },
  },
}
