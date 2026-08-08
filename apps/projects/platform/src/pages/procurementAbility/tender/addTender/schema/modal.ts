import { FORM_FILTER_PATH } from '@/formSchema/const'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'
import { ISchema } from '@apps/formily'
import { getIntl, useIntl } from '@linkseeks/i18n'
const intl = getIntl()

// 关联投标商品schema
export const relevanceSchema: ISchema = {
  type: 'object',
  properties: {
    Text_0: {
      type: 'object',
      'x-index': 0,
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'table.purchase.jibenxinxi' }),
      },
      properties: {
        NO_SUBMIT_LAYOUT_1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'top',
            full: true,
          },
          properties: {
            bidMaterial: {
              type: 'object',
              title: intl.formatMessage({ id: 'table.purchase.duiyingzhaobiaowu' }),
              'x-component': 'CustomLayout',
              'x-component-props': {
                headerBackgroundColor: '#E4F7EF',
                headerColor: '#00A98F',
              },
            },
            tenderProduct: {
              type: 'object',
              title: intl.formatMessage({ id: 'table.purchase.toubiaoshangpin' }),
              'x-component': 'CustomLayout',
              'x-component-props': {
                showStar: true,
                headerBackgroundColor: '#F0F7FF',
                headerColor: '#3877FF',
                whetherSelect: true,
              },
            },
          },
        },
      },
    },
    Text_99: {
      type: 'object',
      'x-index': 99,
      'x-component': 'CustomTitle',
      'x-component-props': {
        text: intl.formatMessage({ id: 'table.purchase.fujian' }),
      },
      properties: {
        file: {
          title: intl.formatMessage({ id: 'table.purchase.fujian' }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: 1,
              prefix: FILE_PREFIX_ENUM.PURCHASE_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
          'x-rules': [
            {
              required: false,
              message: intl.formatMessage({ id: 'detail.purchase.message57' }),
            },
          ],
          // description: intl.formatMessage({ id: 'table.purchase.yicishangchuanyi' }),
        },
      },
    },
  },
}

// 选择商品抽屉高级筛选
export const productSearch: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'detail.purchase.goodstName' }),
        align: 'flex-left',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'wrap',
          width: '100%',
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
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'table.purchase.shangpinpinpai' }),
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
            placeholder: intl.formatMessage({ id: 'table.purchase.shangpinpinlei' }),
            showSearch: true,
            notFoundContent: null,
            style: { width: '174px' },
            dataoption: [],
            fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'table.purchase.chaxun' }),
          },
        },
      },
    },
  },
}
