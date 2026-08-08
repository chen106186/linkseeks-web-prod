/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-25 14:21:16
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-02 16:29:47
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'

const intl = getIntl()

const verifyComingSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: intl.formatMessage({ id: 'customerAbility.management.common.schames.name.placeholder' }),
            align: 'flex-left',
            tip: intl.formatMessage({ id: 'customerAbility.management.common.schames.name.placeholder-tip' }),
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            memberType: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.common.schames.memberTypeId.placeholder',
                }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            roleId: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.common.schames.roleId.placeholde' }),
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            source: {
              type: 'string',
              default: undefined,
              enum: [],
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.common.schames.source.placeholder' }),
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
                children: intl.formatMessage({ id: 'customerAbility.management.common.schames.query' }),
              },
            },
          },
        },
      },
    },
  },
}

export default verifyComingSchema
