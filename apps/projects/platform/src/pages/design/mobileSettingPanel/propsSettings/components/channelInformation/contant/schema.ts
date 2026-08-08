import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'
import { getProductSelectGetSelectCategory } from '@apps/apis'
import { getProductMobileShopStoreGetBrand } from '@apps/apis'

const intl = getIntl()

export const formProduct: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'common.text.search' }),
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
            placeholder: intl.formatMessage({ id: 'editor.form.category.required' }),
            className: 'fixed-ant-selected-down', // 该类强制将显示的下拉框出现在select下, 只有这里出现问题, ??
            queryParams: {
              storeId: 2,
            },
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
            placeholder: intl.formatMessage({ id: 'editor.form.brand.required' }),
            queryParams: {
              storeId: 2,
            },
            fetchSearch: getProductMobileShopStoreGetBrand,
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
            children: intl.formatMessage({ id: 'common.button.query' }),
          },
        },
      },
    },
  },
}

export const basicSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'common.text.search' }),
        align: 'flex-left',
      },
    },
  },
}
