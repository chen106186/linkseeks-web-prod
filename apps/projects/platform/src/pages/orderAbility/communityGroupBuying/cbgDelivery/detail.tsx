import React, { Fragment, useEffect, useRef, useState } from 'react'
import { SchemaForm, Submit, FormButtonGroup, createFormActions, FormEffectHooks } from '@apps/formily'
import {
  Card,
  Select,
  Input,
  Checkbox,
  Button,
  Popconfirm,
  Table,
  message,
  Col,
  Row,
  Form,
  Modal,
  Space,
  Layout,
  DatePicker,
} from 'antd'
const { Header, Footer, Sider, Content } = Layout
import {
  BraftEditor,
  Editor,
  ImageBox,
  PageHeaderWrapper,
  type RecordColumns,
  StandardFormTable,
} from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getLogisticsSelectListCompany,
  getLogisticsSelectListMemberShipperAddress,
  getOrderCommunityGroupBuyingGet,
  postMarketingMerchantCbgActivityCreate,
  postOrderCommunityGroupBuyingConfirm,
  postOrderCommunityGroupBuyingCreate,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import useEditTable from '@apps/components/src/web/StandardFormTable/hooks/useEditTable'
import CollocationLayout from '@/pages/marketingAbility/distribution/components/collocationLayout'
import { SaveOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'

const CbgDeliveryConfirm = () => {
  const intl = useIntl()
  const ref = useRef({} as ActionType)
  const { id } = usePageStatus()
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const [dataSource, setDataSource] = useState([])
  const [productListSource, setProductListSource] = useState([])
  const [addressInfo, setAddressInfo] = useState([])
  const [addressMap, setAddressMap] = useState({})
  const [companyList, setCompanyList] = useState([])
  const [companyMap, setCompanyMap] = useState({})
  const [deliverData, setDeliverData] = useState({})
  const [loading, setLoading] = useState<boolean>(false)
  const { initialValue } = useInitialValue(getOrderCommunityGroupBuyingGet, { id: id })
  const [confirmDeliveryModal, setConfirmDeliveryModal] = useState(false)

  useEffect(() => {
    if (initialValue === null) {
      return
    }
    setDeliverData(initialValue)
    setDataSource(initialValue.itemList)
  }, [initialValue])

  const handleSubmit = () => {
    setConfirmDeliveryModal(true)
  }

  useEffect(() => {
    if (!confirmDeliveryModal) {
      return
    }
    getReceiveInfo()
    getCompany()
  }, [confirmDeliveryModal])

  const getReceiveInfo = async () => {
    getLogisticsSelectListMemberShipperAddress({
      memberId: deliverData.vendorMemberId,
      roleId: deliverData.vendorRoleId,
    }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      const tmpAddressInfo = []
      const tmpAddressInfoMap = {}
      res.data.forEach((item) => {
        tmpAddressInfoMap[item.id] = item.fullAddress
        tmpAddressInfo.push({
          value: item.id,
          label: item.fullAddress,
        })
      })
      setAddressInfo(tmpAddressInfo)
      setAddressMap(tmpAddressInfoMap)
    })
  }

  const getCompany = async () => {
    getLogisticsSelectListCompany({ cooperateType: '2' }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      const tmpCompanyList = []
      const tmpCompanyMap = {}
      res.data.forEach((company) => {
        tmpCompanyMap[company.code] = company.name
        tmpCompanyList.push({
          label: company.name,
          value: company.code,
        })
      })
      setCompanyList(tmpCompanyList)
      setCompanyMap(tmpCompanyMap)
    })
  }

  const onConfirmDeliveryOk = async () => {
    const values = await form.validateFields()

    console.log('values', values)
    const fullAddress = addressMap[values.addressId]
    console.log('fullAddress', fullAddress)
    const postData = {
      deliveryId: id,
      addressId: values.addrssId,
      address: fullAddress,
      deliveryTime: values.deliveryTime.format('YYYY-MM-DD'),
      logisticsNo: values.logisticsNo,
    }
    if (values.companyCode) {
      const company = companyMap[values.companyCode]
      postData.companyCode = values.companyCode
      postData.company = company
    }
    console.log(postData)
    postOrderCommunityGroupBuyingConfirm(postData).then((res) => {
      if (res.code !== 1000) {
        return
      }
      setConfirmDeliveryModal(false)
      history.goBack()
    })
  }

  const onConfirmDeliveryClose = () => {
    setConfirmDeliveryModal(false)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '序号',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: '商品名称',
      key: 'name',
      dataIndex: 'name',
      render: (_text, record) => <>{record.name + '(' + record.spec + ')'}</>,
    },
    {
      title: '应发件数',
      key: 'quantity',
      dataIndex: 'quantity',
    },
    {
      title: '实发件数',
      key: 'delivered',
      dataIndex: 'delivered',
    },
  ]

  const confirmDeliveryColumns: RecordColumns<any>[] = [
    {
      title: '序号',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: '商品名称',
      key: 'name',
      dataIndex: 'name',
      render: (_text, record) => <>{record.name + '(' + record.spec + ')'}</>,
    },
    {
      title: '应发数量',
      key: 'quantity',
      dataIndex: 'quantity',
    },
  ]

  return (
    <div>
      <PageHeaderWrapper
        title="确认配送"
        extra={
          <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
            确认发货
          </Button>
        }
      >
        <Space direction="vertical" size={16}>
          <Card title="发货单信息">
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">
              <Row>
                <Col span={12}>
                  <Form.Item label="发货单号">
                    <span>{deliverData.deliveryNo}</span>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="配货日期">
                    <span>{formatTimeString(deliverData.createTime, 'YYYY-MM-DD HH:mm')}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="所属自提点">
                    <span>{deliverData.cbgPickupPointName}</span>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="团长手机">
                    <span>{deliverData.cbgTeamLeaderPhone}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="自提点地址">
                    <span>{deliverData.pickupPointAddress}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="发货时间">
                    <span>{formatTimeString(deliverData.deliveryTime, 'YYYY-MM-DD HH:mm')}</span>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="送达时间">
                    <span>{formatTimeString(deliverData.receiptTime, 'YYYY-MM-DD HH:mm')}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="状态">
                    <span>
                      {(deliverData.status === 118 && '待配送') ||
                        (deliverData.status === 119 && '配送中') ||
                        (deliverData.status === 1000 && '已完成')}
                    </span>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="确认发货信息">
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }} layout="horizontal">
              <Row>
                <Col span={12}>
                  <Form.Item label="发货地址">
                    <span>{deliverData.address}</span>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="发货日期">
                    <span>{formatTimeString(deliverData.deliveryTime, 'YYYY-MM-DD HH:mm')}</span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="物流公司">
                    <span>{deliverData.company}</span>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="物流单号">
                    <span>{deliverData.logisticsNo}</span>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Table bordered dataSource={dataSource} columns={columns} />

            <Modal
              title="手工发货1"
              open={confirmDeliveryModal}
              onOk={onConfirmDeliveryOk}
              onCancel={onConfirmDeliveryClose}
              okText="确认"
              width={1200}
              cancelText="取消"
            >
              <Layout>
                <Content>
                  <Card>
                    <Form form={form} labelCol={{ span: 6 }} layout="horizontal">
                      <Row>
                        <Col span={12}>
                          <Form.Item
                            label="发货地址"
                            name="addressId"
                            rules={[{ required: true, message: '请选择发货地址' }]}
                          >
                            <Select options={addressInfo} />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="发货日期"
                            name="deliveryTime"
                            rules={[{ required: true, message: '请选择发货日期' }]}
                          >
                            <DatePicker showNow={false} allowClear style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <Form.Item label="物流单号" name="logisticsNo">
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="物流公司" name="companyCode">
                            <Select options={companyList} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Table columns={confirmDeliveryColumns} dataSource={dataSource} />
                    </Form>
                  </Card>
                </Content>
              </Layout>
            </Modal>
          </Card>
        </Space>
      </PageHeaderWrapper>
    </div>
  )
}

export default CbgDeliveryConfirm
