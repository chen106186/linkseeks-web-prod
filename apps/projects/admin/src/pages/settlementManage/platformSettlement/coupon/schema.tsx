/*
 * @Author: Bill
 * @Date: 2020-10-22 09:52:10
 * @Description: 应收账款结算 schema集合
 */
import { FORM_FILTER_PATH } from '@/formSchema/const'
import type { ISchema } from '@apps/formily'

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
                { label: '所有', value: 0 },
                { label: '待对账', value: 1 },
                { label: '待付款', value: 2 },
                { label: '待收款', value: 3 },
                { label: '已完成', value: 4 },
              ],
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
              'x-component': 'ExportBtn',
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
            '[orderStartTime, orderEndTime]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: ['下单开始时间', '下单结束时间'],
                allowClear: true,
              },
            },
            '[payStartTime, payEndTime]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: ['支付开始时间', '支付结束时间'],
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
