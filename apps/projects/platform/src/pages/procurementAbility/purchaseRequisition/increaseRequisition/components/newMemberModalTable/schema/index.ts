import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createRegisterFieldsSchema, ElementType } from '@/utils/createRegisterFieldSchema'

const intl = getIntl()

export const memberModalSchema: ISchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'space-between',
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'components.qingshuruhuiyuanmingcheng' }),
            advanced: false,
          },
        },
      },
    },
  },
}

export const materialSupplySchema = {
  type: 'object',
  properties: {
    megalayout: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'space-between',
        },
      },
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${getIntl().formatMessage({
              id: 'order.caigoushang',
              defaultMessage: '采购商',
            })}${getIntl().formatMessage({ id: 'purchaseRequisition.materialName', defaultMessage: '物料名称' })}`,
            align: 'flex-left',
          },
        },
      },
    },
    [FORM_FILTER_PATH]: {
      type: 'object',
      'x-component': 'flex-layout',
      'x-component-props': {
        rowStyle: {
          justifyContent: 'flex-start',
          flexWrap: 'nowrap',
        },
        colStyle: {
          //改变间隔
          marginRight: 20,
        },
      },
      properties: {
        PRO_LAYOUT: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-mega-props': {
            span: 5,
          },
          'x-component-props': {
            inline: true,
          },
          properties: {
            code: {
              type: 'string',
              'x-component-props': {
                placeholder: `${getIntl().formatMessage({
                  id: 'order.caigoushang',
                  defaultMessage: '采购商',
                })}${getIntl().formatMessage({ id: 'purchaseRequisition.wuliaobianhao', defaultMessage: '物料编号' })}`,
                style: {
                  width: 160,
                },
              },
            },
            type: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({
                  id: 'purchaseRequisition.guigexinghao',
                  defaultMessage: '规格型号',
                }),
                style: {
                  width: 160,
                },
              },
            },
            customerCategoryId: {
              type: 'string',
              'x-component': 'Cascader',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.management.maintain.query.categoryId.placeholder',
                  defaultMessage: '主营品类(全部)',
                }),
                allowClear: true,
                showSearch: true,
                fieldNames: { label: 'name', value: 'id', children: 'children' },
                changeOnSelect: true,
                expandTrigger: 'hover',
                multiple: false,
                style: {
                  width: 160,
                },
              },
            },
            brandId: {
              type: 'string',
              'x-component-props': {
                placeholder: getIntl().formatMessage({ id: 'purchaseRequisition.pinpai', defaultMessage: '品牌' }),
                style: {
                  width: 160,
                },
              },
              enum: [],
            },
          },
        },
        sumbit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: `${getIntl().formatMessage({ id: 'selfManagement.theQuery' })}`,
          },
        },
      },
    },
  },
}

/** 选择会员schema */
export const createSubMemberSchema = (registerFields: ElementType[]): ISchema => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'detail.purchase.placeholder16' }),
        align: 'flex-left',
        // tip: intl.formatMessage({ id: 'member.memberVisitManage.fullName.tip', defaultMessage: '输入 姓名 进行搜索' }),
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
      },
      properties: {
        memberType: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.memberTypeId.placeholder' }),
            allowClear: true,
          },
        },
        roleId: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.roleId.placeholde' }),
            allowClear: true,
          },
        },
        level: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.level.placeholder' }),
            allowClear: true,
          },
        },
        status: {
          type: 'string',
          enum: [],
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'member.management.maintain.query.status.placeholder' }),
            allowClear: true,
          },
        },
        code: {
          type: 'string',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.code.placeholder',
              defaultMessage: '会员编码',
            }),
          },
        },
        currencyType: {
          type: 'string',
          enum: [],
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.currencyType.placeholder',
              defaultMessage: '币别(全部)',
            }),
            allowClear: true,
          },
        },
        categoryId: {
          type: 'string',
          'x-component': 'Cascader',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.categoryId.placeholder',
              defaultMessage: '主营品类(全部)',
            }),
            allowClear: true,
            showSearch: true,
            fieldNames: { label: 'name', value: 'id', children: 'children' },
            changeOnSelect: true,
            expandTrigger: 'hover',
            multiple: false,
          },
        },
        ...(registerFields.length
          ? {
              memberConfigs: {
                type: 'object',
                'x-mega-props': {
                  span: 5,
                },
                properties: {
                  ...createRegisterFieldsSchema(registerFields),
                },
              },
            }
          : {}),
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'member.management.maintain.query.query' }),
          },
        },
      },
    },
  },
})
