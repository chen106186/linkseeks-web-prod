/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-22 14:37:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-04 09:45:45
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

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
            placeholder: '搜索',
            align: 'flex-left',
            tip: '输入 优惠券名称 进行搜索',
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
              type: 'string',
              'x-component-props': {
                placeholder: '优惠券ID',
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
                placeholder: ['领(发)券起始时间', '领(发)券截止时间'],
                allowEmpty: [true, true],
              },
            },
            '[effectiveTimeStart, effectiveTimeEnd]': {
              type: 'string',
              'x-component': 'RangePicker',
              'x-component-props': {
                placeholder: ['券有效期起始时间', '券有效期截止时间'],
              },
            },
            type: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '优惠券类型(所有)',
                allowClear: true,
              },
            },
            getWay: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '领券方式(所有)',
                allowClear: true,
              },
            },
            status: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '内部状态(所有)',
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: '查询',
              },
            },
          },
        },
      },
    },
  },
}
