import type { ISchema } from '@apps/formily'

/** 新增表单 schema */
export const memberTargetDefinitionFormSchema: ISchema = {
  type: 'object',
  properties: {
    memberScoringIndicatorSubmitList: {
      type: 'array',
      'x-component': 'TagsPane',
      'x-component-props': {
        size: 'large',
        addible: true,
        extra: '{{TagsExtra}}',
        closable: '{{areTagsEditable}}',
        onTagsChange: '{{handleTagsPaneTagsChange}}',
        handleBeforeConfirm: '{{handleBeforeConfirm}}',
      },
      items: {
        type: 'object',
        properties: {
          details: {
            type: 'array',
            'x-component': 'MemberScoringIndicatorSubmitList',
            'x-component-props': {},
          },
          // details: {
          //   type: 'array',
          //   'x-component': 'ArrayTable',
          //   'x-component-props': {
          //     renderMoveDown: () => null,
          //     renderMoveUp: () => null,
          //     // renderAddition: () => null,
          //     operationsWidth: '80px',
          //     rowClassName: () => 'editable-row',
          //   },
          //   items: {
          //     type: 'object',
          //     properties: {
          //       indicatorGrouping: {
          //         type: 'string',
          //         title: '指标分组',
          //         editable: false,
          //       },
          //       standardIndicator: {
          //         type: 'string',
          //         title: '指标分组',
          //         'x-component-props': {
          //           style: { width: 232, ...commonInputStyle },
          //           placeholder: '最长30个字符，15个汉字',
          //         },
          //         'x-rules': [
          //           {
          //             required: true,
          //             message: '请填写',
          //           },
          //           {
          //             limitByte: true,
          //             maxByte: 30,
          //             message: '最长30个字符，15个汉字',
          //           }
          //         ],
          //       },
          //       scoreMin: {
          //         type: 'string',
          //         title: '最小值',
          //         'x-component-props': {
          //           style: { width: 97, textAlign: 'center', ...commonInputStyle },
          //           placeholder: '最小值',
          //           precision: 0,
          //         },
          //         'x-rules': [
          //           {
          //             required: true,
          //             message: '请填写',
          //           },
          //         ],
          //       },
          //       scoreMax: {
          //         type: 'number',
          //         'x-component-props': {
          //           style: { width: 97, textAlign: 'center', ...commonInputStyle },
          //           placeholder: '最大值',
          //           precision: 0,
          //         },
          //         'x-rules': [
          //           {
          //             required: true,
          //             message: '请填写',
          //           }
          //         ],
          //       },
          //       indicatorDescribe: {
          //         type: 'string',
          //         'x-component': 'textarea',
          //         'x-component-props': {
          //           style: { width: 200, ...commonInputStyle },
          //           placeholder: '最长40个字符，20个汉字',
          //           rows: 1,
          //         },
          //         'x-rules': [
          //           {
          //             limitByte: true,
          //             maxByte: 40,
          //             message: '最长40个字符，20个汉字',
          //           }
          //         ],
          //       },
          //     },
          //   },
          // },
        },
      },
    },
  },
}
