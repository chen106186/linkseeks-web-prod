/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-29 09:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-15 17:29:29
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
                placeholder: '搜索',
                tip: '输入 会员名称 进行搜索',
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
        placeholder: '搜索',
        align: 'flex-start',
        tip: '输入 会员名称 进行搜索',
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
            placeholder: '会员ID',
            min: 0,
          },
        },
        memberTypeEnum: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: '会员类型(所有)',
            allowClear: true,
          },
        },
        level: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: '会员等级(所有)',
            allowClear: true,
          },
        },
        suitableMemberType: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: '适用用户(所有)',
            allowClear: true,
          },
        },
        '[becomeTimeStart, becomeTimeEnd]': {
          type: 'string',
          'x-component': 'RangePicker',
          'x-component-props': {
            placeholder: ['成为会员起始时间', '成为会员截止时间'],
            showTime: true,
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
