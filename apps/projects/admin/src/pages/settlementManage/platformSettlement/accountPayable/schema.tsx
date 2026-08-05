/*
 * @Author: Bill
 * @Date: 2020-10-22 09:52:10
 * @Description: 应收账款结算 schema集合
 */
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema, createFormActions } from '@apps/formily'

/**
 * 应收账款 index.tsx 列表页schema
 */

export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        settlementName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索(结算方)',
            align: 'flex-left',
            tip: '输入 结算方 进行搜索',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: '20px',
            },
          },
          properties: {
            '[startTime, endTime]': {
              type: 'object',
              'x-component': 'RangePicker',
              'x-component-props': {
                allowClear: true,
                placeholder: ['结算日期（开始时间）', '结算日期（结束时间）'],
              },
            },
            // startTime: {
            //   type: 'string',
            //   'x-component': 'DatePicker',
            //   'x-component-props': {
            //     allowClear: true,
            //     placeholder: '结算日期（开始时间）'
            //   }
            // },
            // endTime: {
            //   type: 'string',
            //   'x-component': 'DatePicker',
            //   'x-component-props': {
            //     allowClear: true,
            //     placeholder: '结算日期（结束时间）'
            //   }
            // },
            status: {
              type: 'string',
              enum: [
                { label: '结算状态（所有）', value: 0 },
                { label: '待对账', value: 1 },
                { label: '待付款', value: 2 },
                { label: '待收款', value: 3 },
                { label: '已完成', value: 4 },
              ],
              default: 0,
              'x-component-props': {
                placeholder: '结算状态(全部)',
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

const commonTimeList = [
  { label: '今天', value: 1 },
  { label: '一周内', value: 2 },
  { label: '一个月内', value: 3 },
  { label: '三个月内', value: 4 },
  { label: '六个月内', value: 5 },
  { label: '一年内', value: 6 },
  { label: '一年前', value: 7 },
]
const orderTime = [{ label: '下单时间（所有）', value: 0 }].concat(commonTimeList)
const payTime = [{ label: '支付时间（所有）', value: 0 }].concat(commonTimeList)

/**
 * 应收账款管理--物流单结算明细详情， 生产通知单结算明细
 */

export const detailSchema: ISchema = {
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
              'x-component': 'Children',
              'x-component-props': {
                children: '{{exportBtn}}',
              },
            },
            orderNo: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '搜索（单据号）',
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
            orderTime: {
              type: 'string',
              enum: orderTime,
              default: 0,
              'x-component-props': {
                placeholder: '下单时间（全部）',
                allowClear: true,
              },
            },
            payTime: {
              type: 'string',
              enum: payTime,
              default: 0,
              'x-component-props': {
                placeholder: '支付时间(全部)',
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
