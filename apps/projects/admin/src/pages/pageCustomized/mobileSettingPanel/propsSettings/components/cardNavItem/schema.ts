import { ISchema } from '@apps/formily'

export const cardNavSchema: ISchema = {
  type: 'Object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
      },
      properties: {
        name: {
          type: 'string',
          title: '名称',
          'x-component-props': {
            maxLength: 6,
          },
          'x-rules': [
            {
              required: true,
              message: '请输入名称',
            },
          ],
        },
        icon: {
          type: 'string',
          title: '图标',
          'x-rules': [
            {
              required: true,
              message: '请上传图标',
            },
          ],
          'x-component': 'FormilyUpload',
          'x-component-props': {
            renderUploadChild: '{{renderUploadChild}}',
            showFiles: false,
            customizeItemRender: null,
            children: null,
            maxCount: 1,
          },
        },
        typeWrap: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            },
          },
          properties: {
            type: {
              type: 'string',
              title: '导航链接',
              enum: [],
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: 'id',
                  condition: '{{$value === 3}}',
                },
                {
                  type: 'value:visible',
                  target: 'sumbit',
                  condition: '{{$value !== 3 && $value !== 5 && $value !== 6}}',
                },
                {
                  type: 'value:visible',
                  target: 'channel',
                  condition: '{{$value === 5}}',
                },
                {
                  type: 'value:visible',
                  target: 'url',
                  condition: '{{$value === 6}}',
                },
                {
                  type: 'value:visible',
                  target: 'recordDetail',
                  condition: '{{$value === 1 || $value === 2 || $value === 4}}',
                },
                {
                  type: 'value:visible',
                  target: 'sumbit',
                  condition: '{{$value === 1 || $value === 2 || $value === 4}}',
                },
              ],
              'x-rules': [
                {
                  required: true,
                  message: '请选择导航链接',
                },
              ],
              'x-component-props': {
                style: {
                  width: 320,
                  marginRight: 12,
                },
              },
            },
            sumbit: {
              'x-component': 'Children',
              'x-component-props': {
                children: '{{SelectBtn}}',
              },
              'x-mega-props': {
                span: 1,
              },
            },
          },
        },
        recordDetail: {
          type: 'object',
          'x-rules': [
            {
              required: true,
              message: '请选择导航数据',
            },
          ],
          'x-component': 'recordDetail',
        },
        id: {
          type: 'string',
          title: '品类',
          enum: [],
          'x-component-props': {
            state: false,
          },
          'x-rules': [
            {
              required: true,
              message: '请选择品类',
            },
          ],
        },
        channel: {
          type: 'string',
          title: '频道',
          enum: [],
          'x-rules': [
            {
              required: true,
              message: '请选择频道',
            },
          ],
        },
        url: {
          type: 'string',
          title: '链接地址',
          'x-rules': [
            {
              required: true,
              message: '请输入链接地址',
            },
          ],
        },
        // BLOCK_LAYOUT2: {
        //   type: 'object',
        //   "x-component": 'mega-layout',
        //   "x-component-props": {
        //     inline: true
        //   },
        //   properties: {

        //     selectButton: {
        //       type: 'string',
        //       "x-component": 'Button',
        //       // "x-component-props": {
        //       //   children: "{{SelectBtn}}"
        //       // }
        //     }
        //   }
        // }
      },
    },
  },
}
