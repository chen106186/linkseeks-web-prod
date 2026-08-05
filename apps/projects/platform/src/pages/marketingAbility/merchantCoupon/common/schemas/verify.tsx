/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 10:07:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 10:07:26
 * @Description: 待审核公用 schema
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

const schema: ISchema = {
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
                placeholder: intl.formatMessage({ id: 'merchantCoupon.CouponID' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[effectiveTimeStart, effectiveTimeEnd]': {
              type: 'object',
              'x-component': 'RangePicker',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'merchantCoupon.effectiveTimeStart' }),
                  intl.formatMessage({ id: 'merchantCoupon.effectiveTimeEnd' }),
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

export default schema
