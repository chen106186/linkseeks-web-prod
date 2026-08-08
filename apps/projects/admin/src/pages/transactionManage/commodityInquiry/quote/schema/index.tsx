import type { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

/**
 * @description: 询价报价单
 * @param {type}
 * @return {type}
 */
export const OFFERORDERSEARCHSCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        quotationNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '报价单号',
            align: 'flex-left',
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
        inquiryListNo: {
          type: 'string',
          'x-component-props': {
            placeholder: '询价单号',
          },
        },
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: '报价单摘要',
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '询价会员',
          },
        },
        offerMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '报价会员',
          },
        },
        '[startDocumentsTime,endDocumentsTime]': {
          type: 'string',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: ['开始时间', '结束时间'],
          },
        },
        externalState: {
          type: 'string',
          'x-component-props': {
            placeholder: '外部状态',
            style: {
              width: '160px',
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
