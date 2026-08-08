import { useIntl } from '@linkseeks/i18n'
/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 14:37:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-22 13:49:43
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
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.Search' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'merchantCoupon.enterCouponNameSearch' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            columns: 4,
            autoRow: true,
          },
          properties: {
            id: {
              type: 'number',
              'x-component-props': {
                placeholder: `${intl.formatMessage({ id: 'marketingAbility.youhuijuanID' })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[releaseTimeStart, releaseTimeEnd]': {
              type: 'string',
              'x-component': 'RangePicker',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'merchantCoupon.giveCouponStartTime' }),
                  intl.formatMessage({ id: 'merchantCoupon.giveCouponEndTime' }),
                ],
                allowEmpty: [true, true],
              },
            },
            '[effectiveTimeStart, effectiveTimeEnd]': {
              type: 'string',
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
            getWay: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'merchantCoupon.CollarAll' }),
                allowClear: true,
              },
            },
            status: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'merchantCoupon.InternalStateAll' }),
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
