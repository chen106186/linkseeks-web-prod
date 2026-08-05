/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 18:13:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 18:50:24
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    memberName: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'merchantCoupon.Search' }),
        align: 'flex-start',
        tip: intl.formatMessage({ id: 'merchantCoupon.inputCustomNameSearch' }),
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 4,
      },
      properties: {
        code: {
          type: 'string',
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'merchantCoupon.Code' })}`,
            allowClear: true,
          },
        },
        status: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.couponState' }),
            allowClear: true,
          },
        },
        '[createTimeStart, createTimeEnd]': {
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
        memberId: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.CustomerID' }),
            allowClear: true,
          },
        },
        suitableMemberType: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'merchantCoupon.suitUsers' })}`,
            allowClear: true,
          },
        },
        '[useTimeStart, useTimeEnd]': {
          type: 'string',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'merchantCoupon.useTimeStart' }),
              intl.formatMessage({ id: 'merchantCoupon.useTimeEnd' }),
            ],
            showTime: true,
          },
        },
        orderNo: {
          type: 'string',
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'merchantCoupon.Associationordernumber' })}`,
            allowClear: true,
          },
        },
        shopId: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: `${intl.formatMessage({ id: 'merchantCoupon.Mall' })}`,
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
}
