import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const schema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        topLayout: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              // 'x-component': 'Children',
              // 'x-component-props': {
              //   children: '{{controllerBtns}}',
              // },
              'x-component': 'ControllerBtns',
            },
            title: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: translate('web.common.title'),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            status: {
              type: 'string',
              enum: [
                { label: translate('web.common.all'), value: '0' },
                { label: translate('web.common.daishangjia'), value: '1' },
                { label: translate('web.common.yishangjia'), value: '2' },
                { label: translate('web.common.yixiajia'), value: '3' },
              ],
              'x-component-props': {
                placeholder: translate('web.common.status'),
                allowClear: true,
              },
            },
            '[startTime, endTime]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  translate('web.resource.system.fabukaishishijian'),
                  translate('web.resource.system.fabujieshushijian'),
                ],
                allowClear: true,
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: translate('web.common.chaxun'),
              },
            },
          },
        },
      },
    },
  },
}
