import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getOrderSelectOption } from '../effect'

export const tableListSchema: any = () => {
  const res = getOrderSelectOption()
  if (res) {
    const { orderTypes: OrderType } = res

    return {
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
                orderNo: {
                  type: 'string',
                  'x-component': 'Search',
                  'x-component-props': {
                    placeholder: '请输入订单编号',
                    align: 'flex-end',
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
                  marginLeft: 20,
                },
              },
              properties: {
                digest: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入订单商品摘要',
                  },
                },
                vendorMemberName: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请输入供应会员名称',
                  },
                },
                '[startDate,endDate]': {
                  type: 'daterange',
                  'x-component-props': {
                    placeholder: ['开始时间', '结束时间'],
                  },
                },
                orderType: {
                  type: 'string',
                  'x-component-props': {
                    placeholder: '请选择订单类型',
                  },
                  enum: OrderType.map((item) => ({
                    label: item['text'],
                    value: item['id'],
                  })),
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
        },
      },
    }
  }
}
