/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 15:51:19
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-03 17:19:58
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { createMemberSchema, ElementType } from '../../utils'

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

/**
 *
 * @param groups
 * @param editable 有值的元素是否可编辑
 * @returns
 */
export const schema = (groups: GroupItem[], editable: boolean = false): ISchema => {
  const tabSchema: ISchema = {
    properties: {},
  }

  if (Array.isArray(groups)) {
    for (let [index, item] of groups.entries()) {
      tabSchema.properties[`tab-${index}`] = {
        type: 'object',
        'x-component': 'TabPane',
        'x-component-props': {
          tab: item.groupName,
        },
        properties: {
          [`MEGA_LAYOUT${index}`]: {
            type: 'object',
            'x-component': 'Mega-Layout',
            'x-component-props': {
              labelCol: 4,
              wrapperCol: 20,
              labelAlign: 'left',
            },
            properties: createMemberSchema(item.elements, editable),
          },
        },
      }
    }
  }

  return {
    type: 'object',
    properties: {
      tabs: {
        type: 'object',
        'x-component': 'Tab',
        'x-component-props': {
          type: 'card',
        },
        ...tabSchema,
      },
    },
  }
}
