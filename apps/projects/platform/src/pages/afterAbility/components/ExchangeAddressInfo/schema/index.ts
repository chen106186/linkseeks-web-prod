/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-09 15:56:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-17 11:24:23
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
            id: 'afterService.components.ExchangeAddressInfo.deliveryType',
            defaultMessage: '配送方式',
          }),
          type: 'string',
          enum: DELIVERY_TYPE_ENUM,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.ExchangeAddressInfo.deliveryType.placeholder',
              defaultMessage: '请选择',
            }),
            style: {
              width: '80%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.components.ExchangeAddressInfo.deliveryType.required',
                defaultMessage: '请选择配送方式',
              }),
            },
          ],
        },
        shippingAddress: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.ExchangeAddressInfo.deliveryAddress',
            defaultMessage: '换货发货地址',
          }),
          visible: true,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.ExchangeAddressInfo.deliveryAddress.placeholder',
              defaultMessage: '请选择',
            }),
            style: {
              width: '80%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.components.ExchangeAddressInfo.deliveryAddress.required',
                defaultMessage: '请选择换货发货地址',
              }),
            },
          ],
        },
        pickupAddress: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.ExchangeAddressInfo.pickupAddress',
            defaultMessage: '换货自提地址',
          }),
          visible: false,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.ExchangeAddressInfo.pickupAddress.placeholder',
              defaultMessage: '请选择',
            }),
            style: {
              width: '80%',
            },
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.components.ExchangeAddressInfo.pickupAddress.required',
                defaultMessage: '请选择换货自提地址',
              }),
            },
          ],
        },
        deliveryAddress: {
          type: 'object',
          title: intl.formatMessage({
            id: 'afterService.components.ExchangeAddressInfo.shippingAddress',
            defaultMessage: '换货收货地址',
          }),
          'x-component': 'Address',
        },
        shippingAddressShow: {
          type: 'object',
          title: intl.formatMessage({
            id: 'afterService.components.ExchangeAddressInfo.deliveryAddress',
            defaultMessage: '换货发货地址',
          }),
          visible: false,
          'x-component': 'ShippingAddress',
        },
      },
    },
  },
}
