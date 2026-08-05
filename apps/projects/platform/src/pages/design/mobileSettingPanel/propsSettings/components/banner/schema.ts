import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

export const bannerSchema: ISchema = {
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
          ],
        },
        img: {
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
                  target: 'recordDetail',
                  condition: '{{$value !== 4}}',
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
          'x-component': 'recordDetail',
        },
      },
    },
  },
}
