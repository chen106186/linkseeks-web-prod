/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-19 18:08:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-10-21 13:58:50
 * @Description:
 */
import { ISchema } from '@apps/formily'

export const searchSchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        inline: true,
      },
      properties: {
        star: {
          type: 'string',
          enum: [
            {
              label: '一星',
              value: 1,
            },
            {
              label: '二星',
              value: 2,
            },
            {
              label: '三星',
              value: 3,
            },
            {
              label: '四星',
              value: 4,
            },
            {
              label: '五星',
              value: 5,
            },
          ],
          'x-component-props': {
            placeholder: '评论星级',
            allowClear: true,
            style: {
              width: 206,
            },
          },
        },
        '[dealTimeStart, dealTimeEnd]': {
          type: 'string',
          default: '',
          'x-component': 'dateSelect',
          'x-component-props': {
            placeholder: '交易时间',
            allowClear: true,
            style: {
              width: 206,
            },
          },
        },
        memberName: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: '搜索',
            align: 'flex-left',
            advanced: false,
          },
        },
      },
    },
  },
}
