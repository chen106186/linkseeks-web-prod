/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-09 10:50:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-31 10:35:24
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
      },
      properties: {
        deliveryAddress: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.ManualDeliveryModal.deliveryAddress',
            defaultMessage: '发货地址',
          }),
          enum: [],
          required: true,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.ManualDeliveryModal.deliveryAddress.placeholder',
              defaultMessage: '请选择',
            }),
          },
        },
        deliveryAddressTxt: {
          title: intl.formatMessage({
            id: 'afterService.components.ManualDeliveryModal.deliveryAddress',
            defaultMessage: '发货地址',
          }),
          type: 'string',
          display: false,
        },
        deliveryTime: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.ManualDeliveryModal.deliveryTime',
            defaultMessage: '发货时间',
          }),
          'x-component': 'DatePicker',
          required: true,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.ManualDeliveryModal.deliveryTime.placeholder',
              defaultMessage: '请选择',
            }),
            showTime: true,
            style: { width: '100%' },
          },
        },
        logisticsOrderNo: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.ManualDeliveryModal.logisticsOrderNo',
            defaultMessage: '发货单号',
          }),
          required: true,
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.ManualDeliveryModal.logisticsOrderNo.placeholder',
              defaultMessage: '请输入',
            }),
          },
        },
        logisticsOrderNoTxt: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.ManualDeliveryModal.logisticsOrderNo',
            defaultMessage: '发货单号',
          }),
          visible: false,
          'x-component': 'Children',
          'x-component-props': {
            children: '{{LogisticsOrderNo}}',
          },
        },
        logisticsName: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.ManualDeliveryModal.logisticsName',
            defaultMessage: '物流公司',
          }),
          required: true,
          enum: [],
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.ManualDeliveryModal.logisticsName.placeholder',
              defaultMessage: '请选择',
            }),
          },
        },
        logisticsNameTxt: {
          title: intl.formatMessage({
            id: 'afterService.components.ManualDeliveryModal.logisticsName',
            defaultMessage: '物流公司',
          }),
          type: 'string',
          display: false,
        },
      },
    },
  },
}
