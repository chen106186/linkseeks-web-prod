import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { createRegisterFieldsSchema, ElementType } from '@/utils/createRegisterFieldSchema'

const intl = getIntl()

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
        // tip: intl.formatMessage({ id: 'member.memberVisitManage.fullName.tip' }, { default: '输入 姓名 进行搜索' }),
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
        memberTypeId: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.memberTypeId.placeholder',
            }),
            allowClear: true,
          },
        },
        roleId: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.roleId.placeholde',
            }),
            allowClear: true,
          },
        },
        level: {
          type: 'string',
          default: undefined,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.level.placeholder',
            }),
            allowClear: true,
          },
        },
        status: {
          type: 'string',
          enum: [],
          default: undefined,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.management.maintain.query.status.placeholder',
            }),
            allowClear: true,
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
