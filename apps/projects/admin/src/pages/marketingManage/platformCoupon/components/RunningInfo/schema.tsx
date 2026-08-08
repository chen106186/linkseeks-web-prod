/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 18:13:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 18:50:24
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    memberName: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: '搜索',
        align: 'flex-start',
        tip: '输入 客户名称 进行搜索',
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
            placeholder: '券码',
            allowClear: true,
          },
        },
        status: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: '券状态(所有)',
            allowClear: true,
          },
        },
        '[createTimeStart, createTimeEnd]': {
          type: 'string',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: ['领(发)券起始时间', '领(发)券截止时间'],
            allowEmpty: [true, true],
          },
        },
        memberId: {
          type: 'string',
          'x-component-props': {
            placeholder: '客户ID',
            allowClear: true,
          },
        },
        suitableMemberType: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: '适用用户',
            allowClear: true,
          },
        },
        '[useTimeStart, useTimeEnd]': {
          type: 'string',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: ['下单(使用)起始时间', '下单(使用)截止时间'],
            showTime: true,
          },
        },
        orderNo: {
          type: 'string',
          'x-component-props': {
            placeholder: '关联订单号',
            allowClear: true,
          },
        },
        shopId: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: '商城',
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
}
