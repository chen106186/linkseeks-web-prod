import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const querySchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({
          id: 'member.memberVisitManage.memberName.placeholder',
          defaultMessage: '搜索',
        }),
        align: 'flex-left',
        tip: intl.formatMessage({
          id: 'supplier.supplierVisitManage.supplierName.tip',
          defaultMessage: '输入 供应商名称 进行搜索',
        }),

        advanced: false,
      },
    },
  },
}
