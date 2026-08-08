/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-09 15:56:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-04 18:02:43
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { UPLOAD_TYPE, DELIVERY_TYPE_ENUM } from '@/constants'

export const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 8,
        wrapperCol: 16,
        labelAlign: 'left',
      },
      properties: {
        deliveryType: {
          title: '配送方式',
          type: 'string',
          enum: DELIVERY_TYPE_ENUM,
          editable: false,
          'x-component-props': {
            style: {
              width: '80%',
            },
          },
        },
        deliveryAddress: {
          type: 'string',
          title: '退货收货地址',
          enum: [],
          'x-component-props': {
            placeholder: '请选择',
            style: {
              width: '80%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: '请选择退货收货地址',
            },
          ],
        },
        // 展示用
        shippingAddress: {
          type: 'object',
          title: '退货发货地址',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{Address}}',
          },
        },
        // 展示用
        pickupAddress: {
          type: 'object',
          title: '退货自提地址',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{Address}}',
          },
        },
        // 展示用
        deliveryAddressShow: {
          type: 'object',
          title: '退货收货地址',
          visible: false,
          'x-component': 'Children',
          'x-component-props': {
            children: '{{DeliveryAddress}}',
          },
        },
      },
    },
  },
}
