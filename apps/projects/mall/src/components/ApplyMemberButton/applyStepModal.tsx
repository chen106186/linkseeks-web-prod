import React, { useState, Fragment, useMemo } from 'react'
import { Modal, Row, Col, Steps, Checkbox, Space, Button, message, Empty, Form, Card, Descriptions } from 'antd'
import { GetCommodityWebStoreWebMemberShopMainResponse } from '@apps/apis'
import IMG_APPLY_SUCCESS from '@/assets/imgs/apply-success.png'
import { getWebIntl } from '@/utils/locales'
import useApplyStep from './hooks/useApplyStep'
import useFileType, { FILE_TYPE_ENUM } from './hooks/useFileType'
import { useStoreContext } from '@/context/storeProvider'
import styles from './index.module.less'

interface ApplyStepModalProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  shopInfo: GetCommodityWebStoreWebMemberShopMainResponse
}

const ApplyStepModal: React.FC<ApplyStepModalProps> = (props) => {
  const { visible, setVisible, shopInfo } = props
  const { updateApplyState } = useStoreContext()
  const [applyStep, setApplyStep] = useState<number>(0)
  const [isAgree, setIsAgree] = useState<boolean>(false)
  const {
    agreement,
    registerInfo,
    depositInfo,
    submitLoading,
    depositForm,
    getRegisterInfo,
    getDepositInfo,
    applyMember,
  } = useApplyStep({ upperMemberId: shopInfo?.memberId, upperRoleId: shopInfo?.roleId })
  const { renderFormItem, renderFieldValue } = useFileType({ form: depositForm })
  const translate = getWebIntl()

  const handleOk = async () => {
    switch (applyStep) {
      case 0:
        if (!isAgree) {
          message.info(translate('web.resource.mall.qinggouxuandianpuhuiyuanxieyi'))
          return
        }
        setApplyStep(1)
        const result = await getRegisterInfo()
        if (result.length === 0) {
          setApplyStep(2)
          const depositInfoRes = await getDepositInfo()
          if (depositInfoRes.length === 0) {
            applyMember()
            setApplyStep(3)
          }
        }
        break
      case 1:
        setApplyStep(2)
        const depositInfoRes = await getDepositInfo()
        if (depositInfoRes.length === 0) {
          applyMember()
          setApplyStep(3)
        }
        break
      case 2:
        depositForm.validateFields().then((values) => {
          applyMember()
          setApplyStep(3)
        })
        break
      case 3:
        setApplyStep(0)
        updateApplyState()
        setVisible(false)
        break
      default:
        break
    }
  }

  const getStepButtonText = useMemo(() => {
    switch (applyStep) {
      case 0:
        return (
          <Space>
            <Button onClick={() => setVisible(false)}>{translate('web.common.cancel')}</Button>
            <Button type="primary" onClick={handleOk}>
              {translate('web.common.nextStep')}
            </Button>
          </Space>
        )
      case 1:
      case 2:
        return (
          <Space>
            <Button onClick={() => setApplyStep(applyStep - 1)}>{translate('web.resource.mall.shangyibu')}</Button>
            <Button type="primary" loading={submitLoading} onClick={handleOk}>
              {translate('web.resource.mall.querenxiayibu')}
            </Button>
          </Space>
        )
      case 3:
        return (
          <Button type="primary" onClick={handleOk}>
            {translate('web.resource.mall.wancheng')}
          </Button>
        )
      default:
        return <Button onClick={() => setVisible(false)}>{translate('web.common.cancel')}</Button>
    }
  }, [applyStep, isAgree])

  return (
    <Modal
      centered
      className={styles.applyModal}
      width={1000}
      open={visible}
      closable={false}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      title={
        <Steps current={applyStep}>
          <Steps.Step title={translate('web.resource.mall.dianpuhuiyuanxieyi')} />
          <Steps.Step title={translate('web.resource.mall.querenzhucexinxi')} />
          <Steps.Step title={translate('web.resource.mall.tianxiedianpuhuiyuanziliao')} />
          <Steps.Step title={translate('web.resource.mall.wancheng')} />
        </Steps>
      }
      footer={
        <Row justify="space-between" align="middle">
          <Row align="middle">
            {applyStep === 0 && (
              <Fragment>
                <Checkbox checked={isAgree} onChange={(e) => setIsAgree(e.target.checked)} style={{ marginRight: 8 }} />
                <span>{translate('web.resource.mall.gouxuanjibiaoshiyirenzhenyuedu')}</span>
              </Fragment>
            )}
          </Row>
          {getStepButtonText}
        </Row>
      }
    >
      <Fragment>
        {applyStep === 0 && (
          <div className={styles['common-steps-wrap']}>
            {agreement && <div dangerouslySetInnerHTML={{ __html: agreement }} />}
          </div>
        )}
        {applyStep === 1 && (
          <div className={styles['common-steps-wrap']}>
            {registerInfo && registerInfo.length > 0 ? (
              <div>
                {registerInfo.map((item) => (
                  <Descriptions
                    key={item.groupName}
                    className={styles['apply-descriptions']}
                    title={item.groupName}
                    column={3}
                  >
                    {item.elements &&
                      item.elements.length &&
                      item.elements.map((elementItem) => (
                        <Descriptions.Item
                          key={elementItem.fieldLocalName}
                          className={styles['apply-descriptions-item']}
                          label={elementItem.fieldLocalName}
                          span={elementItem.fieldType === FILE_TYPE_ENUM.list ? 3 : 1}
                        >
                          {renderFieldValue(elementItem)}
                        </Descriptions.Item>
                      ))}
                  </Descriptions>
                ))}
              </div>
            ) : (
              <div className={styles['empty-wrap']}>
                <Empty description={translate('web.resource.mall.nindangqianwukequerenzhurenxinxi')} />
              </div>
            )}
          </div>
        )}
        {applyStep === 2 && (
          <div className={styles['common-steps-wrap']}>
            {depositInfo && depositInfo.length > 0 ? (
              <Form form={depositForm} layout="vertical">
                {depositInfo.map((item) => (
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
                                  name={['depositDetails', String(elementItem.fieldName)]}
                                  label={elementItem.fieldLocalName}
                                  rules={[
                                    {
                                      required: elementItem.fieldEmpty === 0,
                                    },
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
              </Form>
            ) : (
              <div className={styles['empty-wrap']}>
                <Empty description={translate('web.resource.mall.nindangqianwuketianxiedianpuhuiyuan')} />
              </div>
            )}
          </div>
        )}
        {applyStep === 3 && (
          <div className={styles['common-steps-wrap']}>
            <div className={styles.success}>
              <img src={IMG_APPLY_SUCCESS} width="300px" height="225px" />
              <p className={styles['success-text']}>
                {translate('web.resource.mall.nindedianpuhuiyuanshenqingziliao')}
              </p>
            </div>
          </div>
        )}
      </Fragment>
    </Modal>
  )
}

export default ApplyStepModal
