import type { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getLogisticsPlatformSelectListMemberCompanyQuery } from '@apps/apis'

/**
 * @description: 询价单
 * @param {type}
 * @return {type}
 */

const fetchData = () => {
  return new Promise((resolve) => {
    getLogisticsPlatformSelectListMemberCompanyQuery().then((res: any) => {
      resolve({
        data: res.data.map((item: any) => {
          return {
            name: item.name,
            state: item.id,
          }
        }),
      })
    })
  })
}

export const logisticsSearchSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        logisticsOrderNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '物流单号',
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
        relevanceOrderCode: {
          type: 'string',
          'x-component-props': {
            placeholder: '订单号',
          },
        },
        companyId: {
          type: 'string',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '物流服务商',
            fetchSearch: fetchData,
            style: {
              width: 160,
            },
          },
        },
        shipperMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '发货方',
          },
        },
        '[invoicesTimeStart,invoicesTimeEnd]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: '单据时间（全部）',
          },
        },
        status: {
          type: 'string',
          'x-component-props': {
            placeholder: '外部状态',
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
