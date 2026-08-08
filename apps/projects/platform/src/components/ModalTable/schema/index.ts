import type { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductInvoicesTypeAll,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCategory,
  getProductSelectGetSelectCustomerCategory,
} from '@apps/apis'
import { getMemberManageRoleAll } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const productModalByMemberSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.qingshurushangpinmingcheng' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        customerCategoryId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.qingxuanzepinlei' }),
            className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
            // fetchSearch: () => {
            //   let merber = sessionStorage.getItem('memberInfo');
            //   let meberInfo = JSON.parse(merber)
            //   return new Promise(resolve => {
            //     getProductSelectGetMemberCategory({ name: '', ...meberInfo}).then(res => {
            //       console.log(res.data, 10086)
            //       resolve(res)
            //     })
            //   })
            // },
            style: {
              width: 160,
            },
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.qingxuanzepinpai' }),
            // fetchSearch: () => {
            //   let merber = sessionStorage.getItem('memberInfo');
            //   let meberInfo = JSON.parse(merber)
            //   return new Promise(resolve => {
            //     getProductSelectGetMemberBrand({ name: '', ...meberInfo}).then(res => {
            //       console.log(res.data, 10086)
            //       resolve(res)
            //     })
            //   })
            // },
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

export const productModalSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.qingshurushangpinmingcheng' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        categoryId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.qingxuanzepinlei' }),
            className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
            fetchSearch: getProductSelectGetSelectCategory,
            style: {
              width: 160,
            },
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.qingxuanzepinpai' }),
            fetchSearch: getProductSelectGetSelectBrand,
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/**
 *  新增采购订单选择商品的高级筛选
 *  获取供应商的品类和品牌
 */
export const addOrderModalSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.qingshurushangpinmingcheng' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        customerCategoryId: {
          type: 'string',
          'x-component': 'CustomCategorySearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.goods.schema.goodsSchema.customerCategoryId' }),
            showSearch: true,
            notFoundContent: null,
            style: { width: '174px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.shangpinpinpai' }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            style: { width: '174px' },
            searchValue: null,
            dataoption: [],
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/**
 *  新增采购合同订单选择物料的高级筛选
 */
export const addContractOrderModalSchema: (codeName?: string) => ISchema = (codeName = 'code') => {
  return {
    type: 'object',
    properties: {
      [codeName]: {
        type: 'string',
        'x-component': 'ModalSearch',
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'components.qingshuruwuliaobianhao' }),
          align: 'flex-start',
        },
      },
      [FORM_FILTER_PATH]: {
        type: 'object',
        'x-component': 'flex-layout',
        'x-component-props': {
          rowStyle: {
            flexWrap: 'nowrap',
            style: {
              marginRight: 0,
            },
          },
          colStyle: {
            marginTop: 20,
          },
        },
        properties: {
          name: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'components.wuliaomingcheng' }),
            },
          },
          type: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'components.guigexinghao' }),
            },
          },
          submit: {
            'x-component': 'Submit',
            'x-mega-props': {
              span: 1,
            },
            'x-component-props': {
              children: intl.formatMessage({ id: 'components.chaxun' }),
              tips: true,
            },
          },
        },
      },
    },
  }
}

/**
 * 货品列表筛选
 */
export const goodsModalSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.huopinmingcheng' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        code: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.huohao' }),
            style: {
              width: 160,
            },
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.pinlei' }),
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
            placeholder: intl.formatMessage({ id: 'components.pinpai' }),
            fetchSearch: getProductSelectGetSelectBrand,
            style: {
              width: 160,
            },
          },
        },
        type: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.guigexinghao' }),
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

export const memberModalSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.qingshuruhuiyuanmingcheng' }),
      },
    },
  },
}
export const supplierModalSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.sousuo', defaultMessage: '搜索' }),
      },
    },
  },
}
export const inquirySchema: ISchema = {
  type: 'object',
  properties: {
    quotationNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.baojiadanhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          // flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        // @todo 需调整字段名
        // categoryId: {
        //   type: 'string',
        //   "x-component": 'SearchSelect',
        //   "x-component-props": {
        //     placeholder: '报价会员（全部）',
        //     className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
        //     fetchSearch: getProductSelectGetSelectCategory,
        //     style: {
        //       width: 160
        //     }
        //   }
        // },
        offerMemberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.baojiahuiyuan' }),
            style: {
              width: 160,
            },
          },
        },
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.baojiadanzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        inquiryListNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xunjiadanbianhao' }),
            style: {
              width: 160,
            },
          },
        },
        '[startDocumentsTime,endDocumentsTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/**
 * @description: 新增报价单 需求单查询
 * @param {type}
 * @return {type}
 */
export const enquirySchema: ISchema = {
  type: 'object',
  properties: {
    keywords: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.xuqiudanhaoxuqiudan' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        // @todo 需调整字段名
        demandMembers: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xuqiuhuiyuanquanbu' }),
            className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
            fetchSearch: getProductSelectGetSelectCategory,
            style: {
              width: 160,
            },
          },
        },
        '[startVoucherTime,endVoucherTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

export const demandSchema: ISchema = {
  type: 'object',
  properties: {
    quotationNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.baojiadanhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          // flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        // // @todo 需调整字段名
        // categoryId: {
        //   type: 'string',
        //   "x-component": 'SearchSelect',
        //   "x-component-props": {
        //     placeholder: '报价会员（全部）',
        //     className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
        //     fetchSearch: getProductSelectGetSelectCategory,
        //     style: {
        //       width: 160
        //     }
        //   }
        // },
        demandMembers: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xuqiuhuiyuan' }),
            style: {
              width: 160,
            },
          },
        },
        quotationSummary: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.baojiadanzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        requisitionFormNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xuqiudanbianhao' }),
            style: {
              width: 160,
            },
          },
        },
        '[startDocumentsTime,endDocumentsTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

export const mergeOrderSchema: ISchema = {
  type: 'object',
  properties: {
    keywords: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.dingdanhaodingdanzhaiyao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        // @todo 需调整字段名
        name: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.gongyinghuiyuanquanbu' }),
            className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
            fetchSearch: getProductSelectGetSelectCategory,
            style: {
              width: 160,
            },
          },
        },
        '[startDocumentsTime,endDocumentsTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

// 需求报价,选择对应需求单号
export const demandNumberSchema: ISchema = {
  type: 'object',
  properties: {
    requisitionFormNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.xuqiudanhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        demandMembers: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xuqiuhuiyuan' }),
          },
        },
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xuqiudanzhaiyao' }),
          },
        },
        '[startVoucherTime,endVoucherTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/** 物流选择发货单 */
export const logisticsDeliverySearchSchema: ISchema = {
  type: 'object',
  properties: {
    invoicesNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.fahuodanhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        orderNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.duiyingdingdanhao' }),
            style: {
              width: 160,
            },
          },
        },
        invoicesAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjuzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        invoicesTypeId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjuleixing' }),
            fetchSearch: getProductInvoicesTypeAll,
            style: {
              width: 160,
            },
          },
        },
        '[startTransactionTime,endTransactionTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

export const logisticsSelectGoodsSearchSchema: ISchema = {
  type: 'object',
  properties: {
    productName: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.shangpinmingcheng' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        brand: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.shangpinpinpai' }),
            style: {
              width: 160,
            },
          },
        },
        category: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.shangpinpinlei' }),
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/** 选择询价单 */
export const SelectRfqOrderSearchSchema: ISchema = {
  type: 'object',
  properties: {
    orderNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.xunjiadanhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xunjiahuiyuan' }),
            style: {
              width: 160,
            },
          },
        },
        details: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xunjiadanzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        '[startDocumentTime,endDocumentTime]': {
          type: 'string',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.danjushijianquanbu' }),
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}
/** 选择物流服务商 */
export const SelectLogisticsService: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.huiyuanmingcheng' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        roleId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.xuanzehuiyuanjuese' }),
            fetchSearch: () => {
              return new Promise((resolve) => {
                getMemberManageRoleAll().then((res) => {
                  res.data.forEach((item: any) => {
                    item.id = item.roleId
                    item.name = item.roleName
                  })
                  resolve(res)
                })
              })
            },
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/** 选择采购合同弹框筛选 */
export const contractSchema: ISchema = {
  type: 'object',
  properties: {
    contractNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.hetongbianhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        contractAbstract: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.hetongzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        partyBName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.hetongyifang' }),
            style: {
              width: 160,
            },
          },
        },
        // "[startTime,endTime]": {
        //   type: 'string',
        //   "x-component": "dateSelect",
        //   "x-component-props": {
        //     placeholder: '合同有效时间',
        //   }
        // },
        '[startTime, endTime]': {
          type: 'daterange',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'components.youxiaokaishishijian' }),
              intl.formatMessage({ id: 'components.youxiaojieshushijian' }),
            ],
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/** 选择请购单弹框筛选 */
export const requisitionSchema: ISchema = {
  type: 'object',
  properties: {
    requisitionNo: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.qinggoudanhao' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        digest: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.qinggoudanzhaiyao' }),
            style: {
              width: 160,
            },
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.gongyinghuiyuan' }),
            style: {
              width: 160,
            },
          },
        },
        '[startDate, endDate]': {
          type: 'daterange',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'components.yujiaokaishishijian' }),
              intl.formatMessage({ id: 'components.yujiaojieshushijian' }),
            ],
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

/** 选择组织机构弹框筛选 */
export const departmentSchema: ISchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.jigoudaima' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          style: {
            marginRight: 0,
          },
        },
        colStyle: {
          marginTop: 20,
        },
      },
      properties: {
        title: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.jigoumingcheng' }),
            style: {
              width: 160,
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'components.chaxun' }),
          },
        },
      },
    },
  },
}

export const requisitSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: '请输入姓名',
      },
    },
    // org: {
    //   type: 'string',
    //   "x-component": 'Search',
    //   "x-component-props": {
    //     placeholder: '请输入所属机构'
    //   }
    // },
    // jobTitle: {
    //   type: 'string',
    //   "x-component": 'Search',
    //   "x-component-props": {
    //     placeholder: '请输入职位'
    //   }
    // }
  },
}
