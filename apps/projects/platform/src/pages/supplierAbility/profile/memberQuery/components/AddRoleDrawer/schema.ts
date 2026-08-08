/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-26 14:26:06
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 18:41:26
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'

const intl = getIntl()

const schema: ISchema = {
  type: 'object',
  properties: {
    tip: {
      type: 'object',
      'x-component': 'Children',
      'x-component-props': {
        children: intl.formatMessage({ id: 'member.memberQuery.components.AddRoleDrawer.description' }),
      },
    },
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        labelCol: 5,
        wrapperCol: 18,
        labelAlign: 'left',
      },
      properties: {
        upperMemberId: {
          type: 'string',
          title: intl.formatMessage({ id: 'supplier.supplierQuery.components.AddRoleDrawer.uppersupplier' }),
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'member.memberQuery.components.AddRoleDrawer.upperMember.placeholder',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'supplier.supplierQuery.components.AddRoleDrawer.uppersupplier.required',
              }),
            },
          ],
          enum: [],
          visible: false,
        },
        memberType: {
          type: 'string',
          title: intl.formatMessage({ id: 'member.memberQuery.components.AddRoleDrawer.memberTypeId' }),
          'x-component': 'Radio',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'member.memberQuery.components.AddRoleDrawer.memberTypeId.rules-required',
              }),
            },
          ],
          enum: [],
        },
        roleId: {
          type: 'string',
          title: intl.formatMessage({ id: 'member.memberQuery.components.AddRoleDrawer.roleId' }),
          'x-component': 'Radio',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'member.memberQuery.components.AddRoleDrawer.roleId.rules-required' }),
            },
          ],
          enum: [],
        },
      },
    },
  },
}

export default schema
