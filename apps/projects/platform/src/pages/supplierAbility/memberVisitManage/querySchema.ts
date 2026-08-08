import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        grid: true,
      },
      properties: {
        ctl: {
          type: 'object',
          'x-component': 'RoleRuleConfigCtl',
        },
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.memberVisitManage.memberName.placeholder',
              defaultMessage: '搜索',
            }),
            tip: intl.formatMessage({
              id: 'supplier.supplierVisitManage.supplierName.tip',
              defaultMessage: '输入 供应商名称 进行搜索',
            }),
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
        MEGA_LAYOUT_1: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 5, // 同检索项数量
          },
          properties: {
            visitTheme: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitTheme',
                  defaultMessage: '拜访主题',
                }),
                allowClear: true,
              },
            },
            visitType: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitTypeName',
                  defaultMessage: '拜访类型',
                }),
                allowClear: true,
              },
            },
            visitLevel: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'member.memberVisitManage.visitLevelName',
                  defaultMessage: '拜访级别',
                }),
                allowClear: true,
              },
            },
            visitor: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.memberVisitManage.visitor', defaultMessage: '拜访人' }),
                allowClear: true,
              },
            },
            peer: {
              type: 'string',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'member.memberVisitManage.peer', defaultMessage: '同行人' }),
                allowClear: true,
              },
            },
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: intl.formatMessage({ id: 'common.button.search', defaultMessage: '查询' }),
          },
        },
      },
    },
  },
}
