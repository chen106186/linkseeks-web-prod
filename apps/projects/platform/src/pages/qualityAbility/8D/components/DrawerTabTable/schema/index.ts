import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const memberModalSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'space-between',
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'components.qingshuruhuiyuanmingcheng' }),
            advanced: false,
          },
        },
      },
    },
  },
}

// 质检单
export const materialSupplySchema = {
  type: 'object',
  properties: {
    qualityNo: {
      type: 'string',
      'x-component': 'Search',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'eightD.sousuodanhao', defaultMessage: '搜索单号' }),
        align: 'flex-left',
      },
    },
    PRO_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 5,
      },
      properties: {
        skuId: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.shangpinskuId', defaultMessage: '商品skuId' }),
          },
        },
        productName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.shangpinmingcheng', defaultMessage: '商品名称' }),
          },
        },
        category: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.pinlei', defaultMessage: '品类' }),
            allowClear: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            showSearch: true,
            style: {
              width: 160,
            },
            enum: [],
          },
        },
        receiveNo: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.dingdanhao', defaultMessage: '订单号' }),
            style: {
              width: 160,
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'eightD.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}

/** 选择商品schema */
export const shopSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'eightD.shangpinmingcheng', defaultMessage: '商品名称' }),
        align: 'flex-left',
        // tip: intl.formatMessage({ id: 'member.memberVisitManage.fullName.tip',defaultMessage: '输入 姓名 进行搜索' }),
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
        productId: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.shangpinid', defaultMessage: '商品id' }),
            allowClear: true,
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.pinlei', defaultMessage: '品类' }),
            allowClear: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            style: { width: '150px' },
            showSearch: true,
          },
        },
        brandId: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.pinpai', defaultMessage: '品牌' }),
            style: {
              width: 160,
            },
          },
          enum: [],
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'eightD.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}

/** 选择物料schema */
export const materialSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'eightD.wuliaomingcheng', defaultMessage: '物料名称' }),
        align: 'flex-left',
        // tip: intl.formatMessage({ id: 'member.memberVisitManage.fullName.tip',defaultMessage: '输入 姓名 进行搜索' }),
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
        code: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.wuliaobianhao', defaultMessage: '物料编号' }),
            allowClear: true,
          },
        },
        type: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.guigexinghao', defaultMessage: '规格型号' }),
            allowClear: true,
          },
        },
        materialGroupId: {
          type: 'string',
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.wuliaozu', defaultMessage: '物料组' }),
            allowClear: true,
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.pinlei', defaultMessage: '品类' }),
            allowClear: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            style: { width: '150px' },
            showSearch: true,
          },
        },
        brandId: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'eightD.pinpai', defaultMessage: '品牌' }),
            style: {
              width: 160,
            },
          },
          enum: [],
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'eightD.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}
