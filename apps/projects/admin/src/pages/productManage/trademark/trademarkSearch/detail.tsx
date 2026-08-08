import type { ReactNode } from 'react'
import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { Steps, Space, Tooltip, Row, Col, Descriptions, Table, Image } from 'antd'
import { Card } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import { QuestionCircleOutlined } from '@ant-design/icons'
import type { ColumnType } from 'antd/lib/table/interface'
import ReturnEle from '@/components/ReturnEle'
import { formatTimeString } from '@/utils'
import styles from './index.less'
import { getProductBrandGetPlatformBrandCheckRecord, getProductBrandGetPlatformBrand } from '@apps/apis'

const { Step } = Steps

const viewBrand: React.FC<{}> = () => {
  const [brandInfo, setBrandInfo] = useState<any>({})
  const [fixStep, setFixStep] = useState(0)
  const [recordData, setRecordData] = useState<any[]>([])
  const { id } = useQuery()

  useEffect(() => {
    if (id) {
      getProductBrandGetPlatformBrand({ id: id }).then((res) => {
        if (res.code === 1000) {
          setBrandInfo(res.data)
          if (res.data.status === 1) setFixStep(0)
          else if (res.data.status === 2) setFixStep(1)
          else setFixStep(2)
        }
      })
      getProductBrandGetPlatformBrandCheckRecord({ brandId: id }).then((res) => {
        if (res.code === 1000) setRecordData(res.data)
      })
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

  return (
    <PageHeaderWrapper
      titleIcon={brandInfo?.logoUrl}
      title={brandInfo?.name}
      isAnchor
      items={[
        {
          key: 'process',
          label: '流程进度',
        },
        {
          key: 'basicInfo',
          label: '基本信息',
        },
        {
          key: 'evidence',
          label: '证明材料',
        },
        {
          key: 'auditLog',
          label: '审核记录',
        },
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={16}>
        <Card headStyle={{ borderBottom: 'none' }} title="流程进度" id="process">
          <Steps progressDot current={fixStep}>
            <Step title="提交审核" description="供应商" />
            {brandInfo.type === 1 ? (
              <Step title="审核品牌" description="供应商" />
            ) : (
              <Step title="审核品牌" description="平台" />
            )}
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
        <Card headStyle={{ borderBottom: 'none' }} title={tips} id="evidence">
          <Row gutter={24}>{fixProveUrl(brandInfo.provePic)}</Row>
        </Card>
        <Card headStyle={{ borderBottom: 'none' }} title="审核历史">
          <Table dataSource={recordData} columns={columns} pagination={false} />
        </Card>
      </Space>
    </PageHeaderWrapper>
  )
}

export default viewBrand
