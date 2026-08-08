import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

type Options = {
  showStatus: boolean
}

export const getSchema = (options: Options, extraSchema?: any) => {
  const schema: ISchema = {
    type: 'object',
    properties: {
      megaLayout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          topLayout: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              grid: true,
            },
            properties: {
              ctl: {
                type: 'object',
                'x-component': 'controllerBtns',
              },
              code: {
                type: 'string',
                'x-component': 'Search',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
                },
              },
            },
          },
          [FORM_FILTER_PATH]: {
            type: 'object',
            'x-component': 'flex-layout',
            'x-component-props': {
              colStyle: {
                marginLeft: 20,
              },
            },
            properties: {
              name: {
                type: 'string',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
                  allowClear: true,
                },
              },
              materialGroupId: {
                type: 'string',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'material.group.title', defaultMessage: '物料组' }),
                  allowClear: true,
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                  style: { width: '150px' },
                  showSearch: true,
                  getPopupContainer: () => document.querySelector('main'),
                },
              },
              brandId: {
                type: 'string',
                enum: [],
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
                  allowClear: true,
                  showSearch: true,
                  style: { width: '150px' },
                  getPopupContainer: () => document.querySelector('main'),
                },
              },
              customerCategoryId: {
                type: 'string',
                'x-component': 'Cascader',
                'x-component-props': {
                  placeholder: getIntl().formatMessage({ id: 'material.category', defaultMessage: '品类' }),
                  allowClear: true,
                  style: { width: '150px' },
                  showSearch: true,
                  fieldNames: { label: 'name', value: 'id', children: 'children' },
                  getPopupContainer: () => document.querySelector('main'),
                },
              },
              status: {
                type: 'string',
                visible: options.showStatus,
                'x-component-props': {
                  placeholder: getIntl().formatMessage({
                    id: 'material.interiorStateName',
                    defaultMessage: '内部状态',
                  }),
                  allowClear: true,
                  enum: [],
                  getPopupContainer: () => document.querySelector('main'),
                },
              },
              ...extraSchema,
              submit: {
                'x-component': 'Submit',
                'x-mega-props': {
                  span: 1,
                },
                'x-component-props': {
                  children: getIntl().formatMessage({ id: 'handling.chaxun' }),
                },
              },
            },
          },
        },
      },
    },
  }
  return schema
}

export const mixSchema = (data: any) => {
  const schema: ISchema = {}
  for (let key in data) {
    if (data[key].type === 1) {
      //单选
      schema[`customerCategoryId${data[key].id}t${data[key].type}`] = {
        type: 'string',
        enum: data[key].attributeValueList,
        'x-component-props': {
          placeholder: data[key].name,
          allowClear: true,
          showSearch: true,
          style: { width: '150px' },
          fieldNames: { label: 'value', value: 'id' },
        },
      }
    } else if (data[key].type === 2) {
      //多选
      schema[`customerCategoryId${data[key].id}t${data[key].type}`] = {
        type: 'string',
        enum: data[key].attributeValueList,
        'x-component-props': {
          placeholder: data[key].name,
          allowClear: true,
          showSearch: true,
          style: { width: '150px' },
          fieldNames: { label: 'value', value: 'id' },
        },
      }
    } else {
      //3 -输入
      schema[`customerCategoryId${data[key].id}t${data[key].type}`] = {
        type: 'string',
        'x-component-props': {
          placeholder: data[key].name,
          allowClear: true,
        },
      }
    }
  }
  return schema
}
