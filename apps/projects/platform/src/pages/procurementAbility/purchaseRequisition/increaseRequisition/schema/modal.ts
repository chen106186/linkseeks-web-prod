import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

/**
 *  新增采购请购单 选择物料的筛选
 */
export const addRequesitionMaterialSchema: ISchema = {
  type: 'object',
  properties: {
    topLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        full: true,
        autoRow: true,
        justifyContent: 'flex-end',
        align: 'flex-right',
        className: 'sc-fzpans',
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{otherHandle}}',
          },
        },
        ctlRight: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-end',
            },
          },
          properties: {
            watch: {
              'x-component': 'Checkbox',
              title: translate('web.resource.order.zhichakangongyingshangkegongying'),
              'x-component-props': {
                disabled: true,
              },
            },
            code: {
              type: 'string',
              'x-component': 'SearchFilter',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'purchaseRequisition.qingshuruhuohao',
                  defaultMessage: '请输入物料编号',
                }),
              },
            },
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'wrap',
          width: '100%',
          justifyContent: 'flex-end',
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
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.materialName',
              defaultMessage: '物料名称',
            }),
            // style: { width: '174px' },
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.shangpinpinpai',
              defaultMessage: '商品品牌',
            }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            // style: { width: '145px' },
            searchValue: null,
            dataoption: [],
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'CustomCategorySearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.shangpinpinlei',
              defaultMessage: '商品品类',
            }),
            showSearch: true,
            notFoundContent: null,
            // style: { width: '145px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        materialGroupId: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: '物料组',
            allowClear: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            // style: { width: '145px' },
            showSearch: true,
          },
        },
        type: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.guigexinghao',
              defaultMessage: '规格型号',
            }),
            // style: { width: '174px' },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}

export const addRequesitionMaterialSchemaCheckbox: ISchema = {
  type: 'object',
  properties: {
    topLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        full: true,
        autoRow: true,
        justifyContent: 'flex-end',
        align: 'flex-right',
        className: 'sc-fzpans',
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{otherHandle}}',
          },
        },
        ctlRight: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-end',
            },
          },
          properties: {
            watch: {
              'x-component': 'Checkbox',
              title: '只查看供应商可供应物料',
              'x-component-props': {
                disabled: false,
              },
            },
            materialsTrademark: {
              type: 'string',
              'x-component': 'SearchFilter',
              'x-component-props': {
                placeholder: '请输入物料牌号',
              },
            },
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'wrap',
          width: '100%',
          justifyContent: 'flex-end',
          style: {
            marginRight: 0,
            marginTop: 0,
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
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.qingshuruhuohao',
              defaultMessage: '请输入物料编号',
            }),
          },
        },
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.materialName',
              defaultMessage: '物料名称',
            }),
            // style: { width: '174px' },
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.shangpinpinpai',
              defaultMessage: '商品品牌',
            }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            style: { width: '145px' },
            searchValue: null,
            dataoption: [],
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'CustomCategorySearch',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.shangpinpinlei',
              defaultMessage: '商品品类',
            }),
            showSearch: true,
            notFoundContent: null,
            style: { width: '145px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        materialGroupId: {
          type: 'string',
          'x-component': 'CustomCategorySearch',
          'x-component-props': {
            placeholder: '物料组',
            showSearch: true,
            notFoundContent: null,
            style: { width: '145px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        type: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.guigexinghao',
              defaultMessage: '规格型号',
            }),
            // style: { width: '174px' },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: getIntl().formatMessage({ id: 'purchaseRequisition.chaxun', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}
