import type { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'top',
        full: true,
        wrapperCol: 16,
      },
      properties: {
        code: {
          title: getIntl().formatMessage({ id: 'material.group.code', defaultMessage: '物料组代码' }),
          type: 'string',
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'material.group.code.validate',
                defaultMessage: '请输入物料组代码',
              }),
            },
            {
              limitByte: true,
              maxByte: 12,
              allowChineseTransform: false,
            },
          ],
        },
        name: {
          title: getIntl().formatMessage({ id: 'material.group.name', defaultMessage: '物料组名称' }),
          type: 'string',
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'material.group.title.validate',
                defaultMessage: '请输入物料组名称',
              }),
            },
            {
              limitByte: true,
              maxByte: 40,
            },
          ],
        },
        description: {
          title: getIntl().formatMessage({ id: 'material.group.desc', defaultMessage: '物料组描述' }),
          type: 'textarea',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 64,
            },
          ],
        },
        parentId: {
          title: getIntl().formatMessage({ id: 'material.group.parent', defaultMessage: '父级' }),
          type: 'FormilyTreeSelect',
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({
                id: 'material.group.parent.validate',
                defaultMessage: '请选择父级',
              }),
            },
          ],
        },
      },
    },
  },
}
