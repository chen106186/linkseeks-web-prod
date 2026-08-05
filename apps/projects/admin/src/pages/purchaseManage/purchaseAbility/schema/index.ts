import type { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { FILTEREXTERNALSTATE, FILTERINTERNALSTATE } from '../constants'

/** 采购询价 - 需求单查询 */
export const INQUIRYDEMANDORDER_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求摘要',
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间（全部）',
              },
            },
            externalState: {
              type: 'string',
              'x-component-props': {
                placeholder: '外部状态',
                style: {
                  width: 160,
                },
              },
              enum: FILTEREXTERNALSTATE,
            },
            interiorState: {
              type: 'string',
              'x-component-props': {
                placeholder: '内部状态',
                style: {
                  width: 160,
                },
              },
              enum: FILTERINTERNALSTATE,
            },
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

/** 采购询价 - 待新建需求单&待审核需求单一级&待审核需求单二级&待提交需求单 */
export const INQUIRYWAITORDER_SCHEMA: ISchema = {
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
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求摘要',
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间（全部）',
              },
            },
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

/** 采购需求单查询 */
export const PurchaseDemandSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        '[startTime,endTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: '单据时间（全部）',
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '需求会员',
          },
        },
        externalState: {
          type: 'string',
          'x-component-props': {
            placeholder: '外部状态',
          },
          enum: [
            {
              label: '作废',
              value: -1,
            },
            {
              label: '已完成',
              value: 99,
            },
            {
              label: '待提交需求单',
              value: 1,
            },
            {
              label: '待审核需求单',
              value: 2,
            },
            {
              label: '待提交报价单',
              value: 3,
            },
            {
              label: '待确认授标结果',
              value: 4,
            },
          ],
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
/**待新建需求单 & 待审核需求单一级 & 待审核需求单二级 & 待提交需求单 */
export const PurchaseDemandPublicSchema: ISchema = {
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
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: '需求摘要',
          },
        },
        '[startTime,endTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: '单据时间（全部）',
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '需求会员',
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
/** 选择货品 */
export const SelectProductSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '货品名称',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: '货号',
              },
            },
            customerCategory: {
              type: 'string',
              'x-component-props': {
                placeholder: '品类',
              },
            },
            brand: {
              type: 'string',
              'x-component-props': {
                placeholder: '品牌',
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: '规格型号',
              },
            },
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
/** 选择会员 */
export const formSearch: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: '请输入会员名称',
      },
    },
  },
}

/** 选择报价商品 */
export const OfferProductSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '货品名称',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: '货号',
              },
            },
            customerCategory: {
              type: 'string',
              'x-component-props': {
                placeholder: '品类',
              },
            },
            brand: {
              type: 'string',
              'x-component-props': {
                placeholder: '品牌',
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: '规格型号',
              },
            },
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

/** 确认报价 - 报价单查询 */
export const CONFIRMOFFERSERAH_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求摘要',
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间（全部）',
              },
            },
            externalState: {
              type: 'string',
              'x-component-props': {
                placeholder: '外部状态',
                style: {
                  width: 160,
                },
              },
              enum: FILTEREXTERNALSTATE,
            },
            interiorState: {
              type: 'string',
              'x-component-props': {
                placeholder: '内部状态',
                style: {
                  width: 160,
                },
              },
              enum: FILTERINTERNALSTATE,
            },
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
/** 确认报价 - 待比价&待确认授标结果 */
export const CONFIRMOFFERSUBMITAPRICE_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求摘要',
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间（全部）',
              },
            },
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

/** 确认报价 - 审核一级&审核二级 */
export const CONFIRMOFFERAUDIT_SCHEMA: ISchema = {
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
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求摘要',
              },
            },

            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间（全部）',
              },
            },
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

/** 采购报价 - 采购需求单查询 */
export const OFFERDEMANDSERAH_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: '需求摘要',
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: '需求会员',
          },
        },
        '[startTime,endTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: '单据时间（全部）',
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

/** 采购报价 - 采购报价单查询 */
export const OFFERSERAH_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '需求单号',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            quotedPriceNo: {
              type: 'string',
              'x-component-props': {
                placeholder: '报价单号',
              },
            },
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求摘要',
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求会员',
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间（全部）',
              },
            },
            externalState: {
              type: 'string',
              'x-component-props': {
                placeholder: '外部状态',
                style: {
                  width: 160,
                },
              },
              enum: FILTEREXTERNALSTATE,
            },
            interiorState: {
              type: 'string',
              'x-component-props': {
                placeholder: '内部状态',
                style: {
                  width: 160,
                },
              },
              enum: FILTERINTERNALSTATE,
            },
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

/** 采购报价 - 待新增报价单&待审核报价1|2级&待提交报价单 */
export const OFFERSERAHAUDIT_SCHEMA: ISchema = {
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
        quotedPriceNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: '报价单号',
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
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            purchaseInquiryNo: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求单号',
              },
            },
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求单摘要',
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: '单据时间（全部）',
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: '需求会员',
              },
            },
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
