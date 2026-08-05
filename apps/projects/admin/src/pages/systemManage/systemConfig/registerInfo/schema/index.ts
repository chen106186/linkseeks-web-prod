import { ISchema } from '@apps/formily'
import { fieldTypeEnumMapper } from '../constants'

export const drawerFormSchema: ISchema = {
  type: 'object',
  properties: {
    MegaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
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
          visible: false,
          title: '会员id',
        },
        fieldName: {
          type: 'string',
          title: '字段名称',
          'x-rules': [
            {
              required: true,
              message: '请输入字段名称',
            },
            {
              max: 26,
              message: '最多输入26个字符',
            },
          ],
          'x-component-props': {
            placeholder: '请输入字段名称',
            style: {
              width: 300,
            },
          },
        },
        tagEnum: {
          type: 'string',
          title: '字段标签',
          enum: [],
          default: 0,
          'x-component-props': {
            style: {
              width: 300,
            },
          },
        },
        fieldLocalName: {
          type: 'string',
          title: '中文名称',
          'x-rules': [
            {
              message: '请输入中文名称',
              required: true,
            },
            {
              max: 30,
              message: '最多30个字符',
            },
          ],
          'x-component-props': {
            placeholder: '请输入中文名称',
            style: {
              width: 300,
            },
          },
        },
        fieldRemark: {
          type: 'textarea',
          title: '帮助信息',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 200,
            },
          ],
          'x-component-props': {
            placeholder: '最长200个字符，100个汉字',
            rows: 2,
            style: {
              width: 300,
            },
          },
        },
        fieldType: {
          type: 'string',
          title: '字段类型',
          enum: [],
          'x-rules': {
            message: '请选择字段类型',
            required: true,
          },
          'x-component-props': {
            placeholder: '请选择字段类型',
            style: {
              width: 300,
            },
          },
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'fieldEnum',
              condition: "{{ $self.value === 'select' || $self.value === 'checkbox' || $self.value === 'radio' }}",
            },
            {
              type: 'value:visible',
              target: 'configs',
              condition: "{{ $self.value === 'list' }}",
            },
            {
              type: 'value:visible',
              target: 'fieldUnique',
              condition: "{{ $self.value === 'string' }}",
            },
            {
              type: 'value:schema',
              target: 'fieldLength',
              condition: `{{ $self.value === 'file'  }}`,
              schema: {
                title: '大小限制',
                'x-component-props': {
                  addonAfter: 'MB',
                },
              },
              otherwise: {
                title: '字段长度',
                'x-component-props': {
                  addonAfter: '',
                },
              },
            },
            ...['fieldLength', 'fieldEmpty', 'tagEnum', 'allowSelect', 'ruleEnum'].map((target) => ({
              type: 'value:visible',
              target,
              condition: "{{ $self.value !== 'list' }}",
            })),
          ],
        },
        ruleEnum: {
          type: 'string',
          enum: [],
          title: '规则类型',
          default: 0,
          'x-component-props': {
            style: {
              width: 300,
            },
          },
        },
        fieldLength: {
          type: 'number',
          title: '字段长度',
          'x-rules': [
            {
              message: '请输入字段长度',
              required: true,
            },
            {
              maximum: 126,
              message: '字段最大长度126',
            },
          ],
          'x-component-props': {
            placeholder: '请输入字段长度',
            style: {
              width: 300,
            },
          },
        },
        validate: {
          type: 'number',
          title: '变更需审核',
          default: 1,
          'x-component-props': {
            style: {
              width: 300,
            },
          },
          enum: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
        fieldEmpty: {
          type: 'string',
          title: '是否允许为空',
          default: 1,
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
            style: {
              width: 300,
            },
          },
        },
        allowSelect: {
          type: 'number',
          title: '是否搜索项',
          default: 0,
          'x-component-props': {
            style: {
              width: 300,
            },
          },
          enum: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
        fieldGroupName: {
          type: 'string',
          title: '分组名称',
          'x-rules': [
            {
              message: '请输入分组名称',
              required: true,
            },
            {
              max: 30,
              message: '最长30个字符',
            },
          ],
          'x-component-props': {
            placeholder: '请输入分组名称',
            style: {
              width: 300,
            },
          },
        },
        fieldOrder: {
          type: 'number',
          title: '排序',
          'x-rules': {
            message: '请输入排序',
            required: true,
          },
          'x-component-props': {
            placeholder: '请输入排序',
            min: 1,
            parser: (value) => parseInt(value),
            style: {
              width: 300,
            },
          },
        },
        fieldUnique: {
          type: 'number',
          // title: '是否字段值唯一',
          title: `{{help("是否字段值唯一", "字段值唯一性校验是对不同会员在注册/入库时提交的字段值进行校验，跟进注册/入库字段在业务上是否需要唯一确认是否开启该字段开关")}}`,
          default: 0,
          'x-component-props': {
            style: {
              width: 300,
            },
          },
          enum: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        },
        fieldEnum: {
          type: 'array',
          title: '字段类型值',
          'x-component': 'EnumFieldTableComponent',
          'x-mega-props': {
            full: true,
            span: 10,
          },
          visible: false,
        },
        configs: {
          type: 'array',
          title: '列表字段',
          'x-component': 'ListFieldTableComponent',
          'x-mega-props': {
            full: true,
            span: 10,
          },
          visible: false,
        },
      },
    },
  },
}

export const listFieldDrawerFormSchema: ISchema = {
  type: 'object',
  properties: {
    'mega-layout': {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'left',
      },
      properties: {
        fieldName: {
          type: 'string',
          title: '列表字段名称',
          'x-rules': [
            {
              required: true,
              message: '请输入列表字段名称',
            },
            {
              max: 26,
              message: '最多输入26个字符',
            },
          ],
          'x-component-props': {
            placeholder: '请输入列表字段名称',
            style: {
              width: 300,
            },
          },
        },
        fieldLocalName: {
          type: 'string',
          title: '列表中文名称',
          'x-rules': [
            {
              message: '请输入列表中文名称',
              required: true,
            },
            {
              max: 30,
              message: '最多30个字符',
            },
          ],
          'x-component-props': {
            placeholder: '请输入列表中文名称',
            style: {
              width: 300,
            },
          },
        },
        fieldType: {
          type: 'string',
          title: '列表字段类型',
          // 列表字段 的内部表单没有文件和列表两种字段类型
          enum: [],
          'x-rules': {
            message: '请输入列表字段类型',
            required: true,
          },
          'x-component-props': {
            placeholder: '请输入列表字段类型',
            style: {
              width: 300,
            },
          },
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'fieldEnum',
              condition: "{{ $self.value === 'select' || $self.value === 'checkbox' || $self.value === 'radio' }}",
            },
          ],
        },
        fieldLength: {
          type: 'number',
          title: '字段长度',
          'x-rules': [
            {
              message: '请输入字段长度',
              required: true,
            },
            {
              maximum: 126,
              message: '字段最大长度126',
            },
          ],
          'x-component-props': {
            placeholder: '请输入字段长度',
            style: {
              width: 300,
            },
          },
        },
        fieldEmpty: {
          type: 'string',
          title: '是否允许为空',
          default: 1,
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
            style: {
              width: 300,
            },
          },
        },
        fieldOrder: {
          type: 'number',
          title: '排序',
          'x-rules': [
            {
              message: '请输入排序',
              required: true,
            },
          ],
          'x-component-props': {
            placeholder: '请输入排序',
            min: 1,
            parser: (value) => parseInt(value),
            style: {
              width: 300,
            },
          },
        },
        tagEnum: {
          type: 'string',
          title: '字段标签',
          enum: [],
          'x-component-props': {
            style: {
              width: 300,
            },
          },
        },
        fieldRemark: {
          type: 'textarea',
          title: '帮助信息',
          'x-rules': [
            {
              limitByte: true,
              maxByte: 200,
            },
          ],
          'x-component-props': {
            placeholder: '最长200个字符，100个汉字',
            rows: 1,
            style: {
              width: 300,
            },
          },
        },
        ruleEnum: {
          type: 'string',
          enum: [],
          title: '规则类型',
          default: 0,
          'x-component-props': {
            style: {
              width: 300,
            },
          },
        },
        fieldEnum: {
          type: 'array',
          title: '字段类型值',
          'x-component': 'EnumFieldTableComponentInListField',
          'x-mega-props': {
            full: true,
            span: 10,
          },
          visible: false,
        },
      },
    },
  },
}
