/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-24 10:53:49
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-05-24 10:53:49
 * @Description: 审核入库相关公用schema
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
        topLayout: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
          },
          properties: {
            ctl: {
              type: 'object',
              'x-component': 'ControllerBtns',
            },
            name: {
              type: 'string',
              'x-component': 'Search',
              'x-component-props': {
                placeholder: intl.formatMessage({ id: 'customerAbility.management.common.schames.name.placeholder' }),
                tip: intl.formatMessage({ id: 'customerAbility.management.common.schames.name.placeholder-tip' }),
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
