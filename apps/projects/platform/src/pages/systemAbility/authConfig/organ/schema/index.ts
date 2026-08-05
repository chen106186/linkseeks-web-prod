import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()

export const menuSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
        labelCol: 4,
        wrapperCol: 12,
      },
      properties: {
        code: {
          type: 'string',
          title: intl.formatMessage({ id: 'authConfig.origanCode' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
            },
            {
              max: 12,
              message: translate('web.resource.system.zuzhidaimazuichangshiergezifu'),
            },
          ],
        },
        title: {
          type: 'string',
          title: intl.formatMessage({ id: 'authConfig.origanJiGou' }),
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({ id: 'common.form.input.placeholder' }),
            },
            {
              max: 12,
              message: translate('web.resource.system.zuzhijigouzuichangsishigezifu'),
            },
          ],
        },
        remark: {
          type: 'textarea',
          title: intl.formatMessage({ id: 'authConfig.describe' }),
          'x-component-props': {
            rows: 4,
          },
        },
      },
    },
  },
}
