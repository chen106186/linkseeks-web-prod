import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const mergeSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '输入订单号搜索',
            align: 'flex-left',
            // tip: '输入 订单号 进行搜索',
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
            orderThe: {
              type: 'string',
              'x-component-props': {
                placeholder: '订单摘要',
                allowClear: true,
              },
            },
            membersName: {
              type: 'string',
              'x-component-props': {
                placeholder: '采购商',
                allowClear: true,
              },
            },
            activityName: {
              type: 'string',
              'x-component-props': {
                placeholder: '活动名称',
                allowClear: true,
              },
            },
            '[startCreateTime, endCreateTime]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '下单时间(全部)',
                allowClear: true,
              },
            },
            '[startActivityTime, endActivityTime]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '活动时间(全部)',
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
