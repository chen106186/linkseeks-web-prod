import type { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import styles from '../index.less'

export const goodsSearchSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: getIntl().formatMessage({
          id: 'commodity.deliverManagement.shangpinmingcheng',
          defaultMessage: '商品名称',
        }),
        align: 'flex-left',
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
        className: styles.megaLayoutContainer,
      },
      properties: {
        skuId: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.shangpinid',
              defaultMessage: '商品id',
            }),
            allowClear: true,
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinlei', defaultMessage: '品类' }),
            allowClear: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            style: { width: '150px' },
            showSearch: true,
            getPopupContainer: (triggerNode) => triggerNode.parentElement,
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinpai', defaultMessage: '品牌' }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            style: { width: 173 },
            searchValue: null,
            dataoption: [],
            getPopupContainer: (triggerNode) => triggerNode.parentElement,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'commodity.deliverManagement.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}

export const materialSearchSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: getIntl().formatMessage({
          id: 'commodity.deliverManagement.wuliaomingcheng',
          defaultMessage: '物料名称',
        }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 4,
        className: styles.megaLayoutContainer,
      },
      properties: {
        code: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.wuliaobianhao',
              defaultMessage: '物料编号',
            }),
            allowClear: true,
          },
        },
        type: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.guigexinghao',
              defaultMessage: '规格型号',
            }),
            allowClear: true,
          },
        },
        materialGroupId: {
          type: 'string',
          enum: [],
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'commodity.deliverManagement.wuliaozu',
              defaultMessage: '物料组',
            }),
            allowClear: true,
            showSearch: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            changeOnSelect: true,
            expandTrigger: 'hover',
            multiple: false,
            getPopupContainer: (triggerNode) => triggerNode.parentElement,
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinlei', defaultMessage: '品类' }),
            allowClear: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            style: { width: '150px' },
            showSearch: true,
            getPopupContainer: (triggerNode) => triggerNode.parentElement,
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'commodity.deliverManagement.pinpai', defaultMessage: '品牌' }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            style: { width: '221px' },
            searchValue: null,
            dataoption: [],
            getPopupContainer: (triggerNode) => triggerNode.parentElement,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'commodity.deliverManagement.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}
