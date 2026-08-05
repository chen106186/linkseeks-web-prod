import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const listSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        applyNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索',
            align: 'flex-left',
            tip: '输入 申请单号 进行搜索',
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
            applyAbstract: {
              type: 'string',
              'x-component-props': {
                placeholder: '申请单摘要',
                allowClear: true,
              },
            },
            consumerName: {
              type: 'string',
              'x-component-props': {
                placeholder: '采购会员',
                allowClear: true,
              },
            },
            supplierName: {
              type: 'string',
              'x-component-props': {
                placeholder: '供应会员',
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间(全部)',
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
