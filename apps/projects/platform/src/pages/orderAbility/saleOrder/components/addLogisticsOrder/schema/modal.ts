import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

/**
 *  新增采购请购单 选择物料的筛选
 */
export const addRequesitionMaterialSchema: ISchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: getIntl().formatMessage({
          id: 'purchaseRequisition.qingshuruhuohao',
          defaultMessage: '请输入物料编号',
        }),
        align: 'flex-start',
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
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: getIntl().formatMessage({
              id: 'purchaseRequisition.huopinmingcheng',
              defaultMessage: '物料名称',
            }),
            style: { width: '174px' },
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
            style: { width: '174px' },
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
            style: { width: '174px' },
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
            style: { width: '174px' },
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
        submit1: {
          'x-component': 'Children',
          'x-component-props': {
            children: '{{otherHandle}}',
          },
        },
      },
    },
  },
}
