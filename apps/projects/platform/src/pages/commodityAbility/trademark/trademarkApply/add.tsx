import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Steps, Card, Space, Tooltip, Form, Input, message, Row, Col } from 'antd'
import { MultipleCardUpload, PageHeaderWrapper, SingleCardUpload, UploadFile } from '@apps/components'
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons'
import ReturnEle from '@/components/ReturnEle'
import styles from './index.less'
import { validatorByte } from '@/utils/regExp'
import { UploadImage } from '@apps/components'
import { authService } from '@apps/services'
import { getProductBrandGetBrand, postProductBrandApplyCheckBrand, postProductBrandSaveOrUpdateBrand } from '@apps/apis'
import { postCommodityShopExistSelfShop } from '@apps/apis'
import { ShowType } from '@apps/components/src/web/UploadFile/constants'

const { Step } = Steps

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 10,
  },
}

const AddBrand: React.FC<{}> = () => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [logoUrl, setlogoUrl] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [fileList, setFileList] = useState<any[]>([])
  const [responseId, setReponseId] = useState<number>(null)
  const [formValues, setFormValues] = useState<any>({})
  const [isDisabledSave, setIsDisabledSave] = useState<boolean>(false)
  const [isDisabledCheck, setDisabledCheck] = useState<boolean>(true)
  const [hasSelfStore, setHasSelfStore] = useState<boolean>(false)
  const { roles, memberRoleId, memberId } = authService.getAuth() || {}

  const query = useQuery()

  useEffect(() => {
    const { id } = query
    if (id) {
      getProductBrandGetBrand({ id: id + '' }).then((res) => {
        if (res.code === 1000) {
          const { data } = res
          setFormValues(data)
          form.setFieldsValue(data)
          setlogoUrl(data.logoUrl)
          // 多图回显
          const proveImgs = Object.values(data.provePic)
          const files = []
          // eslint-disable-next-line @typescript-eslint/no-for-in-array
          for (const i in proveImgs) {
            files.push({
              uid: i,
              name: 'image.png',
              status: 'done',
              url: proveImgs[i],
            })
          }
          setFileList([...files])
        }
      })
    }

    postCommodityShopExistSelfShop({ memberId, memberRoleId }, { ctlType: 'none' }).then(({ code, data }) => {
      if (code === 1000) {
        setHasSelfStore(data)
      }
    })
  }, [])

  // useEffect(() => {
  //   const obj = {}
  //   fileList.forEach((item, index) => {
  //     obj[index] = item.response?.data
  //   })
  //   // setprovePic(obj)
  //   form.setFieldsValue({ provePic: obj })
  // }, [fileList])

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
    if (!isJpgOrPng) {
      message.error(intl.formatMessage({ id: 'trademark.addBrand.error.1' }))
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error(intl.formatMessage({ id: 'trademark.addBrand.error.3' }))
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info) => {
    setFileList(info.fileList)
  }

  const handleSave = () => {
    setIsDisabledSave(true)
    form
      .validateFields()
      .then((values) => {
        if (query.id) {
          values.id = Number(query.id)
        }

        if (values.provePic) {
          values.provePic = values.provePic.map((v) => v.url || v)
        }

        postProductBrandSaveOrUpdateBrand(values).then((res) => {
          if (res.code === 1000) {
            setDisabledCheck(false)
            setReponseId(res.data)
            history.goBack()
          } else {
            setIsDisabledSave(false)
          }
        })
      })
      .catch(() => {
        setIsDisabledSave(false)
      })
  }

  const handleApplyCheck = () => {
    setDisabledCheck(true)
    postProductBrandApplyCheckBrand({ id: responseId }).then(() => {
      // setDisabledCheck(false)
      setCurrentStep(1)
      setTimeout(() => {
        history.goBack()
      }, 1000)
    })
  }

  const tips = (
    <>
      {intl.formatMessage({ id: 'trademark.addBrand.tips' })}
      <Tooltip title={intl.formatMessage({ id: 'trademark.addBrand.tips.tooltip' })}>
        <span>
          &nbsp;
          <QuestionCircleOutlined />
        </span>
      </Tooltip>
    </>
  )

  return (
    <PageHeaderWrapper
      title={
        query?.id
          ? intl.formatMessage({ id: 'trademark.addBrand.title.1' })
          : intl.formatMessage({ id: 'trademark.addBrand.title.2' })
      }
      extra={[
        <Button key="2" onClick={handleApplyCheck} disabled={isDisabledCheck}>
          {intl.formatMessage({ id: 'trademark.addBrand.extra.1' })}
        </Button>,
        <Button icon={<SaveOutlined />} key="1" type="primary" onClick={handleSave} disabled={isDisabledSave}>
          {intl.formatMessage({ id: 'trademark.addBrand.extra.2' })}
        </Button>,
      ]}
      className={styles.brandBox}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card headStyle={{ borderBottom: 'none' }} title={intl.formatMessage({ id: 'trademark.addBrand.card.1' })}>
          <Steps progressDot current={currentStep}>
            <Step
              title={intl.formatMessage({ id: 'trademark.addBrand.card.1.step.1' })}
              description={roles?.filter((item) => item.roleId === memberRoleId)[0]?.roleName}
            />
            {hasSelfStore ? (
              <Step
                title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })}
                description={roles?.filter((item) => item.roleId === memberRoleId)[0]?.roleName}
              />
            ) : (
              <Step
                title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })}
                description={intl.formatMessage({
                  id: 'trademark.viewBrand.card.1.step.2.description',
                })}
              />
            )}
            <Step title={intl.formatMessage({ id: 'trademark.addBrand.card.1.step.3' })} description="" />
          </Steps>
        </Card>
      </Space>
      <Form
        form={form}
        name="edit_infomation"
        layout="horizontal"
        {...layout}
        initialValues={formValues}
        autoComplete="off"
        className="addForm"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card headStyle={{ borderBottom: 'none' }} title={intl.formatMessage({ id: 'trademark.addBrand.card.2' })}>
            <Form.Item
              name="name"
              label={<span>{intl.formatMessage({ id: 'trademark.addBrand.card.2.name' })}&nbsp;&nbsp;</span>}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'trademark.addBrand.card.2.name.message' }),
                },
                {
                  validator: (r, v, c) => validatorByte(r, v, c, 20),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'trademark.addBrand.card.2.name.placeholder',
                })}
              />
            </Form.Item>
            <Form.Item
              name="logoUrl"
              label={<span>{intl.formatMessage({ id: 'trademark.addBrand.card.2.logoUrl' })}&nbsp;&nbsp;</span>}
              extra={intl.formatMessage({ id: 'trademark.addBrand.card.2.logoUrl.extra' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'trademark.addBrand.card.2.logoUrl.message' }),
                },
              ]}
              className={styles.uploadForm}
            >
              <SingleCardUpload />
            </Form.Item>
          </Card>
        </Space>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card headStyle={{ borderBottom: 'none' }} title={tips}>
            <Row>
              <Col span={24}>
                <Form.Item name="provePic">
                  <MultipleCardUpload maxCount={3} />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Form>
    </PageHeaderWrapper>
  )
}

export default AddBrand
