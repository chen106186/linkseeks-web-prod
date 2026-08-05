import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const listSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        TOPLAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'controllerBtns',
            },
            product: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '搜索',
                tip: '输入 交易商品 进行搜索',
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Flex-Layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            subMemberName: {
              type: 'string',
              default: undefined,
              'x-component-props': {
                placeholder: '被评价方',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            memberName: {
              type: 'string',
              default: undefined,
              'x-component-props': {
                placeholder: '评价方',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            star: {
              type: 'string',
              default: undefined,
              enum: [
                {
                  label: '一星',
                  value: 1,
                },
                {
                  label: '二星',
                  value: 2,
                },
                {
                  label: '三星',
                  value: 3,
                },
                {
                  label: '四星',
                  value: 4,
                },
                {
                  label: '五星',
                  value: 5,
                },
              ],
              'x-component-props': {
                placeholder: '评价星级(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[createTimeStart, createTimeEnd]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '评价时间(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[dealTimeStart, dealTimeEnd]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '交易时间(全部)',
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            comment: {
              type: 'string',
              default: '',
              'x-component-props': {
                placeholder: '评价内容',
                allowClear: true,
                style: {
                  width: 160,
                },
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
