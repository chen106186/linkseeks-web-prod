/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-23 11:02:17
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-10-20 11:11:00
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { UPLOAD_TYPE } from '@/constants'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

export const evaluateSchema: ISchema = {
  type: 'object',
  properties: {
    comments: {
      type: 'array',
      'x-component': 'EvaluationList',
      default: [],
      items: {
        type: 'object',
        properties: {
          MEGA_LADYOUT: {
            type: 'object',
            'x-component': 'mega-Layout',
            'x-component-props': {
              labelCol: 12,
              labelAlign: 'left',
              full: true,
            },
            properties: {
              star: {
                title: '满意程度',
                required: true,
                'x-component': 'Rating',
                'x-component-props': {
                  allowHalf: false,
                },
              },
              comment: {
                type: 'string',
                title: '评价',
                required: true,
                'x-component': 'TextArea',
                'x-component-props': {
                  rows: 4,
                },
              },
              picture: {
                type: 'string',
                title: '图片',
                'x-component': 'Upload',
                'x-component-props': {
                  listType: 'card',
                  action: '/api/support/file/upload/prefix',
                  data: {
                    fileType: UPLOAD_TYPE,
                    prefix: FILE_PREFIX_ENUM.ORDER_SERVICE,
                  },
                  beforeUpload: '{{beforeUpload}}',
                  accept: '.png, .jpg, .jpeg',
                },
                'x-mega-props': {
                  addonAfter: '{{UploadTip}}',
                },
              },
            },
          },
        },
      },
    },
  },
}
