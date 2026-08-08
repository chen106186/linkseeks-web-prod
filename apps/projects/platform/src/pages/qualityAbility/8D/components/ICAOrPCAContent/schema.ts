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
        // 8D编码
        org: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            align: 'flex-left',
            placeholder: '部门',
            tip: '请输入部门进行搜索',
          },
        },
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
        name: {
          type: 'string',
          'x-component-props': {
            placeholder: '姓名',
            allowClear: true,
          },
        },
        phone: {
          type: 'string',
          'x-component-props': {
            placeholder: '电话',
            allowClear: true,
          },
        },
        submit: {
          'x-component': 'Submit',
          'x-mega-props': {
            span: 1,
          },
        },
      },
    },
  },
}
