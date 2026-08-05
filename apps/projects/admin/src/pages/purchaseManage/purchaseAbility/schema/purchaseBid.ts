import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

/** 采购竞价单查询 */
export const PurchaseBidSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        biddingNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '竞价单号',
            align: 'flex-left',
            allowClear: true,
          },
        },
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
        '[startTime,endTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: '单据时间（全部）',
            allowClear: true,
          },
        },
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: '竞价单摘要',
            allowClear: true,
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '采购会员',
            allowClear: true,
          },
        },
        externalState: {
          type: 'string',
          'x-component-props': {
            placeholder: '外部状态',
            allowClear: true,
            style: {
              width: 160,
            },
          },
          enum: [],
        },
        sumbit: {
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
}

/** 采购竞价单查询 */
export const PurchaseBidExamineSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
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
        biddingNo: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '竞价单号',
            allowClear: true,
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
          marginLeft: 20,
        },
      },
      properties: {
        '[startTime,endTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: '单据时间（全部）',
            allowClear: true,
          },
        },
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: '竞价单摘要',
            allowClear: true,
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '采购会员',
            allowClear: true,
          },
        },
        sumbit: {
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
}
