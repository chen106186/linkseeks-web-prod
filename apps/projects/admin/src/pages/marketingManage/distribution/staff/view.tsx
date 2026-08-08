/** 分销员查询 */
import React, { Fragment, useState, useRef, useEffect } from 'react'
import { Select, Tag, Row, Col, Popconfirm } from 'antd'
import { AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import ModalBox from '../components/modalBox'
import DateModalLayout from '../components/dateModal'
import {
  getMarketingSocialDistributionStaffPage,
  postMarketingSocialDistributionStaffSave,
  postMarketingSocialDistributionStaffStatus,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import { Form, Input, Modal, Radio, Space } from '@linkseeks/ui'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Link } from '@linkseeks/router-core'

type dateInfoProps = {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 接口 */
  fieldApi: any
}

const LinkData = [
  { key: '', label: '全部' },
  { key: '1', label: '已启用' },
  { key: '0', label: '已禁用' },
]

const SocialDistributionStaff: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [visible, setVisible] = useState<boolean>(false)
  const [rowParams, setRowParams] = useState<any>({})
  const [dateInfo, setDateInfo] = useState<dateInfoProps>()
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const selectData = useSelectOptions()
  const [tabLink, setTabLink] = useState<any[]>(LinkData)
  const [activeKey, setActiveKey] = useState<string>('')
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [levelList, setLevelList] = useState<any>([])
  const [checkForm] = Form.useForm()

  useEffect(() => {
    if (selectData) {
      const tmpList = selectData?.levelId || []
      const sortedLevelList = tmpList.sort((a, b) => a.value - b.value)
      setLevelList(sortedLevelList)
    }
  }, [selectData])

  const handleStatus = async (record: any) => {
    await postMarketingSocialDistributionStaffStatus({
      id: record.id,
      isEnable: record.status === 1 ? 0 : 1,
    })
    ref.current.reload()
  }

  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      fixed: 'left',
      width: 60,
    },
    {
      title: '会员ID',
      key: 'memberId',
      dataIndex: 'memberId',
      searchField: 'Input',
    },
    {
      title: '分销员名称',
      key: 'name',
      dataIndex: 'name',
      searchField: {
        main: true,
      },
      render: (_text, record) => (
        <Space>
          <AuthButton type="custom" code="detail">
            <Link to={`/marketingManage/distribution/staff/detail?id=${record.memberId}&staffName=${record.name}`}>
              {record.name}
            </Link>
          </AuthButton>
        </Space>
      ),
    },
    {
      title: '分销员等级',
      key: 'levelId',
      dataIndex: 'levelId',
      searchField: 'Select',
      render: (_text, record) => <>{record.levelName}</>,
    },
    {
      title: '归属上级',
      key: 'staffName',
      dataIndex: 'staffName',
      render: (_text, record) => <>{record.staffName}</>,
    },
    {
      title: '邀请码',
      key: 'invitationCode',
      dataIndex: 'invitationCode',
      searchField: 'Input',
      render: (_text, record) => <>{record.invitationCode}</>,
    },
    {
      title: '加入时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '下级分销员数量',
      key: 'downlineDistributorCount',
      dataIndex: 'downlineDistributorCount',
      render: (_text, record) => (
        <Space>
          <AuthButton type="custom" code="detail">
            <Link to={`/marketingManage/distribution/staff/detail?id=${record.memberId}&staffName=${record.name}`}>
              {record.downlineDistributorCount}
            </Link>
          </AuthButton>
        </Space>
      ),
    },
    {
      title: '直接分销订单数',
      key: 'directDistributionOrderCount',
      dataIndex: 'directDistributionOrderCount',
      render: (_text, record) => <>{record.directDistributionOrderCount}</>,
    },
    {
      title: '直接分销销售额',
      key: 'directDistributionSalesAmount',
      dataIndex: 'directDistributionSalesAmount',
      render: (_text, record) => <>{record.directDistributionSalesAmount.toFixed(2)}</>,
    },
    {
      title: '间接分销订单数',
      key: 'indirectDistributionOrderCount',
      dataIndex: 'indirectDistributionOrderCount',
      render: (_text, record) => <>{record.indirectDistributionOrderCount}</>,
    },
    {
      title: '间接分销销售额',
      key: 'indirectDistributionSalesAmount',
      dataIndex: 'indirectDistributionSalesAmount',
      render: (_text, record) => <>{record.indirectDistributionSalesAmount.toFixed(2)}</>,
    },
    {
      title: '已入账分销佣金',
      key: 'settledDistributionCommission',
      dataIndex: 'settledDistributionCommission',
      render: (_text, record) => <>{record.settledDistributionCommission.toFixed(2)}</>,
    },
    {
      title: '未入账分销佣金',
      key: 'unsettledDistributionCommission',
      dataIndex: 'unsettledDistributionCommission',
      render: (_text, record) => <>{record.unsettledDistributionCommission.toFixed(2)}</>,
    },
    {
      title: '账号状态',
      key: 'status',
      dataIndex: 'status',
      render: (_text, record) => <>{record.status === 1 ? '启用' : '禁用'}</>,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <AuthButton type="custom" code="status">
          <Popconfirm
            title={record.status === 1 ? '确定要禁用吗？' : '确定要启用吗？'}
            okText="是"
            cancelText="否"
            onConfirm={() => handleStatus(record)}
          >
            <a>{record.status === 1 ? '禁用' : '启用'}</a>
          </Popconfirm>
        </AuthButton>
      ),
    },
  ]

  const handleConfirm = () => {
    setVisible(false)
    ref.current.reload()
  }

  const handleOnSubmit = () => {
    setDateVisible(false)
    setDateInfo({} as dateInfoProps)
    ref.current.reload()
  }

  const onTabChange = (key) => {
    setActiveKey(key)
    ref.current.reload()
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      console.log(values)
      postMarketingSocialDistributionStaffSave({ ...values }).then((res) => {
        if (res.code === 1000) {
          ref.current.reload()
          setVisibleModal(false)
        }
        setConfirmLoading(false)
      })
      setConfirmLoading(true)
    })
  }

  const handleCancel = () => {
    checkForm.resetFields()
    setVisibleModal(false)
  }

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    console.log('payload', payload)

    return new Promise((resolve) => {
      getMarketingSocialDistributionStaffPage({ ...payload, status: activeKey }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  return (
    <PageHeaderWrapper isTabs items={tabLink} onTabChange={(key) => onTabChange(key)}>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
        searchButtons={[
          {
            children: '新增分销员',
            type: 'primary',
            onClick() {
              checkForm.resetFields()
              setVisibleModal(true)
            },
            key: 'add',
          },
        ]}
      />
      <ModalBox visible={visible} params={rowParams} onCancel={() => setVisible(false)} onConfirm={handleConfirm} />
      <DateModalLayout
        id={dateInfo?.id}
        title={dateInfo?.title}
        visible={dateVisible}
        fieldApi={dateInfo?.fieldApi}
        onCancel={() => setDateVisible(false)}
        onSubmit={handleOnSubmit}
      />
      <Modal
        title="新增分销员"
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Tag icon={<ExclamationCircleOutlined />} color="warning">
              <p>请准确输入用户手机号，若用户已注册商城账号，点击确定后用户将获得分销员资格。</p>
              <p>若用户未注册账号，则系统自动创建商城账号并发放分销员资格</p>
            </Tag>
          </Col>
          <Col span={24}>
            <Form layout="vertical" form={checkForm}>
              <Form.Item
                name="mobile"
                label="手机号"
                rules={[
                  {
                    required: true,
                    message: '请填写手机号',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="levelId"
                label="分销员等级"
                rules={[
                  {
                    required: true,
                    message: '请选择分销员等级',
                  },
                ]}
              >
                <Select options={levelList} />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </PageHeaderWrapper>
  )
}
export default SocialDistributionStaff
