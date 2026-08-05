/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-02 20:10:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-03 16:05:47
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { UPLOAD_TYPE } from '@/constants'
import { PATTERN_MAPS } from '@/constants/regExp'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const intl = getIntl()

export const schema: ISchema = {
  type: 'object',
  properties: {
    INVESTIGATE_INFO: {
      type: 'object',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect' }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 18,
            labelAlign: 'left',
          },
          properties: {
            inspectDay: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect.date',
              }),
              'x-component': 'DatePicker',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.select.placeholder',
                }),
                style: {
                  width: '100%',
                },
              },
              required: true,
            },
            score: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect.score',
              }),
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.select.placeholder',
                }),
                style: {
                  width: '100%',
                },
              },
              'x-rules': [
                {
                  pattern: PATTERN_MAPS.money,
                  message: intl.formatMessage({
                    id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect.score.rules-money',
                  }),
                },
              ],
              required: true,
            },
            result: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect.result',
              }),
              'x-component': 'Textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect.result-placeholder',
                }),
                rows: 5,
              },
              'x-rules': [
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 60,
                },
              ],
              required: true,
            },
            reports: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect.reports',
              }),
              'x-component': 'FixUpload',
              'x-component-props': {
                action: '/api/support/file/upload/prefix',
                data: {
                  fileType: UPLOAD_TYPE,
                  prefix: FILE_PREFIX_ENUM.MEMBER_SERVICE,
                },
                accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
              },
              'x-rules': [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.inspect.reports.rules-required',
                  }),
                },
              ],
            },
          },
        },
      },
    },
    VERIFY_APPLY: {
      type: 'object',
      'x-component': 'FlagBox',
      'x-component-props': {
        title: intl.formatMessage({ id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.verify' }),
      },
      properties: {
        MEGA_LAYOUT: {
          type: 'object',
          'x-component': 'Mega-Layout',
          'x-component-props': {
            labelCol: 4,
            wrapperCol: 18,
            labelAlign: 'left',
          },
          properties: {
            agree: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.verify.agree',
              }),
              default: 1,
              'x-component': 'Radio',
              required: true,
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.verify.agree.pass',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.verify.agree.noPass',
                  }),
                  value: 0,
                },
              ],
              'x-component-props': {},
            },
            reason: {
              type: 'string',
              title: intl.formatMessage({
                id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.verify.reason',
              }),
              'x-component': 'Textarea',
              'x-component-props': {
                placeholder: intl.formatMessage({
                  id: 'customerAbility.management.memberPrComingInvestigate.drawer.form.verify.placeholder',
                }),
                rows: 5,
              },
              'x-rules': [
                {
                  required: true,
                },
                {
                  limitByte: true, // 自定义校验规则
                  maxByte: 120,
                },
              ],
            },
          },
        },
      },
    },
  },
}
