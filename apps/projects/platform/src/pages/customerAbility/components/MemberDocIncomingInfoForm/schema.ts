/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-27 16:38:20
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-30 16:34:59
 * @Description:
 */
import { ISchema } from '@apps/formily'
import themeConfig from '@apps/config/lingxi.theme.config'
import { createMemberSchema, ElementType, getIncomingInfoAnchorKey } from '../../utils'

export type GroupItem = {
  /**
   * 组名
   */
  groupName: string
  /**
   * 元素
   */
  elements: ElementType[]
}

export const schemaPro = (groups: GroupItem[]): ISchema => {
  const groupArr = groups || []
  const depositSchema: ISchema = {
    type: 'object',
    properties: {},
  }
  groupArr.forEach((item, index) => {
    depositSchema.properties[`DEPOSIT_GROUP_${index}`] = {
      type: 'object',
      'x-component': 'MellowCardBox',
      'x-component-props': {
        title: item.groupName,
        id: getIncomingInfoAnchorKey(index),
        style: {
          marginBottom: index !== groupArr.length - 1 ? themeConfig['@margin-md'] : 0,
        },
      },
      properties: {
        MEGA_LADYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            // grid: true,
            // full: true,
            // autoRow: true,
            // columns: 2,
            // labelWidth: 144,
            // labelAlign: 'left',
            labelCol: 4,
            wrapperCol: 20,
            labelAlign: 'left',
          },
          properties: createMemberSchema(item.elements),
        },
      },
    }
  })
  return depositSchema
}
