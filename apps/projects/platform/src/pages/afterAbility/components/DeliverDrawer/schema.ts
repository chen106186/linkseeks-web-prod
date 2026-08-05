/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-17 10:24:07
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-17 10:24:07
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { PATTERN_MAPS } from '@/constants/regExp'
import { dateLocale } from '@/components/NiceForm/utils/locale'

const intl = getIntl()

export const TYPE_NAME_MAP = {
  2: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.type.replace', defaultMessage: '换货' }),
  3: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.type.refund', defaultMessage: '退货' }),
}

export const FLOW_TYPE_NAME_MAP = {
  exchangeDeliver: intl.formatMessage({
    id: 'afterService.components.DeliverDrawer.flow.replace',
    defaultMessage: '换货',
  }),
  returnDeliver: intl.formatMessage({
    id: 'afterService.components.DeliverDrawer.flow.refund',
    defaultMessage: '退货',
  }),
}

export const createSchema = (type: 2 | 3, flowType: 'returnDeliver' | 'exchangeDeliver'): ISchema => ({
  type: 'object',
  properties: {
    productList: {
      type: 'array',
      'x-component': 'ArrayTable',
      'x-component-props': {
        renderAddition: () => null,
        renderRemove: () => null,
        renderMoveDown: () => null,
        renderMoveUp: () => null,
        operationsWidth: 1,
      },
      items: {
        type: 'object',
        properties: {
          orderNo: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.orderNo',
              defaultMessage: '订单号',
            }),
            editable: false,
          },
          productId: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.productId',
              defaultMessage: '商品ID',
            }),
            editable: false,
          },
          productName: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.productName',
              defaultMessage: '商品名称',
            }),
            editable: false,
          },
          category: {
            type: 'string',
            title: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.category', defaultMessage: '品类' }),
            editable: false,
          },
          brand: {
            type: 'string',
            title: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.brand', defaultMessage: '品牌' }),
            editable: false,
          },
          unit: {
            type: 'string',
            title: intl.formatMessage({ id: 'afterService.components.DeliverDrawer.unit', defaultMessage: '单位' }),
            editable: false,
          },
          applyCount: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.applyCount',
              type: TYPE_NAME_MAP[type],
            }),
            editable: false,
          },
          deliveryCount: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.deliveryCount',
              flow: FLOW_TYPE_NAME_MAP[flowType],
            }),
            editable: false,
          },
          noDeliveryCount: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.noDeliveryCount',
              flow: FLOW_TYPE_NAME_MAP[flowType],
            }),
            editable: false,
          },
          receiveCount: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.receiveCount',
              flow: FLOW_TYPE_NAME_MAP[flowType],
            }),
            editable: false,
          },
          subCount: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.subCount',
              defaultMessage: '差异数量',
            }),
            editable: false,
          },
          count: {
            type: 'string',
            title: intl.formatMessage({
              id: 'afterService.components.DeliverDrawer.count',
              flow: FLOW_TYPE_NAME_MAP[flowType],
            }),
            'x-rules': [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'afterService.components.DeliverDrawer.count.required',
                  flow: FLOW_TYPE_NAME_MAP[flowType],
                }),
              },
              {
                pattern: PATTERN_MAPS.weight,
                message: intl.formatMessage({
                  id: 'afterService.components.DeliverDrawer.count.legal',
                  defaultMessage: '最多保留3位小数，大于或等于0',
                }),
              },
            ],
          },
        },
      },
    },
    LOGISTICS_LAYOUT: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        grid: true,
        full: true,
        autoRow: true,
        columns: 2,
        labelCol: 6,
        wrapperCol: 18,
        labelAlign: 'left',
      },
      properties: {
        returnDeliverAddress: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.DeliverDrawer.returnDeliverAddress',
            flow: FLOW_TYPE_NAME_MAP[flowType],
          }),
          'x-component': 'CustomAddressSelect',
          'x-component-props': {
            isDefaultAddress: true,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.components.DeliverDrawer.returnDeliverAddress.required',
                flow: FLOW_TYPE_NAME_MAP[flowType],
              }),
            },
          ],
        },
        deliveryTime: {
          type: 'date',
          title: intl.formatMessage({
            id: 'afterService.components.DeliverDrawer.deliveryTime',
            flow: FLOW_TYPE_NAME_MAP[flowType],
          }),
          'x-component-props': {
            format: 'YYYY-MM-DD HH:mm:ss',
            showTime: true,
            locale: dateLocale(),
          },
          required: true,
          default: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        logisticsOrderNo: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.DeliverDrawer.logisticsOrderNo',
            defaultMessage: '物流单号',
          }),
          required: true,
        },
        logisticsName: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.DeliverDrawer.logisticsName',
            defaultMessage: '物流公司',
          }),
          required: true,
          enum: [],
          'x-component-props': {
            notFoundContent: '{{NotFoundContent}}',
          },
        },
        // 收集值用
        logisticsNameTxt: {
          title: intl.formatMessage({
            id: 'afterService.components.DeliverDrawer.logisticsName',
            defaultMessage: '物流公司',
          }),
          type: 'string',
          display: false,
        },
      },
    },
  },
})
