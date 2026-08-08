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
        children: intl.formatMessage({
          id: 'supplier.enterpriseBasicInfo.component.text',
          defaultMessage: '您需要增加的会员角色是：',
        }),
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
          title: intl.formatMessage({
            id: 'supplier.supplierQuery.components.AddRoleDrawer.uppersupplier',
            defaultMessage: '上级企业名称',
          }),
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'supplier.enterpriseBasicInfo.component.rules',
              defaultMessage: '请选择',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'supplier.supplierQuery.components.AddRoleDrawer.uppersupplier.required',
                defaultMessage: '请选择上级企业名称',
              }),
            },
          ],
          enum: [],
          visible: false,
        },
        memberType: {
          type: 'string',
          title: intl.formatMessage({
            id: 'supplier.enterpriseBasicInfo.component.memberType',
            defaultMessage: '会员类型',
          }),
          'x-component': 'Radio',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'supplier.enterpriseBasicInfo.component.rulesMemberType',
                defaultMessage: '请选择会员类型',
              }),
            },
          ],
          enum: [],
        },
        roleId: {
          type: 'string',
          title: intl.formatMessage({
            id: 'supplier.enterpriseBasicInfo.component.memberRole',
            defaultMessage: '会员角色',
          }),
          'x-component': 'Radio',
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'supplier.enterpriseBasicInfo.component.rulesMemberRole',
                defaultMessage: '请选择会员角色',
              }),
            },
          ],
          enum: [],
        },
      },
    },
  },
}

export default schema
