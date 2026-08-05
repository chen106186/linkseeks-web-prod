import { ISchema, Schema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
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
        title: translate('web.resource.system.liuchengguize'),
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
              title: translate('web.resource.system.liuchengguizemingcheng'),
              type: 'string',
              'x-rules': [
                {
                  required: true,
                  message: translate('web.common.qingshuru'),
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
        title: translate('web.resource.system.wuliaoliucheng'),
      },
      properties: {
        baseProcessId: {
          type: 'string',
          enum: [],
          'x-component': 'ProcessRadio',
        },
      },
    },
    applyCard: {
      type: 'object',
      'x-component': 'MellowCard',
      'x-component-props': {
        id: 'apply',
        title: translate('web.resource.system.shiyongwuliaozu'),
      },
      properties: {
        suitableMaterialType: {
          title: '',
          type: 'string',
          'x-component': 'ApplicableMaterial',
          enum: [
            {
              title: translate('web.resource.system.suoyouwuliao'),
              id: 1,
            },
            {
              title: translate('web.resource.system.xuanzebufenwuliaozu'),
              id: 2,
            },
            {
              title: translate('web.resource.system.xuanzebufenwuliao'),
              id: 3,
            },
          ] as any,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'materials',
              condition: '{{ $self.value === 3 }}',
            },
            {
              type: 'value:visible',
              target: 'materialGroups',
              condition: '{{ $self.value === 2 }}',
            },
            {
              type: 'value:schema',
              target: 'materials',
              condition: `{{ $self.value === 3  }}`,
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
            {
              type: 'value:schema',
              target: 'materialGroups',
              condition: `{{ $self.value === 2  }}`,
              schema: {
                'x-rules': [
                  {
                    required: true,
                    message: translate('web.common.qingxuanze'),
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
        materialGroups: {
          title: '',
          type: 'array',
          'x-component': 'FormilyTransfer',
          'x-component-props': {},
        },
      },
    },
  },
}
