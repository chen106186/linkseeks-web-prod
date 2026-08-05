import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

export const querySchema: ISchema = {
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
              'x-component': 'ControllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.memberQuery.query.name.placeholder' }),
                tip: intl.formatMessage({ id: 'supplier.supplierQuery.query.name.tip' }),
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
            outerStatus: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.memberQuery.query.outerStatus.placeholder' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[startDate, endDate]': {
              type: 'string',
              default: '',
              'x-component': 'dateSelect',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.memberQuery.query.date.placeholder' }),
                allowClear: true,
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
                children: intl.formatMessage({ id: 'member.memberQuery.query.query' }),
              },
            },
          },
        },
      },
    },
  },
}

const getFieldType = (field) => {
  if (field.fieldType === 'upload') {
    return {
      type: 'string',
      required: field.fieldEmpty === 0,
      title: field.fieldCNName,
      default: field.fieldValue,
      'x-component': 'CustomUpload',
      'x-component-props': {
        showDesc: false,
        disabled: field.disabled,
      },
    }
  }
  return {
    type: 'string',
    required: field.fieldEmpty === 0,
    title: field.fieldCNName,
    default: field.fieldValue,
    'x-component-props': {
      placeholder: field.fieldRemark,
      disabled: field.disabled,
    },
  }
}

const getComponentValue = (elements: any) => {
  const components = {}

  for (let item of elements) {
    components[item.fieldName] = getFieldType(item)
  }
  return components
}

export const initDetailSchema = (props: any) => {
  let tabSchema: ISchema = {
    properties: {},
  }

  if (Array.isArray(props)) {
    for (let [index, item] of props.entries()) {
      tabSchema.properties[`tab-${index}`] = {
        type: 'object',
        'x-component': 'TabPane',
        'x-component-props': {
          tab: item.groupName,
        },
        properties: {
          [`MEGA_LAYOUT${index}`]: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              labelCol: 4,
              wrapperCol: 8,
              labelAlign: 'left',
            },
            properties: getComponentValue(item.elements),
          },
        },
      }
    }
  }

  let detailSchema: ISchema = {
    type: 'object',
    properties: {
      tabs: {
        type: 'object',
        'x-component': 'Tab',
        'x-component-props': {
          type: 'card',
        },
        ...tabSchema,
      },
    },
  }
  const maintianDetailSchema: ISchema = detailSchema
  return maintianDetailSchema
}
