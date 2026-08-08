import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { getWebIntl } from '@apps/locales'
const intl = getIntl()
const translate = getWebIntl()
/**
 * 会员考察页scheam
 * 总感觉这里的布局有点问题
 */
export const inspectionListSchema: ISchema = {
  type: 'object',
  properties: {
    mageLayout: {
      type: 'object',
      'x-component': 'Mega-Layout',
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
              'x-component': 'Children',
              'x-component-props': {
                children: '{{controllerBtns}}',
              },
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: translate('web.common.search'),
                tip: translate('web.resource.member.tip_kehumingchen'),
              },
            },
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'Flex-Layout',
          'x-component-props': {
            colStyle: {
              marginLeft: 20,
            },
          },
          properties: {
            subject: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberInspection.common.columns.index.investigateTopic',
                })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            inspectType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberInspection.common.columns.index.investigateType',
                })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.query' })}`,
              },
            },
          },
        },
      },
    },
  },
}
