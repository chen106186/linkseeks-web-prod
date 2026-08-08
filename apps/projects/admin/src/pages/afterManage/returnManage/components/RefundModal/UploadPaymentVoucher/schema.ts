/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-09 10:46:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-09 15:54:09
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { UPLOAD_TYPE } from '@/constants'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

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
        description: '单个凭证文件大小不能超过 200K',
      },
      properties: {
        name: {
          type: 'string',
          title: '还款账户名称',
          'x-component': 'Text',
        },
        bankAccount: {
          type: 'string',
          title: '银行账号',
          'x-component': 'Text',
        },
        bankDeposit: {
          type: 'string',
          title: '开户行',
          'x-component': 'Text',
        },
        fileList: {
          type: 'string',
          title: '上传退款凭证',
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
              message: '请上传退款凭证',
            },
          ],
        },
      },
    },
  },
}
