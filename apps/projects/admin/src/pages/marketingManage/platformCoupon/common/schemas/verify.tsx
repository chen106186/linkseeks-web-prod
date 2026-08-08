/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 10:07:26
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 10:07:26
 * @Description: 待审核公用 schema
 */
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

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
                placeholder: '搜索',
                tip: '输入 优惠券名称 进行搜索',
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
              type: 'string',
              'x-component-props': {
                placeholder: '优惠券ID',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[startTime2, endTime2]': {
              type: 'object',
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

export default schema
