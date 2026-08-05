import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

export const schema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 12,
        labelAlign: 'left',
      },
      properties: {
        name: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
          editable: false,
        },
      },
    },
    addition: {
      type: 'object',
      'x-component': 'Children',
      'x-component-props': {
        children: '{{renderAddition}}',
      },
    },
    datas: {
      type: 'array',
      'x-component': 'ArrayTable',
      'x-component-props': {
        renderAddition: () => null,
        renderRemove: () => null,
        renderMoveUp: () => null,
        renderMoveDown: () => null,
        operations: false,
      },
      items: {
        properties: {
          id: {
            title: getIntl().formatMessage({ id: 'material.no', defaultMessage: '序号' }),
            type: 'string',
            // "x-component": 'FileItem',
            'x-component-props': {},
            editable: false,
          },
          name: {
            title: getIntl().formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
            type: 'string',
            editable: false,
          },
          materielNo: {
            title: getIntl().formatMessage({ id: 'material.supplier.code', defaultMessage: '供应商物料编号' }),
            type: 'string',
            editable: false,
            'x-rules': [
              {
                limitByte: true,
                maxByte: 20,
              },
              {
                pattern: /[A-Za-z|0-9|~!@#$%^&*-<>]$/,
                message: getIntl().formatMessage({
                  id: 'material.code.validate',
                  defaultMessage: '编号由英文（不分大小写）、数字、特殊字符组成',
                }),
              },
            ],
          },
          userName: {
            title: getIntl().formatMessage({ id: 'material.supplier.userName', defaultMessage: '联系人' }),
            type: 'string',
            editable: false,
            'x-rules': [
              {
                limitByte: true,
                maxByte: 24,
              },
            ],
          },
          phone: {
            title: getIntl().formatMessage({ id: 'material.supplier.phone', defaultMessage: '联系电话' }),
            type: 'string',
            editable: false,
            'x-rules': [
              {
                limitByte: true,
                maxByte: 40,
              },
            ],
          },
          manufacturer: {
            title: getIntl().formatMessage({ id: 'material.manufacturer', defaultMessage: '生产厂家' }),
            type: 'string',
            editable: false,
            'x-rules': [
              {
                limitByte: true,
                maxByte: 40,
              },
            ],
          },
          origin: {
            title: getIntl().formatMessage({ id: 'material.origin', defaultMessage: '产地' }),
            type: 'string',
            editable: false,
            'x-rules': [
              {
                limitByte: true,
                maxByte: 24,
              },
            ],
          },
          departure: {
            title: getIntl().formatMessage({ id: 'material.departure', defaultMessage: '起运地' }),
            type: 'string',
            editable: false,
            'x-rules': [
              {
                limitByte: true,
                maxByte: 40,
              },
            ],
          },
          deliveryCycle: {
            title: getIntl().formatMessage({ id: 'material.deliveryCycle', defaultMessage: '到货周期' }),
            type: 'string',
            editable: false,
            'x-rules': [
              {
                limitByte: true,
                maxByte: 40,
              },
            ],
          },
          deliveryMethod: {
            title: getIntl().formatMessage({ id: 'material.deliveryMethod', defaultMessage: '交货方式' }),
            type: 'string',
            editable: false,
          },
          operations: {
            title: '操作',
            'x-component': 'Operation',
            editable: false,
            'x-component-props': {
              onDeleteAfter: '{{handleActionsAfter}}',
              setEditState: '{{setEditState}}',
            },
          },
        },
      },
    },
    cacheData: {
      type: 'array',
      'x-component': 'ArrayTable',
      visible: false,
      'x-component-props': {
        renderAddition: () => null,
        renderRemove: () => null,
        renderMoveUp: () => null,
        renderMoveDown: () => null,
        operations: false,
      },
      items: {
        properties: {
          id: {
            title: getIntl().formatMessage({ id: 'material.no', defaultMessage: '序号' }),
            type: 'string',
            // "x-component": 'FileItem',
            'x-component-props': {},
            editable: false,
          },
          name: {
            title: getIntl().formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
            type: 'string',
            editable: false,
          },
          materielNo: {
            title: getIntl().formatMessage({ id: 'material.supplier.code', defaultMessage: '供应商物料编号' }),
            type: 'string',
            editable: false,
          },
          userName: {
            title: getIntl().formatMessage({ id: 'material.supplier.userName', defaultMessage: '联系人' }),
            type: 'string',
            editable: false,
          },
          phone: {
            title: getIntl().formatMessage({ id: 'material.supplier.phone', defaultMessage: '联系电话' }),
            type: 'string',
            editable: false,
          },
          manufacturer: {
            title: getIntl().formatMessage({ id: 'material.manufacturer', defaultMessage: '生产厂家' }),
            type: 'string',
            editable: false,
          },
          origin: {
            title: getIntl().formatMessage({ id: 'material.origin', defaultMessage: '产地' }),
            type: 'string',
            editable: false,
          },
          departure: {
            title: getIntl().formatMessage({ id: 'material.departure', defaultMessage: '起运地' }),
            type: 'string',
            editable: false,
          },
          deliveryCycle: {
            title: getIntl().formatMessage({ id: 'material.deliveryCycle', defaultMessage: '到货周期' }),
            type: 'string',
            editable: false,
          },
          deliveryMethod: {
            title: getIntl().formatMessage({ id: 'material.deliveryMethod', defaultMessage: '交货方式' }),
            type: 'string',
            editable: false,
          },
        },
      },
    },
  },
}
