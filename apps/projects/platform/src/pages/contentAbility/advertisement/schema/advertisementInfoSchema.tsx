import { getIntl } from '@linkseeks/i18n'
import { ADVERTISE_WEB_COLUMN_TYPE, sortedList } from '../../utils/utils'
import { getWebIntl } from '@apps/locales'

const sortListOptions = sortedList(1, 6)

const translate = getWebIntl()
const schema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        wrapperCol: 10,
        labelAlign: 'left',
      },
      properties: {
        title: {
          type: 'string',
          title: getIntl().formatMessage({ id: 'common.text.title' }),
          'x-component-props': {
            placeholder: getIntl().formatMessage({ id: 'detail.purchase.placeholder4' }),
          },
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'detail.purchase.placeholder4' }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 60,
            },
          ],
        },
        columnType: {
          title: getIntl().formatMessage({ id: 'content.info.column' }),
          type: 'string',
          enum: Object.keys(ADVERTISE_WEB_COLUMN_TYPE).map((item) => {
            return {
              label: ADVERTISE_WEB_COLUMN_TYPE[item],
              value: parseInt(item),
            }
          }),
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'advertisement.placeholder.column' }),
            },
          ],
        },
        sort: {
          title: getIntl().formatMessage({ id: 'advertisement.sort' }),
          type: 'string',
          enum: sortListOptions,
          'x-rules': [
            {
              required: true,
              message: getIntl().formatMessage({ id: 'advertisement.placeholder.sort' }),
            },
          ],
        },
        link: {
          title: getIntl().formatMessage({ id: 'editor.setting.form.jumplink' }),
          type: 'string',
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 100,
            },
          ],
        },
        imageUrl: {
          type: 'object',
          title: '{{label}}',
          name: 'imageUrl',
          'x-component': 'CustomUpload',
          'x-component-props': {
            size: translate('web.common.wu'),
            fileMaxSize: 300,
          },
          'x-rules': {
            required: true,
            message: getIntl().formatMessage({ id: 'activePage.Pleaseuploadpictures' }),
          },
        },
      },
    },
  },
}

export default schema
