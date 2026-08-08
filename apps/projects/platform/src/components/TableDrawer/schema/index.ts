import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectCategory,
  getProductSelectGetSelectCustomerCategory,
} from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export const productModalByMemberSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.qingshurushangpinmingchengID' }),
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
export const inquirySchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.baojiadanhaoxuqiudan' }),
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
        categoryId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.baojiahuiyuanquanbu' }),
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
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'components.baojiadanhaoxuqiudan' }),
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
        categoryId: {
          type: 'string',
          'x-component': 'SearchSelect',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'components.baojiahuiyuanquanbu' }),
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
