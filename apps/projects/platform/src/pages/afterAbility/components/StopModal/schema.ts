/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-26 10:21:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-26 11:05:12
 * @Description:
 */
import { ISchema } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const schema: ISchema = {
  type: 'object',
  properties: {
    MEGA_LAYOUT: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'left',
        labelCol: 4,
        wrapperCol: 20,
      },
      properties: {
        date: {
          type: 'string',
          title: intl.formatMessage({ id: 'afterService.components.StopModal.date', defaultMessage: '中止时间' }),
          'x-component': 'DatePicker',
          editable: false,
        },
        remark: {
          type: 'string',
          title: intl.formatMessage({ id: 'afterService.components.StopModal.remark', defaultMessage: '中止原因' }),
          'x-component': 'Textarea',
          'x-component-props': {
            placeholder: intl.formatMessage({
              id: 'afterService.components.StopModal.remark.placeholder',
              defaultMessage: '在此输入你的内容，最长100个字符，50个汉字',
            }),
            maxLength: 60,
            rows: 5,
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'afterService.components.StopModal.remark.required',
                defaultMessage: '请填写原因',
              }),
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 100,
            },
          ],
        },
      },
    },
  },
}

export default schema
