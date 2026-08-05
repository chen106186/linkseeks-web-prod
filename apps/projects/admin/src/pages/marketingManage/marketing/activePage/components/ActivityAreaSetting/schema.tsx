import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        id: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索',
            align: 'flex-left',
            tip: '输入活动ID进行搜索',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
            },
            colStyle: {
              //改变间隔
              marginRight: 20,
            },
          },
          properties: {
            activityName: {
              type: 'string',
              'x-component-props': {
                placeholder: '活动名称',
              },
            },
            activityType: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: '活动类型',
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              'x-mega-props': {
                span: 2,
              },
              type: 'daterange',
              'x-component-props': {
                placeholder: ['活动开始时间', '活动结束时间'],
                showTime: true,
              },
            },
            productName: {
              type: 'string',
              'x-component-props': {
                placeholder: '商品名称',
              },
            },
            merchantName: {
              type: 'string',
              'x-component-props': {
                placeholder: '商家名称',
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

export default schema
