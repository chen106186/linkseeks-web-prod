import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const commonTimeList = [
  { label: '今天', value: 1 },
  { label: '一周内', value: 2 },
  { label: '一个月内', value: 3 },
  { label: '三个月内', value: 4 },
  { label: '六个月内', value: 5 },
  { label: '一年内', value: 6 },
  { label: '一年前', value: 7 },
]

/**
 * 单据时间
 */
export const docTime = [{ label: '单据时间（全部）', value: 0 }].concat(commonTimeList)

/**
 * @author: Bill
 * @description: 指派生产通知单查询页 schema - 生产通知单查询
 */
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        noticeNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索',
            align: 'flex-left',
            tip: '输入通知单号进行搜索',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            summary: {
              type: 'string',
              'x-component-props': {
                placeholder: '通知单摘要',
                allowClear: true,
              },
            },
            processName: {
              type: 'string',
              'x-component-props': {
                placeholder: '加工企业名',
                allowClear: true,
              },
            },
            docTime: {
              type: 'string',
              default: 0,
              enum: docTime,
              'x-component-props': {
                placeholder: '单据时间(全部)',
                allowClear: true,
              },
            },
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: '外部状态(全部)',
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
