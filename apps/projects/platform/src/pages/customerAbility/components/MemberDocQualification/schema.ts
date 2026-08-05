/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-07 15:11:27
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-18 17:36:05
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
        },
      },
    },
  },
}
