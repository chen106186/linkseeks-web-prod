/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-09 15:56:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-21 14:14:26
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { DELIVERY_TYPE_ENUM } from '@/constants'

export const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 16,
        labelAlign: 'left',
      },
      properties: {
        deliveryType: {
          title: '配送方式',
          type: 'string',
          enum: DELIVERY_TYPE_ENUM,
          'x-component-props': {
            placeholder: '请选择',
            style: {
              width: '80%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: '请选择配送方式',
            },
          ],
        },
        deliveryAddress: {
          type: 'object',
          title: '换货收货地址',
          'x-component': 'Children',
          'x-component-props': {
            children: '{{Address}}',
          },
        },
        shippingAddress: {
          type: 'string',
          title: '换货发货地址',
          visible: false,
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
              message: '请选择换货发货地址',
            },
          ],
        },
        pickupAddress: {
          type: 'string',
          title: '换货自提地址',
          visible: false,
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
              message: '请选择换货自提地址',
            },
          ],
        },
        shippingAddressShow: {
          type: 'object',
          title: '换货发货地址',
          visible: false,
          'x-component': 'Children',
          'x-component-props': {
            children: '{{ShippingAddress}}',
          },
        },
      },
    },
  },
}
