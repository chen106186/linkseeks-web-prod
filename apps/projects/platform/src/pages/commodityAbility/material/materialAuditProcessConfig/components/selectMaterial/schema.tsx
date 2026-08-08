import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        code: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
            align: 'flex-left',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
            },
            colStyle: {
              marginRight: 20,
            },
          },
          properties: {
            name: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
              },
            },
            // type: {
            //   type: 'string',
            //   "x-component-props": {
            //     placeholder: '物料规格'
            //   }
            // },
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
                changeOnSelect: true,
                expandTrigger: 'hover',
                multiple: false,
              },
            },
            categoryId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.category', defaultMessage: '品类' }),
                allowClear: true,
                style: { width: '150px' },
                showSearch: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                changeOnSelect: true,
                expandTrigger: 'hover',
                multiple: false,
              },
            },
            brandId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
                style: { width: '150px' },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: '提交',
              },
            },
          },
        },
      },
    },
  },
}
