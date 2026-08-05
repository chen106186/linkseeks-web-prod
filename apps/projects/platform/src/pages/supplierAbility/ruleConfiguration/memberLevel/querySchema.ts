import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
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
            placeholder: translate('web.common.search'),
            tip: translate('web.resource.member.tip_levelTagSearch'),
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
            placeholder: translate('web.resource.member.memberRoleName'),
            allowClear: true,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
          'x-component-props': {
            children: translate('web.common.chaxun'),
          },
        },
      },
    },
  },
}
