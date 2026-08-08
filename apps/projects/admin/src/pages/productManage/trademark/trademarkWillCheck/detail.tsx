import type { ReactNode } from 'react'
import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
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
} from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import { QuestionCircleOutlined, CheckSquareOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import ReturnEle from '@/components/ReturnEle'
import { formatTimeString } from '@/utils'
import styles from '../trademarkSearch/index.less'
import {
  getProductBrandGetPlatformBrandCheckRecord,
  getProductBrandGetPlatformBrand,
  postProductBrandCheckPlatformBrand,
} from '@apps/apis'

const { Step } = Steps
const { TextArea } = Input

const CheckBrand: React.FC<{}> = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [brandInfo, setBrandInfo] = useState<any>({})
  const [fixStep, setFixStep] = useState(0)
  const [recordData, setRecordData] = useState<any[]>([])
  const [checkForm] = Form.useForm()
  const [disableCheck, setDisableCheck] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<number>(4)
  const { id } = useQuery()

  const loadPageData = (brandId: string) => {
    getProductBrandGetPlatformBrand({ id: brandId }).then((res) => {
      if (res.code === 1000) {
        setBrandInfo(res.data)
        if (res.data.status === 1) setFixStep(0)
        else if (res.data.status === 2) setFixStep(1)
        else setFixStep(2)
      }
    })
    getProductBrandGetPlatformBrandCheckRecord({ brandId: brandId }).then((res) => {
      if (res.code === 1000) setRecordData(res.data)
    })
  }

  useEffect(() => {
    if (id) {
      loadPageData(id)
    }
  }, [])

  const columns: ColumnType<any>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: '角色',
      dataIndex: 'memberRoleName',
      key: 'memberRoleName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        if (record.status === 1)
          component = (
            <>
              <span className="commonStatusInvalid" />
              待提交审核
            </>
          )
        else if (record.status === 2)
          component = (
            <>
              <span className="commonStatusModify" />
              待审核
            </>
          )
        else if (record.status === 3)
          component = (
            <>
              <span className="commonStatusStop" />
              审核不通过
            </>
          )
        else if (record.status === 4)
          component = (
            <>
              <span className="commonStatusValid" />
              审核通过
            </>
          )
        return component
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text: any, record: any) => {
        let component: ReactNode = null
        if (record.operation === 1) component = <>提交审核</>
        else if (record.operation === 2) component = <>修改品牌</>
        else if (record.operation === 3) component = <>审核品牌</>
        return component
      },
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text: any) => formatTimeString(text),
    },
    {
      title: '意见',
      dataIndex: 'checkRemark',
      key: 'checkRemark',
    },
  ]

  const fixStatus = (state: number) => {
    if (state === 1)
      return (
        <>
          <span className="commonStatusInvalid" />
          待提交审核
        </>
      )
    else if (state === 2)
      return (
        <>
          <span className="commonStatusModify" />
          待审核
        </>
      )
    else if (state === 3)
      return (
        <>
          <span className="commonStatusStop" />
          审核不通过
        </>
      )
    else if (state === 4)
      return (
        <>
          <span className="commonStatusValid" />
          审核通过
        </>
      )
    else if (state === 5)
      return (
        <>
          <span className="commonStatusValid" />
          已上架
        </>
      )
    else if (state === 6)
      return (
        <>
          <span className="commonStatusStop" />
          已下架
        </>
      )
  }

  const fixProveUrl = (proveInfo: any) => {
    if (proveInfo) {
      const imgArray = Object.values(proveInfo)
      return imgArray.map((item: any, index: number) => (
        <Col key={index} span={3} xxl={3} xl={4} lg={4}>
          <div className={styles.proveBox}>
            <Image width={175} height={120} src={item} alt="品牌相关证明材料" />
          </div>
        </Col>
      ))
    }
  }

  const tips = (
    <>
      证明材料
      <Tooltip title="证明材料：如商标注册证书、品牌授权证书等证明材料">
        <span>
          &nbsp;
          <QuestionCircleOutlined />
        </span>
      </Tooltip>
    </>
  )
  const content = (
    <>
      <Descriptions colon={true} style={{ textAlign: 'left', marginLeft: 48, width: 800 }}>
        <Descriptions.Item span={1} label="商家名称">
          {brandInfo?.memberName}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="申请审核时间">
          {brandInfo.applyTime && formatTimeString(brandInfo.applyTime)}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="审核状态">
          {fixStatus(brandInfo?.status)}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="品牌状态">
          {brandInfo.isEnable ? '有效' : '无效'}
        </Descriptions.Item>
      </Descriptions>
    </>
  )

  const handleApplyCheck = () => {
    setVisibleModal(true)
  }

  const handleCancel = () => {
    checkForm.resetFields()
    setVisibleModal(false)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      postProductBrandCheckPlatformBrand({ id: brandInfo?.id, ...values }).then((res) => {
        if ((res.code = 1000)) {
          handleCancel()
          setDisableCheck(true)
          loadPageData(res.data)
        }
      })
    })
  }

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  return (
    <PageHeaderWrapper
      titleIcon={brandInfo?.logoUrl}
      title={brandInfo?.name}
      extra={[
        <Button
          icon={<CheckSquareOutlined />}
          key="1"
          type="primary"
          onClick={handleApplyCheck}
          disabled={disableCheck}
        >
          品牌审核
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card headStyle={{ borderBottom: 'none' }} title="流程进度">
          <Steps progressDot current={fixStep}>
            <Step title="提交审核" description="供应商" />
            <Step title="审核品牌" description="平台" />
            <Step title="完成" description="" />
          </Steps>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="基本信息" id="basicInfo">
          <Descriptions column={2} colon={true} className="common-descriptions">
            <Descriptions.Item span={1} label="品牌Logo">
              <img
                src={brandInfo?.logoUrl}
                width={40}
                height={40}
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
              {fixStatus(brandInfo?.status)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title={tips}>
          <Row gutter={24}>{fixProveUrl(brandInfo.provePic)}</Row>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="审核历史">
          <Table dataSource={recordData} columns={columns} pagination={false} />
        </Card>
      </Space>
      <Modal title="品牌审核" visible={visibleModal} onOk={handleOK} onCancel={handleCancel}>
        <Form layout="vertical" form={checkForm}>
          <Form.Item
            name="status"
            label=""
            rules={[
              {
                required: true,
                message: '请选择审核状态',
              },
            ]}
            initialValue={4}
          >
            <Radio.Group onChange={handleStatusChange}>
              <Radio value={4}>审核通过</Radio>
              <Radio value={3}>审核不通过</Radio>
            </Radio.Group>
          </Form.Item>
          {checkStatus === 3 && (
            <Form.Item
              name="checkRemark"
              label="审核不通过原因"
              rules={[
                {
                  required: true,
                  message: '请填写原因',
                },
              ]}
            >
              <TextArea rows={3} maxLength={60} placeholder="请填写原因" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}

export default CheckBrand
