import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const CommoditySchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-component': 'ModalSearch',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'common.text.search' }),
        allowClear: true,
        align: 'flex-start',
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
        },
        colStyle: {
          marginRight: 20,
        },
      },
      properties: {
        idInList: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'editor.columns.commodityId' }),
            allowClear: true,
          },
        },
        memberName: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'editor.columns.memberName' }),
            allowClear: true,
          },
        },
        brandId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'editor.columns.brand' }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            style: { width: '174px' },
            searchValue: null,
            dataoption: [],
            // fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        customerCategoryId: {
          type: 'string',
          'x-component': 'CustomInputSearch',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'editor.columns.category' }),
            showSearch: true,
            showArrow: true,
            defaultActiveFirstOption: false,
            filterOption: false,
            notFoundContent: null,
            style: { width: '174px' },
            searchValue: null,
            dataoption: [],
            // fieldNames: { label: 'name', value: 'id', children: 'children' },
          },
        },
        '[publishStartTime,publishEndTime]': {
          type: 'array',
          'x-component': 'DateRangePickerUnix',
          'x-component-props': {
            placeholder: [
              intl.formatMessage({ id: 'common.form.startTime.placeholder' }),
              intl.formatMessage({ id: 'common.form.endTime.placeholder' }),
            ],
            allowClear: true,
          },
        },
        sumbit: {
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

export default CommoditySchema
