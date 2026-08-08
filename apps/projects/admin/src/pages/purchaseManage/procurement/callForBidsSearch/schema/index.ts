import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { BidInStateTexts, BidOutStateTexts } from '@/constants'

/**
 * 招标查询列表高级筛选
 */
export const tableListSchema: ISchema = {
  type: 'object',
  properties: {
    inviteTenderCode: {
      type: 'string',
      'x-component': 'SearchFilter',
      'x-component-props': {
        placeholder: '请输入招标编号',
        align: 'flex-start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        inline: true,
        rowStyle: {
          justifyContent: 'start',
        },
        colStyle: {
          marginRight: 20,
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
        '[registerStartTime,registerEndTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: ['报名开始时间', '报名结束时间'],
          },
        },
        outStatus: {
          type: 'string',
          'x-component-props': {
            placeholder: '请选择外部状态',
          },
          enum: Object.keys(BidOutStateTexts).map((item) => ({
            label: BidOutStateTexts[item],
            value: item,
          })),
        },
        inStatus: {
          type: 'string',
          'x-component-props': {
            placeholder: '请选择内部状态',
          },
          enum: Object.keys(BidInStateTexts).map((item) => ({
            label: BidInStateTexts[item],
            value: item,
          })),
        },
        '[preCheckStartTime,preCheckEndTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: ['预审开始时间', '预审结束时间'],
          },
        },
        '[inviteTenderStartTime,inviteTenderEndTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: ['投标开始时间', '投标结束时间'],
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
