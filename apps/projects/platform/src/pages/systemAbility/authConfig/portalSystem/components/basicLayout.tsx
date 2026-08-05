import React, { useContext, useEffect, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Form, Row, Col, Input, FormInstance } from 'antd'
import { Card as CardLayout } from '@linkseeks/ui'
import { UploadImage } from '@apps/components'
import { Context } from '../add'
import { validatorByte } from '@/utils/regExp'

interface BasicProps {
  /** form 实例 */
  form?: FormInstance
}

const intl = getIntl()

const BasicLayout: React.FC<BasicProps> = (props: BasicProps) => {
  const { form } = props
  const [logo, setLogo] = useState<string>('')
  const context = useContext(Context)

  useEffect(() => {
    if (context) {
      setLogo(context.logo)
    }
  }, [context])

  return (
    <CardLayout
      id="basicLayout"
      title={intl.formatMessage({ id: 'portalSystem.jibenxinxi', defaultMessage: '基本信息' })}
    >
      <Row gutter={[48, 24]}>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.menhudaima', defaultMessage: '门店代码' })}
            name="code"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'portalSystem.qingshurumenhudaima',
                  defaultMessage: '请输入门店代码',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 12) },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'portalSystem.qingshuru', defaultMessage: '请输入' })} />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.mendianmingcheng', defaultMessage: '门店名称' })}
            name="name"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'portalSystem.qingshumendianmingcheng',
                  defaultMessage: '请输门店名称',
                }),
              },
              { validator: (rule, value, callback) => validatorByte(rule, value, callback, 40) },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'portalSystem.qingshuru', defaultMessage: '请输入' })} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={intl.formatMessage({ id: 'portalSystem.mendianLOGO', defaultMessage: '门店LOGO' })}
            name="logo"
          >
            <UploadImage
              imgUrl={logo}
              fileMaxSize={50}
              size="275*50"
              onChange={(val) => {
                setLogo(val)
                form.setFieldsValue({
                  logo: val,
                })
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </CardLayout>
  )
}
export default BasicLayout
