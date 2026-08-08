import { ISchema } from '@apps/formily'
import { fieldTypeEnumMapper } from '../constants'

export const modelFormSchema: ISchema = {
  type: 'object',
  properties: {
    'mega-layout': {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        labelAlign: 'left',
      },
      properties: {
        id: {
          type: 'string',
          'x-mega-props': {
            span: 2,
            labelAlign: 'left',
          },
          editable: false,
          title: '会员id',
        },
        fieldName: {
          type: 'string',
          'x-rules': {
            required: true,
            message: '请输入字段名称',
          },
          title: '字段名称',
          maxLength: 26,
          'x-component-props': {
            placeholder: '请输入字段名称',
          },
        },
        sort: {
          type: 'number',
          'x-rules': {
            message: '请输入排序',
            required: true,
          },
          title: '排序',
          'x-mega-props': {
            full: true,
          },
          'x-component-props': {
            placeholder: '请输入排序',
          },
        },
        annotationName: {
          type: 'string',
          title: '中文名称',
          maxLength: 30,
          'x-rules': {
            message: '请输入中文名称',
            required: true,
          },
          'x-component-props': {
            placeholder: '请输入中文名称',
          },
        },
        fieldType: {
          type: 'string',
          title: '字段类型',
          enum: [...fieldTypeEnumMapper],
          'x-rules': {
            message: '请输入字段类型',
            required: true,
          },
          'x-component-props': {
            placeholder: '请输入字段类型',
          },
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'fieldEnum',
              condition: "{{ $self.value === 'select' }}",
            },
          ],
        },
        fieldEnum: {
          type: 'array',
          title: '字段类型值',
          'x-component': 'arraytable',
          'x-mega-props': {
            full: true,
            span: 10,
          },
          visible: false,
          items: {
            type: 'object',
            properties: {
              label: {
                type: 'string',
                title: '字段名称',
              },
            },
          },
        },
        fieldLength: {
          type: 'number',
          title: '字段长度',
          maxLength: 30,
          'x-rules': {
            message: '请输入字段长度',
            required: true,
          },
          'x-mega-props': {
            full: true,
          },
          'x-component-props': {
            placeholder: '请输入字段长度',
          },
        },
        isNullState: {
          type: 'string',
          title: '是否为空',
          enum: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
          'x-rules': {
            message: '请选择字段是否为空',
            required: true,
          },
          'x-component-props': {
            placeholder: '请选择字段是否为空',
          },
        },
        groupName: {
          type: 'string',
          title: '分组名称',
          maxLength: 30,
          'x-rules': {
            message: '请输入分组名称',
            required: true,
          },
          'x-component-props': {
            placeholder: '请输入分组名称',
          },
        },
        help: {
          type: 'textarea',
          title: '帮助信息',
          maxLength: 128,
          'x-component-props': {
            placeholder: '请输入帮助信息',
          },
          'x-mega-props': {
            span: 2,
          },
        },
      },
    },
  },
}
