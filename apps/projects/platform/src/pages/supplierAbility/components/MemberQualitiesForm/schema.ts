/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-27 17:31:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-27 17:44:31
 * @Description:
 */
import { ISchema } from '@apps/formily'

export const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'Mega-Layout',
      properties: {
        qualities: {
          type: 'string',
          'x-component': 'QualitiesUploadFormItem',
          'x-component-props': {},
        },
      },
    },
  },
}
