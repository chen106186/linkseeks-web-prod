import React, { Fragment } from 'react'
import { Form, Input, RadioGroup, Radio, Space, Button } from '@linkseeks/ui'
import { PATTERN_MAPS } from '@/constants/regExp'
import { Editor } from '@apps/components'
import { useIntl } from '@linkseeks/i18n'
import { useHelpfulContext } from '../../context'
import styles from '../../../index.less'
import { validatorByte } from '@/utils/regExp'

interface IProps {
  submitLoading: boolean
}

const HelpfulForm: React.FC<IProps> = (props) => {
  const { submitLoading } = props
  const { treeRef, setOperateType } = useHelpfulContext()
  const intl = useIntl()

  return (
    <div style={{ marginTop: 16 }}>
      <Form.Item
        label={intl.formatMessage({ id: 'own.help.form.name', defaultMessage: '标题' })}
        name="name"
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'own.help.form.name.required', defaultMessage: '请输入标题' }),
          },
          {
            validator: (r, v, c) => validatorByte(r, v, c, 20),
          },
        ]}
      >
        <Input placeholder={intl.formatMessage({ id: 'own.help.form.name.required', defaultMessage: '请输入标题' })} />
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ id: 'own.help.form.skipType', defaultMessage: '转跳类型' })}
        name="skipType"
        initialValue={1}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'own.help.form.skipType.required', defaultMessage: '请选择转跳类型' }),
          },
        ]}
      >
        <RadioGroup>
          <Radio value={1}>
            {intl.formatMessage({ id: 'own.help.form.skipType.1', defaultMessage: '站内帮助页' })}
          </Radio>
          <Radio value={2}>{intl.formatMessage({ id: 'own.help.form.skipType.2', defaultMessage: '外部链接' })}</Radio>
        </RadioGroup>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const skipType = getFieldValue('skipType')
          if (skipType === 1) {
            return (
              <Fragment>
                <Form.Item
                  label={intl.formatMessage({ id: 'own.help.form.helpTitle', defaultMessage: '帮助页标题' })}
                  name="helpTitle"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'own.help.form.helpTitle.required',
                        defaultMessage: '请输入帮助页标题',
                      }),
                    },
                    {
                      validator: (r, v, c) => validatorByte(r, v, c, 80),
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder={intl.formatMessage({
                      id: 'own.help.form.helpTitle.required',
                      defaultMessage: '请输入帮助页标题',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  label={intl.formatMessage({ id: 'own.help.form.helpContent', defaultMessage: '帮助页内容' })}
                  name="helpContent"
                  wrapperCol={{
                    span: 21,
                  }}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'own.help.form.helpContent.required',
                        defaultMessage: '请输入帮助页内容',
                      }),
                    },
                    {
                      validator(rule, value, callback) {
                        validatorByte(rule, value.toHTML(), callback, 50000)
                      },
                    },
                  ]}
                >
                  <Editor className={styles['helpful-richEditable']} />
                </Form.Item>
              </Fragment>
            )
          } else if (skipType === 2) {
            return (
              <Form.Item
                label={intl.formatMessage({ id: 'own.help.form.skipUrl', defaultMessage: '外部链接' })}
                name="skipUrl"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'own.help.form.skipUrl.required',
                      defaultMessage: '请输入外部链接',
                    }),
                  },
                  {
                    pattern: PATTERN_MAPS.link,
                    message: intl.formatMessage({
                      id: 'own.help.form.skipUrl.pattern',
                      defaultMessage: '请输入正确的链接',
                    }),
                  },
                ]}
              >
                <Input
                  maxLength={200}
                  placeholder={intl.formatMessage({
                    id: 'own.help.form.skipUrl.required',
                    defaultMessage: '请输入外部链接',
                  })}
                />
              </Form.Item>
            )
          }
        }}
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
        <Space size={16}>
          <Button
            onClick={() => {
              treeRef.current.setSelectKeys([])
              setOperateType(undefined)
            }}
          >
            {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
          </Button>
          <Button loading={submitLoading} type="primary" htmlType="submit">
            {intl.formatMessage({ id: 'common.button.submit', defaultMessage: '提交' })}
          </Button>
        </Space>
      </Form.Item>
    </div>
  )
}

export default HelpfulForm
