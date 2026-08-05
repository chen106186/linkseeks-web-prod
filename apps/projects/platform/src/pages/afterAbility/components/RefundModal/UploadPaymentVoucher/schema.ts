/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-09 10:46:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-09 15:54:09
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { UPLOAD_TYPE } from '@/constants'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const intl = getIntl()

export const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        wrapperCol: 20,
        labelAlign: 'left',
        full: true,
        description: intl.formatMessage({
          id: 'afterService.components.UploadPaymentVoucher.tip',
          defaultMessage: '单个凭证文件大小不能超过 200K',
        }),
      },
      properties: {
        name: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.UploadPaymentVoucher.name',
            defaultMessage: '还款账户名称',
          }),
          'x-component': 'Text',
        },
        bankAccount: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.UploadPaymentVoucher.bankAccount',
            defaultMessage: '银行账号',
          }),
          'x-component': 'Text',
        },
        bankDeposit: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.UploadPaymentVoucher.bankDeposit',
            defaultMessage: '开户行',
          }),
          'x-component': 'Text',
        },
        fileList: {
          type: 'string',
          title: intl.formatMessage({
            id: 'afterService.components.UploadPaymentVoucher.fileList',
            defaultMessage: '上传退款凭证',
          }),
          'x-component': 'FixUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: UPLOAD_TYPE,
              prefix: FILE_PREFIX_ENUM.AFTERSALES_SERVICE,
            },
            beforeUpload: '{{beforeUpload}}',
            onChange: '{{onUploadChange}}',
            accept: '.png, .jpg, .jpeg',
          },
          'x-mega-props': {
            labelAlign: 'top',
            full: true,
            wrapperCol: 24,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.components.UploadPaymentVoucher.fileList.required',
                defaultMessage: '请上传退款凭证',
              }),
            },
          ],
        },
      },
    },
  },
}
