import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getProductSelectGetSelectBrand, getProductSelectGetSelectCustomerCategory } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
import { createRegisterFieldsSchema, ElementType } from '@/utils/createRegisterFieldSchema'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()

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
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
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
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
              },
            },
            externalState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            interiorState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
          'x-component': 'controllerBtns',
        },
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
          marginLeft: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
        requisitionFormNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
            '[startDocumentsTime,endDocumentsTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
              },
            },
            externalState: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
                className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在s
                style: {
                  width: 160,
                },
              },
            },
            interiorState: {
              type: 'string',
              'x-component': 'Select',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
                className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在s
                style: {
                  width: 160,
                },
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
          'x-component': 'controllerBtns',
        },
        requisitionFormNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
          marginLeft: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },
            category: {
              type: 'string',
              'x-component': 'SearchSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.message28' }),
                className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
                fetchSearch: getProductSelectGetSelectCustomerCategory,
                style: {
                  width: 160,
                },
              },
            },
            '[startDocumentsTime,endDocumentsTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
            placeholder: intl.formatMessage({ id: 'detail.purchase.materialName' }),
            align: 'flex-left',
            adadded: true,
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
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.code' }),
              },
            },
            customerCategoryId: {
              type: 'string',
              'x-component': 'SearchSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.message28' }),
                className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
                fetchSearch: getProductSelectGetSelectCustomerCategory,
                style: {
                  width: 160,
                },
              },
            },
            brandId: {
              type: 'string',
              'x-component': 'SearchSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.message31' }),
                fetchSearch: getProductSelectGetSelectBrand,
                style: {
                  width: 160,
                },
              },
            },
            materialGroupId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: translate('web.resource.order.wuliaozu'),
                allowClear: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                style: { width: '150px' },
                showSearch: true,
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
        placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder16' }),
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
            placeholder: intl.formatMessage({ id: 'detail.purchase.productName' }),
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
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.code' }),
              },
            },
            customerCategory: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
              },
            },
            brand: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.brand' }),
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
          marginRight: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
              },
            },
            externalState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            interiorState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
          marginRight: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
          'x-component': 'controllerBtns',
        },
        purchaseInquiryNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
          marginLeft: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },

            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.member' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
            placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
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
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
            quotedPriceNo: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.quotedPriceNo' }),
              },
            },
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'detail.purchase.demendDetail' }),
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.member' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
              },
            },
            externalState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.externalStatus' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
            interiorState: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.innerStatus' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
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
          'x-component': 'controllerBtns',
        },
        quotedPriceNo: {
          type: 'string',
          'x-component': 'Search',
          'x-mega-props': {},
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'detail.purchase.quotedPriceNo' }),
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
          marginLeft: 0,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
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
            purchaseInquiryNo: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.dementNo' }),
              },
            },
            details: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.details' }),
              },
            },
            '[startTime,endTime]': {
              type: 'string',
              'x-component': 'DateRangePickerUnix',
              'x-component-props': {
                placeholder: [
                  intl.formatMessage({ id: 'detail.purchase.startTime1' }),
                  intl.formatMessage({ id: 'detail.purchase.endTime1' }),
                ],
              },
            },
            memberName: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'table.purchase.member' }),
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
            children: intl.formatMessage({ id: 'detail.purchase.search' }),
          },
        },
      },
    },
  },
}

/** 选择会员schema */
export const createSubMemberSchema = (registerFields: ElementType[]): ISchema => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder16' }),
        align: 'flex-left',
        // tip: intl.formatMessage({ id: 'member.memberVisitManage.fullName.tip', defaultMessage: '输入 姓名 进行搜索' }),
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 5,
      },
      properties: {
        memberType: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.memberTypeId.placeholder' }),
            allowClear: true,
          },
        },
        roleId: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.roleId.placeholde' }),
            allowClear: true,
          },
        },
        level: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.level.placeholder' }),
            allowClear: true,
          },
        },
        status: {
          type: 'string',
          enum: [],
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.status.placeholder' }),
            allowClear: true,
          },
        },
        code: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.code.placeholder',
              defaultMessage: '会员编码',
            }),
          },
        },
        currencyType: {
          type: 'string',
          enum: [],
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.currencyType.placeholder',
              defaultMessage: '币别(全部)',
            }),
            allowClear: true,
          },
        },
        categoryId: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.categoryId.placeholder',
              defaultMessage: '主营品类(全部)',
            }),
            allowClear: true,
            showSearch: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            changeOnSelect: true,
            expandTrigger: 'hover',
            multiple: false,
          },
        },
        ...(registerFields.length
          ? {
              memberConfigs: {
                type: 'object',
                'x-mega-props': {
                  span: 5,
                },
                properties: {
                  ...createRegisterFieldsSchema(registerFields),
                },
              },
            }
          : {}),
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'member.management.maintain.query.query' }),
          },
        },
      },
    },
  },
})
