/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-13 14:01:40
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-02-20 14:37:35
 * @Description:
 */
import { getIntl } from '@linkseeks/i18n'
import { ISchema } from '@apps/formily'
import { UPLOAD_TYPE } from '@/constants'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const intl = getIntl()

export const uploadVoucherModalSchema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 6,
        wrapperCol: 18,
        labelAlign: 'left',
        full: true,
        description: intl.formatMessage({
          id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.schema.uploadVoucherModalSchema.description',
        }),
      },
      properties: {
        name: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.schema.uploadVoucherModalSchema.name',
          }),
          'x-component': 'Text',
        },
        bankAccount: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.schema.uploadVoucherModalSchema.bankAccount',
          }),
          'x-component': 'Text',
        },
        bankDeposit: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.schema.uploadVoucherModalSchema.bankDeposit',
          }),
          'x-component': 'Text',
        },
        payProveList: {
          type: 'string',
          title: intl.formatMessage({
            id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.schema.uploadVoucherModalSchema.payProveList',
          }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: UPLOAD_TYPE,
              prefix: FILE_PREFIX_ENUM.PAY_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            accept: '.png, .jpg, .jpeg',
          },
          'x-mega-props': {
            labelAlign: 'top',
            full: true,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'payandSettle.creditApplication.quotaMenage.detail.components.uploadVoucherModal.schema.uploadVoucherModalSchema.payProveList.message',
              }),
            },
          ],
        },
      },
    },
  },
}
