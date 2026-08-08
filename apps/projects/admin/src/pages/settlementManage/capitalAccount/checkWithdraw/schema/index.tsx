import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            memberName: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: '会员名称',
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            // rowStyle: {
            //   flexWrap: 'nowrap',
            //   justifyContent: 'end',
            // },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            status: {
              type: 'string',
              'x-component-props': {
                placeholder: '状态',
                style: { width: '174px' },
              },
              enum: [
                {
                  label: '申请提现',
                  value: 1,
                },
                {
                  label: '审核通过',
                  value: 2,
                },
                {
                  label: '审核不通过',
                  value: 3,
                },
                // {
                //   label: '提现成功',
                //   value: 4,
                // },
                // {
                //   label: '提现失败',
                //   value: 5,
                // }
              ],
            },
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
