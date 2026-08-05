import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'

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
        levelTag: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索',
            tip: '输入 会员等级标签 进行搜索',
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
        roleName: {
          type: 'string',
          'x-component-props': {
            placeholder: '会员角色名称',
            allowClear: true,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: '查询',
          },
        },
      },
    },
  },
}
