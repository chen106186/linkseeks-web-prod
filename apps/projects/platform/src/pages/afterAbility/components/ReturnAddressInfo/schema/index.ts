/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-09 15:56:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-16 19:56:29
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { DELIVERY_TYPE_ENUM } from '@/constants/afterService'

const intl = getIntl()

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
        grid: true,
        full: true,
      },
      properties: {
        deliveryType: {
          title: intl.formatMessage({
            id: 'afterService.components.ReturnAddressInfo.deliveryType',
            defaultMessage: '配送方式',
          }),
          type: 'string',
          enum: DELIVERY_TYPE_ENUM,
          editable: false,
        },
        deliveryAddress: {
          type: 'string',
          'x-component': 'CustomAddressSelect',
          title: intl.formatMessage({
            id: 'afterService.components.ReturnAddressInfo.shippingAddress',
            defaultMessage: '退货收货地址',
          }),
          'x-component-props': {
            addressType: 1,
            isDefaultAddress: true,
            placeholder: intl.formatMessage({
              id: 'afterService.components.ReturnAddressInfo.shippingAddress.placeholder',
              defaultMessage: '请选择',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.components.ReturnAddressInfo.shippingAddress.required',
                defaultMessage: '请选择退货收货地址',
              }),
            },
          ],
        },
        // 展示用
        shippingAddress: {
          type: 'object',
          title: intl.formatMessage({
            id: 'afterService.components.ReturnAddressInfo.deliveryAddress',
            defaultMessage: '退货发货地址',
          }),
          'x-component': 'Address',
        },
        // 展示用
        pickupAddress: {
          type: 'object',
          title: intl.formatMessage({
            id: 'afterService.components.ReturnAddressInfo.pickupAddress',
            defaultMessage: '退货自提地址',
          }),
          visible: false,
          'x-component': 'Address',
        },
        // 展示用
        deliveryAddressShow: {
          type: 'object',
          title: intl.formatMessage({
            id: 'afterService.components.ReturnAddressInfo.shippingAddress',
            defaultMessage: '退货收货地址',
          }),
          visible: false,
          'x-component': 'DeliveryAddress',
        },
      },
    },
  },
}
