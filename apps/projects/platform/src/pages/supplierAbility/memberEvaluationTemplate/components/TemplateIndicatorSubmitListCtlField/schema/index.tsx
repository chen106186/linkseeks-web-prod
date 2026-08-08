import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

/** 抽屉列表查询 schema */
export const drawerQuerySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        indicatorGrouping: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: translate('web.resource.member.zhibiaofenzu'),
            tip: translate('web.resource.member.shuruzhibiaofenzusousuo'),
            align: 'flex-left',
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'flex-layout',
          'x-component-props': {
            rowStyle: {
              justifyContent: 'flex-start',
              flexWrap: 'nowrap',
            },
          },
          properties: {
            standardIndicator: {
              type: 'string',
              'x-component-props': {
                placeholder: translate('web.resource.member.biaozhunzhibiao'),
                style: {
                  width: 220,
                  marginRight: 8,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
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
