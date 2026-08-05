/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-29 09:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-15 16:24:26
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
                tip: intl.formatMessage({ id: 'merchantCoupon.EnterMemberNameForSearch' }),
                advanced: false,
              },
            },
          },
        },
      },
    },
  },
}

export const drawerSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'merchantCoupon.Search' }),
        align: 'flex-start',
        tip: intl.formatMessage({ id: 'merchantCoupon.EnterMemberNameForSearch' }),
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
        memberId: {
          type: 'string',
          'x-component': 'NumberPicker',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.MemberID' }),
            min: 0,
          },
        },
        memberTypeEnum: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.Membertype' }),
            allowClear: true,
          },
        },
        level: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.Memberlevel' }),
            allowClear: true,
          },
        },
        suitableMemberType: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'merchantCoupon.Applicableusers' }),
            allowClear: true,
          },
        },
        '[becomeTimeStart, becomeTimeEnd]': {
          type: 'string',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: [
              `${intl.formatMessage({ id: 'merchantCoupon.beginVipTime' })}`,
              `${intl.formatMessage({ id: 'merchantCoupon.endVipTime' })}`,
            ],
            showTime: true,
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
