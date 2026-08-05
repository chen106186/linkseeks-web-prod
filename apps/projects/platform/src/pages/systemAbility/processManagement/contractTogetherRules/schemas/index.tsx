import { ISchema, Schema } from '@apps/formily'

/**
 * 新增物料
 */
export const addSchema: ISchema = {
  type: 'object',
  properties: {
    basic: {
      type: 'object',
      'x-component': 'MellowCard',
      'x-component-props': {
        id: 'basic',
        title: '基本信息',
      },
      properties: {
        layout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            labelAlign: 'left',
            labelCol: 4,
            wrapperCol: 19,
            grid: true,
            autoRow: true,
            columns: 2,
            responsive: {
              lg: 2,
              m: 1,
              s: 1,
            },
          },
          properties: {
            name: {
              title: '流程规则名称',
              type: 'string',

              'x-rules': [
                {
                  required: true,
                  message: '最长48个字符，24个汉字',
                },
                {
                  limitByte: true,
                  maxByte: 48,
                },
              ],
            },
          },
        },
      },
    },
    /** 根据品类动态获取schema */
    processCard: {
      type: 'object',
      'x-component': 'MellowCard',
      'x-component-props': {
        id: 'type',
        title: '流程选择',
      },
      properties: {
        baseProcessId: {
          type: 'string',
          enum: [],
          'x-component': 'ProcessRadio',
          required: true,
        },
      },
    },
    applyCard: {
      type: 'object',
      'x-component': 'MellowCard',
      'x-component-props': {
        id: 'apply',
        title: '适用合同',
      },
      properties: {
        suitableMaterialType: {
          title: '',
          type: 'string',
          'x-component': 'ApplicableMaterial',
          enum: [
            {
              title: '所有合同',
              id: 1,
            },
          ] as any,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'materials',
              condition: '{{ $self.value === 2 }}',
            },
            {
              type: 'value:schema',
              target: 'materials',
              condition: `{{ $self.value === 2 }}`,
              schema: {
                'x-rules': [
                  {
                    required: true,
                  },
                ],
              },
              otherwise: {
                'x-rules': [
                  {
                    required: false,
                  },
                ],
              },
            },
          ],
        },
        materials: {
          title: '',
          type: 'string',
          'x-component': 'SelectMaterial',
          'x-component-props': {},
        },
      },
    },
  },
}
