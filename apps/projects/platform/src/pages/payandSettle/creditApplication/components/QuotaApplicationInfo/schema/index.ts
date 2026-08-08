/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-29 15:51:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-02-20 14:41:42
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { UPLOAD_TYPE } from '@/constants'
import { PATTERN_MAPS } from '@/constants/regExp'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const intl = getIntl()

export const editModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
        full: true,
        labelCol: 6,
        description: intl.formatMessage({
          id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.description',
        }),
      },
      properties: {
        applyQuota: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.applyQuota',
          }),
          'x-component-props': {
            placeholder: '',
            addonBefore: intl.formatMessage({
              id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.applyQuota.addonBefore',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.applyQuota.message.1',
              }),
            },
            {
              pattern: PATTERN_MAPS.money,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.applyQuota.message.2',
              }),
            },
          ],
        },
        quotaSlide: {
          type: 'number',
          title: '',
          'x-component': 'range',
          'x-component-props': {
            min: 0,
            // max: 1024,
            // marks: {
            //   0: {
            //     label: '{{MinMarks}}',
            //   },
            //   1024: {
            //     label: '{{MaxMarks}}',
            //   },
            // },
            style: {
              margin: '0 20px 28px',
            },
          },
        },
        billDay: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.billDay',
          }),
          'x-component-props': {
            placeholder: '',
            addonAfter: intl.formatMessage({
              id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.billDay.addonAfter',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.billDay.message.1',
              }),
            },
            {
              pattern: PATTERN_MAPS.quantity,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.billDay.message.2',
              }),
            },
            {
              validator(value) {
                const intVal = +value
                return intVal > 28 || intVal < 0
                  ? intl.formatMessage({
                      id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.billDay.message.3',
                    })
                  : ''
              },
            },
          ],
        },
        repayPeriod: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.repayPeriod',
          }),
          'x-component-props': {
            placeholder: '',
            addonAfter: intl.formatMessage({
              id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.repayPeriod.addonAfter',
            }),
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.repayPeriod.message.1',
              }),
            },
            {
              pattern: PATTERN_MAPS.quantity,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.repayPeriod.message.2',
              }),
            },
          ],
        },
        fileList: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.components.quotaApplicationInfo.schema.fileList',
          }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: UPLOAD_TYPE,
              prefix: FILE_PREFIX_ENUM.PAY_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.xls, .xlsx, .doc, .docx, .wps, .pdf, .jpg, .png, .jpeg',
          },
        },
      },
    },
  },
}
