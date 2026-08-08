import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

/**
 * 除了订单必填字段, 默认
 */
export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    inviteTenderCode: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: '请输入招标编号',
        align: 'flex-end',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        colStyle: {
          marginLeft: 20,
        },
      },
      properties: {
        projectName: {
          type: 'string',
          'x-component-props': {
            placeholder: '请输入招标项目',
          },
        },
        '[startTime,endTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: ['发布开始时间', '发布结束时间'],
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-component-props': {
            children: '查询',
          },
        },
      },
    },
  },
}
