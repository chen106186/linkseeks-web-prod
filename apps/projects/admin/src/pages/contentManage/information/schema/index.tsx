import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'

export const schema: ISchema = {
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
              // 'x-component': 'Children',
              // 'x-component-props': {
              //   children: '{{controllerBtns}}',
              // },
              'x-component': 'ControllerBtns',
            },
            title: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '请输入标题',
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
            columnId: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: '栏目',
                allowClear: true,
              },
            },
            status: {
              type: 'string',
              enum: [
                { label: '全部', value: '0' },
                { label: '待上架', value: '1' },
                { label: '已上架', value: '2' },
                { label: '已下架', value: '3' },
              ],
              'x-component-props': {
                placeholder: '状态',
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: ['发布开始时间', '发布结束时间'],
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
