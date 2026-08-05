import type { ReactNode } from 'react'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import {
  Button,
  Steps,
  Card,
  Space,
  Tooltip,
  Row,
  Col,
  Descriptions,
  Table,
  Form,
  Modal,
  Radio,
  Input,
  Image,
  Badge,
} from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import { QuestionCircleOutlined, CheckSquareOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import { formatTimeString } from '@/utils'
import styles from './index.less'
import { getProductBrandGetBrandCheckRecord, getProductBrandGetBrand, postProductBrandCheckBrand } from '@apps/apis'
import { postCommodityShopExistSelfShop } from '@apps/apis'
import { authService } from '@apps/services'
import { productStatusColor, productStatusLabel } from '../../commodity/products/constant'

const { Step } = Steps
const { TextArea } = Input

/**
 * 待审核品牌 详情审核
 * @returns
 */
const CheckBrandDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [brandInfo, setBrandInfo] = useState<any>({})
  const [fixStep, setFixStep] = useState(0)
  const [recordData, setRecordData] = useState<any[]>([])
  const [checkForm] = Form.useForm()
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const [hasSelfStore, setHasSelfStore] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<number>(4)
  const { roles = [], memberRoleId, memberId } = authService.getAuth() || {}

  const query = useQuery()

  useEffect(() => {
    const { id } = query
    if (id) {
      loadPageData(id)
    }

    postCommodityShopExistSelfShop({ memberId, memberRoleId }, { ctlType: 'none' }).then(({ code, data }) => {
      if (code === 1000) {
        setHasSelfStore(data)
      }
    })
  }, [])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.id' }),
      dataIndex: 'id',
      key: 'id',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.memberRoleName' }),
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (_text, record) => {
        let component: ReactNode = null
        if (record.status === 1)
          component = (
            <>
              <span className="commonStatusInvalid" />
              {intl.formatMessage({ id: 'trademark.schema.status.2' })}
            </>
          )
        else if (record.status === 2)
          component = (
            <>
              <span className="commonStatusModify" />
              {intl.formatMessage({ id: 'trademark.schema.status.3' })}
            </>
          )
        else if (record.status === 3)
          component = (
            <>
              <span className="commonStatusStop" />
              {intl.formatMessage({ id: 'trademark.schema.status.4' })}
            </>
          )
        else if (record.status === 4)
          component = (
            <>
              <span className="commonStatusValid" />
              {intl.formatMessage({ id: 'trademark.schema.status.5' })}
            </>
          )
        return component
      },
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.operation' }),
      dataIndex: 'operation',
      key: 'operation',
      render: (_text, record) => {
        let component: ReactNode = null
        if (record.operation === 1)
          component = <>{intl.formatMessage({ id: 'trademark.viewBrand.brandOpeartionLabel.1' })}</>
        else if (record.operation === 2)
          component = <>{intl.formatMessage({ id: 'trademark.viewBrand.brandOpeartionLabel.2' })}</>
        else if (record.operation === 3)
          component = <>{intl.formatMessage({ id: 'trademark.viewBrand.brandOpeartionLabel.3' })}</>
        return component
      },
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => formatTimeString(text),
    },
    {
      title: intl.formatMessage({ id: 'trademark.viewBrand.columns.checkRemark' }),
      dataIndex: 'checkRemark',
      key: 'checkRemark',
    },
  ]

  const loadPageData = (id) => {
    getProductBrandGetBrand({ id: id }).then((res) => {
      if (res.code === 1000) {
        setBrandInfo(res.data)
        if (res.data.status === 1) setFixStep(0)
        else if (res.data.status === 2) setFixStep(1)
        else setFixStep(2)
      }
    })
    getProductBrandGetBrandCheckRecord({ brandId: id }).then((res) => {
      if (res.code === 1000) setRecordData(res.data)
    })
  }

  const fixStatus = (state: number) => {
    if (state === 1)
      return (
        <>
          <span className="commonStatusInvalid" />
          {intl.formatMessage({ id: 'trademark.checkBrand.state.1' })}
        </>
      )
    else if (state === 2)
      return (
        <>
          <span className="commonStatusModify" />
          {intl.formatMessage({ id: 'trademark.checkBrand.state.2' })}
        </>
      )
    else if (state === 3)
      return (
        <>
          <span className="commonStatusStop" />
          {intl.formatMessage({ id: 'trademark.checkBrand.state.3' })}
        </>
      )
    else if (state === 4)
      return (
        <>
          <span className="commonStatusValid" />
          {intl.formatMessage({ id: 'trademark.checkBrand.state.4' })}
        </>
      )
    else if (state === 5)
      return (
        <>
          <span className="commonStatusValid" />
          {intl.formatMessage({ id: 'trademark.checkBrand.state.5' })}
        </>
      )
    else if (state === 6)
      return (
        <>
          <span className="commonStatusStop" />
          {intl.formatMessage({ id: 'trademark.checkBrand.state.6' })}
        </>
      )
  }

  const fixProveUrl = (proveInfo: any) => {
    if (proveInfo) {
      const imgArray = Object.values(proveInfo)
      return imgArray.map((item: any, index: number) => (
        <Col key={index} span={3} xxl={3} xl={4} lg={4}>
          <div className={styles.proveBox}>
            <Image width={175} height={120} src={item} />
          </div>
        </Col>
      ))
    }
  }

  const tips = (
    <>
      {intl.formatMessage({ id: 'trademark.viewBrand.tips' })}
      <Tooltip title={intl.formatMessage({ id: 'trademark.viewBrand.tips.tooltip' })}>
        <span>
          &nbsp;
          <QuestionCircleOutlined />
        </span>
      </Tooltip>
    </>
  )

  const handleApplyCheck = () => {
    setVisibleModal(true)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      postProductBrandCheckBrand({ id: brandInfo?.id, ...values }).then((res) => {
        if ((res.code = 1000)) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          handleCancel()
          setDisableCheck(true)
          loadPageData(res.data)
        }
      })
    })
  }

  const handleCancel = () => {
    checkForm.resetFields()
    setVisibleModal(false)
  }

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  return (
    <PageHeaderWrapper
      title={brandInfo?.name}
      titleIcon={brandInfo?.logoUrl}
      items={[
        {
          key: 'process',
          label: intl.formatMessage({
            id: 'trademark.viewBrand.card.1',
          }),
        },
        {
          key: 'basicInfo',
          label: intl.formatMessage({
            id: 'commodity.products.addProducts.tab.1',
          }),
        },
        {
          key: 'evidence',
          label: intl.formatMessage({ id: 'trademark.viewBrand.tips' }),
        },
        {
          key: 'history',
          label: intl.formatMessage({
            id: 'trademark.viewBrand.card.2',
          }),
        },
      ]}
      extra={[
        !query.preview && (
          <Button
            icon={<CheckSquareOutlined />}
            key="1"
            type="primary"
            onClick={handleApplyCheck}
            disabled={disableCheck}
          >
            {intl.formatMessage({ id: 'trademark.checkBrand.extra' })}
          </Button>
        ),
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Card
          id="process"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'trademark.viewBrand.card.1' })}
        >
          <Steps progressDot current={fixStep}>
            <Step
              title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.1' })}
              description={roles.filter((item) => item.roleId === memberRoleId)[0]?.roleName}
            />
            {hasSelfStore ? (
              <Step
                title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })}
                description={roles.filter((item) => item.roleId === memberRoleId)[0]?.roleName}
              />
            ) : (
              <Step
                title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })}
                description={intl.formatMessage({
                  id: 'trademark.viewBrand.card.1.step.2.description',
                })}
              />
            )}
            <Step title={intl.formatMessage({ id: 'trademark.viewBrand.card.1.step.2' })} description="" />
          </Steps>
        </Card>
        <Card id="basicInfo" title={intl.formatMessage({ id: 'commodity.products.addProducts.tab.1' })}>
          <Descriptions column={2} colon={true} className="common-descriptions">
            <Descriptions.Item span={1} label="品牌Logo">
              <img
                src={brandInfo?.logoUrl}
                width="40px"
                height="40px"
                style={{
                  borderRadius: 8,
                  objectFit: 'contain',
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item span={1} label="申请审核时间">
              {brandInfo.applyTime && formatTimeString(brandInfo.applyTime)}
            </Descriptions.Item>
            <Descriptions.Item span={1} label="品牌名称">
              {brandInfo?.name}
            </Descriptions.Item>
            <Descriptions.Item span={1} label="品牌状态">
              {brandInfo.isEnable ? '有效' : '无效'}
            </Descriptions.Item>
            <Descriptions.Item span={1} label="审核状态">
              <Badge color={productStatusColor[brandInfo?.status]} text={productStatusLabel[brandInfo?.status]} />
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card id="evidence" headStyle={{ borderBottom: 'none' }} title={tips}>
          <Row gutter={24}>{fixProveUrl(brandInfo.proveUrl)}</Row>
        </Card>
        <Card
          id="history"
          headStyle={{ borderBottom: 'none' }}
          title={intl.formatMessage({ id: 'trademark.viewBrand.card.2' })}
        >
          <Table dataSource={recordData} columns={columns} pagination={false} />
        </Card>
      </Space>
      <Modal
        title={intl.formatMessage({ id: 'trademark.checkBrand.modal.title' })}
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="status"
            label=""
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'trademark.checkBrand.modal.message.1' }),
              },
            ]}
            initialValue={4}
          >
            <Radio.Group onChange={handleStatusChange}>
              <Radio value={4}>{intl.formatMessage({ id: 'trademark.checkBrand.modal.radio.1' })}</Radio>
              <Radio value={3}>{intl.formatMessage({ id: 'trademark.checkBrand.modal.radio.2' })}</Radio>
            </Radio.Group>
          </Form.Item>
          {checkStatus === 3 && (
            <Form.Item
              name="checkRemark"
              label={intl.formatMessage({ id: 'trademark.checkBrand.modal.checkRemark.label' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'trademark.checkBrand.modal.checkRemark.message',
                  }),
                },
              ]}
            >
              <TextArea
                rows={3}
                maxLength={60}
                placeholder={intl.formatMessage({
                  id: 'trademark.checkBrand.modal.checkRemark.placeholder',
                })}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default CheckBrandDetail
