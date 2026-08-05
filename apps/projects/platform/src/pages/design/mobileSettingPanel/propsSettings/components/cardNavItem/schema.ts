import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

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
          title: intl.formatMessage({ id: 'common.form.label.name' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.form.name.placeholder' }),
            },
            {
              max: 6,
              message: intl.formatMessage({ id: 'common.form.name.max' }),
            },
          ],
        },
        icon: {
          type: 'string',
          title: intl.formatMessage({ id: 'common.form.label.icon' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.form.icon.placeholder' }),
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
              title: intl.formatMessage({ id: 'editor.form.label.navlink' }),
              enum: [],
              'x-linkages': [
                {
                  type: 'value:visible',
                  target: 'id',
                  condition: '{{$value === 1}}',
                },
                {
                  type: 'value:visible',
                  target: 'channel',
                  condition: '{{$value === 3}}',
                },
                {
                  type: 'value:visible',
                  target: 'url',
                  condition: '{{$value === 4}}',
                },
                {
                  type: 'value:visible',
                  target: 'recordDetail',
                  condition: '{{$value === 2 || $value === 5}}',
                },
                {
                  type: 'value:visible',
                  target: 'sumbit',
                  condition: '{{$value === 2 || $value === 5}}',
                },
              ],
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({ id: 'editor.form.label.navlink.required' }),
                },
              ],
              'x-component-props': {
                style: {
                  width: 250,
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
          'x-component': 'recordDetail',
        },
        id: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.columns.category' }),
          enum: [],
          'x-component-props': {
            state: false,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.form.category.required' }),
            },
          ],
        },
        channel: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.form.label.channel' }),
          enum: [],
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.form.channel.required' }),
            },
          ],
        },
        url: {
          type: 'string',
          title: intl.formatMessage({ id: 'editor.setting.nav.link' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'editor.form.navlink.required' }),
            },
            {
              pattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?/,
              message: intl.formatMessage({ id: 'editor.form.navlink.right' }),
            },
          ],
        },
      },
    },
  },
}
