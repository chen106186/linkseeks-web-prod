import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

export const schema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          // 'x-component-props': {
          //   className: 'useMegaStart'
          // },
          properties: {
            code: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
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
            name: {
              type: 'string',
              'x-component-props': {
                allowClear: true,
                placeholder: getIntl().formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
              },
            },
            materialGroupId: {
              type: 'string',
              enum: [],
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.group.title', defaultMessage: '物料组' }),
                allowClear: true,
                style: {
                  width: 150,
                },
                showSearch: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            customerCategoryId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.category', defaultMessage: '品类' }),
                allowClear: true,
                style: { width: 150 },
                showSearch: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
              },
            },
            brandId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
                style: { width: 150 },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: getIntl().formatMessage({ id: 'common.button.query', defaultMessage: '查询' }),
              },
            },
          },
        },
      },
    },
  },
}
