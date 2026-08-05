/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 15:55:18
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-02 17:30:00
 * @Description:
 */
import { ISchema } from '@apps/formily'

const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        date: {
          type: 'string',
          title: '时间',
          required: true,
          'x-component': 'DatePicker',
          'x-component-props': {
            showTime: true,
            style: {
              width: '100%',
            },
            disabled: true,
          },
        },
        reason: {
          type: 'string',
          title: '原因',
          'x-component': 'textarea',
          required: true,
          'x-component-props': {
            placeholder: '在此输入你的内容，最长100个字符，50个汉字',
            rows: 4,
          },
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 100,
            },
          ],
        },
      },
    },
  },
}

export default schema
