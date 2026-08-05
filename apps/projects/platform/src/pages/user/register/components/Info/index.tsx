import React from 'react'
import { FormInstance } from 'antd/lib/form'
import { Form, Card, Row, Col, Empty } from '@linkseeks/ui'
import { useWebIntl } from '@apps/locales'
import useFileType, { FILE_TYPE_ENUM } from '../../services/hooks/useFileType'
import useRegisterDetail from '../../services/hooks/useRegisterDetail'
import styles from './index.less'

interface IProps {
  form: FormInstance<any>
  show: boolean
  onNextAction: Function
  updateListKeys: (keys: string[]) => void
}

const Info: React.FC<IProps> = (props) => {
  const { show, form } = props
  const { registerInfo } = useRegisterDetail(props)
  const { renderFormItem } = useFileType({ form })
  const translate = useWebIntl()

  return registerInfo && registerInfo.length > 0 ? (
    <Form.Item hidden={!show}>
      {registerInfo.map((item) => (
        <Form.Item
          key={item.groupName}
          style={{
            marginBottom: 16,
          }}
        >
          <Card bordered={false} className={styles['common-card']} title={item.groupName}>
            <Form.Item
              style={{
                marginBottom: 0,
              }}
            >
              <Row gutter={24}>
                {item.elements &&
                  item.elements.length &&
                  item.elements.map((elementItem) => (
                    <Col span={elementItem.fieldType === FILE_TYPE_ENUM.list ? 24 : 12}>
                      <Form.Item
                        name={['detail', String(elementItem.fieldName)]}
                        label={elementItem.fieldLocalName}
                        rules={[
                          {
                            required: elementItem.fieldEmpty === 0 && show,
                          },
                          ...(elementItem?.pattern
                            ? [
                                {
                                  validator: (_, value) => {
                                    // 去掉首尾的斜杠，并分离出正则内容和修饰符
                                    const match = elementItem.pattern!.slice(1, -1)
                                    if (match) {
                                      const pattern = new RegExp(match)
                                      if (value && !pattern.test(value)) {
                                        return Promise.reject(
                                          new Error(elementItem.fieldLocalName + translate('web.common.formatError')),
                                        )
                                      }
                                      return Promise.resolve()
                                    }
                                  },
                                },
                              ]
                            : []),
                        ]}
                      >
                        {renderFormItem(elementItem)}
                      </Form.Item>
                    </Col>
                  ))}
              </Row>
            </Form.Item>
          </Card>
        </Form.Item>
      ))}
    </Form.Item>
  ) : show ? (
    <div className={styles['empty-wrap']}>
      <Empty description={translate('web.resource.member.wuketianxiezhuceziliao')} />
    </div>
  ) : null
}

export default Info
