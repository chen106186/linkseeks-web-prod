import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

// 订单
export const schema_1: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        orderNo: {
          type: 'string',
          'x-component': 'ModalSearch',
          'x-component-props': {
            placeholder: '搜索订单号',
            align: 'flex-left',
            allowClear: true,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            '[startDate,endDate]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
    },
  },
}

// 售后
export const schema_2: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        applyNo: {
          type: 'string',
          'x-component': 'ModalSearch',
          'x-component-props': {
            placeholder: '搜索申请单号',
            align: 'flex-left',
            allowClear: true,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
    },
  },
}

// 商品
export const schema_3: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        commodityId: {
          type: 'string',
          'x-component': 'ModalSearch',
          'x-component-props': {
            placeholder: '搜索商品ID',
            align: 'flex-left',
            allowClear: true,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
    },
  },
}

// 会员
export const schema_4: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        memberId: {
          type: 'string',
          'x-component': 'ModalSearch',
          'x-component-props': {
            placeholder: '搜索会员ID',
            align: 'flex-left',
            allowClear: true,
            onlyNumber: true,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            '[startDate,endDate]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
    },
  },
}

// 商品询价
export const schema_5: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        inquiryListId: {
          type: 'string',
          'x-component': 'ModalSearch',
          'x-component-props': {
            placeholder: '搜索询价单号',
            align: 'flex-left',
            allowClear: true,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
    },
  },
}

// 采购
export const schema_6 = (searchName) => {
  return {
    type: 'object',
    properties: {
      megaLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          [searchName]: {
            type: 'string',
            'x-component': 'ModalSearch',
            'x-component-props': {
              placeholder: '搜索单号',
              align: 'flex-left',
              allowClear: true,
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              rowStyle: {
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
              },
              colStyle: {
                marginRight: 20,
              },
            },
            properties: {
              '[startTime,endTime]': {
                type: 'array',
                'x-component': 'DateRangePickerUnix',
                'x-component-props': {
                  placeholder: ['开始时间', '结束时间'],
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
      },
    },
  }
}

// 合同
export const schema_7: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        contractNo: {
          type: 'string',
          'x-component': 'ModalSearch',
          'x-component-props': {
            placeholder: '搜索合同编号',
            align: 'flex-left',
            allowClear: true,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
    },
  },
}

// 营销
export const schema_8: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        id: {
          type: 'string',
          'x-component': 'ModalSearch',
          'x-component-props': {
            placeholder: '搜索活动/券ID',
            align: 'flex-left',
            allowClear: true,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              flexWrap: 'nowrap',
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            '[startTime,endTime]': {
              type: 'array',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: ['开始时间', '结束时间'],
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
    },
  },
}
