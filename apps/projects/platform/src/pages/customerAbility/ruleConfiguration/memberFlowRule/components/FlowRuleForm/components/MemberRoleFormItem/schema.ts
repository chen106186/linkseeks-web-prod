/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 18:01:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:36:33
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

const querySchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-mega-props': {
        wrapperCol: 12,
      },
      'x-component': 'Search',
      'x-component-props': {
        placeholder: intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.name.placeholder' }),
        tip: intl.formatMessage({ id: 'member.memberFlowRule.components.MemberRoleFormItem.name.tip' }),
        advanced: false,
        align: 'flex-left',
      },
    },
  },
}

export default querySchema
