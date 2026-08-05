import React, { useState, useEffect, useRef } from 'react'
import { Table, Typography, Button, Popconfirm, Space, Form, Row, Col, Input, Select, Modal, message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import { LinkOutlined, PlusOutlined } from '@ant-design/icons'
import { PageHeaderWrapper, ModalFormTable, ModalFormTableRef } from '@apps/components'
import { getMemberManagePlatformProviderPage } from '@apps/apis'
import LevelBrand from '@/components/LevelBrand'
import { Card } from '@linkseeks/ui'
import { getOrderPlatformPaymentMemberParameterFind, postOrderPlatformPaymentMemberParameterCreate } from '@apps/apis'
import { isEmpty } from 'lodash'
import { useLocation, getCurrentRouter } from '@linkseeks/router-core'

const { Option } = Select
const { TextArea } = Input

type channel = {
  /** 参数枚举值 */
  code?: number
  /** 参数Key名称 */
  key: string
}[]

const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

const TAB_LINK = [
  { key: 'basicInfo', label: '基本信息' },
  { key: 'typeLayout', label: '参数配置' },
]

const Level = (type) => {
  switch (type) {
    case '青铜会员':
      return 1
    case '白银会员':
      return 2
    case '黄金会员':
      return 3
    case '钻石会员':
      return 4
    default:
      return 10086
  }
}

const MerchantPayTypeAdded: React.FC = () => {
  const { pathname, state } = useLocation()
  const modalRef = ModalFormTable.useTableRef()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [typeVisible, setTypeVisible] = useState<boolean>(false)
  const [memberInfo, setMemberInfo] = useState<any>({})
  const [dataSource, setDataSource] = useState<any[]>([])
  const [form] = Form.useForm()
  const [form1] = Form.useForm()
  const [channel, setChannel] = useState<channel>([])

  const [_edit, setEdit] = useState<number>(0)
  const [editFlag, setEditFlag] = useState<boolean>(false)

  /** 删除支付参数 */
  const handleDelete = (index) => {
    const _parameters = [...dataSource]
    _parameters.splice(index, 1)
    setDataSource(_parameters)
  }

  /** 编辑支付参数 */
  const handleEdit = (record, index) => {
    form1.setFieldsValue({ ...record })
    setEdit(index)
    setEditFlag(true)
    setTypeVisible(true)
  }

  const columns: ColumnType<any>[] = [
    {
      title: '参数代码',
      key: 'key',
      dataIndex: 'key',
    },
    {
      title: '参数值',
      key: 'value',
      dataIndex: 'value',
      width: '50%',
      ellipsis: true,
      render: (text, record) => (
        <>
          {record.code === 14 && (
            <Typography.Link href={text} target="_blank">
              {text}
            </Typography.Link>
          )}
          {record.code !== 14 && <>{text}</>}
        </>
      ),
    },
    {
      title: '参数描述',
      key: 'remark',
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'options',
      dataIndex: 'options',
      render: (_: any, record: any, index: number) => (
        <>
          {path !== 'detail' && (
            <>
              <Button type="link" onClick={() => handleEdit(record, index)}>
                编辑
              </Button>
              <Popconfirm onConfirm={() => handleDelete(index)} title="确定要执行这个操作?" okText="是" cancelText="否">
                <Button type="link">删除</Button>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ]

  const fetchMembersList = (params) => {
    return new Promise((resolve) => {
      getMemberManagePlatformProviderPage({ ...params }).then((res) => {
        resolve(res.data)
      })
    })
  }

  const toggle = (flag: boolean) => {
    modalRef.current.setVisible(flag)
  }

  const handleSubmit = (selectRows: any) => {
    form.setFieldsValue({ name: selectRows[0].name })
    const param = {
      ...selectRows[0],
      fundModeName: '会员直接到账',
      payTypeName: '线上支付',
      payChannelName: '支付宝',
    }
    setMemberInfo(param)
    modalRef.current.setVisible(false)
  }

  useEffect(() => {
    getOrderPlatformPaymentMemberParameterFind({}).then((res) => {
      if (res.code !== 1000) {
        return
      }
      setChannel(res.data)
    })
  }, [])

  const handleConfirm = () => {
    form1.validateFields().then((res) => {
      const data: any[] = [...dataSource]
      if (editFlag) {
        data[_edit] = { ...res, key: channel.filter((item) => item.code === res.code)[0].key }
      } else {
        data.push({ ...res, key: channel.filter((item) => item.code === res.code)[0].key })
      }
      setEditFlag(false)
      setDataSource(data)
      setTypeVisible(false)
      form1.resetFields()
    })
  }

  const handleCancel = () => {
    setTypeVisible(false)
    form1.resetFields()
  }

  const submit = () => {
    form.validateFields().then((res) => {
      const param = {
        memberId: memberInfo.memberId,
        roleId: memberInfo.roleId,
        code: dataSource[0].code,
        value: dataSource[0].value,
        remark: dataSource[0].remark,
      }
      postOrderPlatformPaymentMemberParameterCreate(param).then((res) => {
        if (res.code !== 1000) {
          message.error(res.message)
          return
        }
        history.goBack()
      })
    })
  }

  useEffect(() => {
    if (!isEmpty(state?.record) && !isEmpty(channel)) {
      form.setFieldsValue({ ...state?.record })
      setMemberInfo(state?.record)
      setDataSource([
        {
          code: state?.record.code,
          value: state?.record.value,
          remark: state?.record.remark,
          key: channel.filter((item) => item.code === state?.record.code)[0].key,
        },
      ])
    }
  }, [state?.record, channel])

  const currentRouter = getCurrentRouter(location.pathname)

  return (
    <>
      <PageHeaderWrapper
        title={currentRouter?.title}
        isAnchor
        items={TAB_LINK}
        extra={
          path !== 'detail' && (
            <Button icon={<PlusOutlined />} type="primary" onClick={submit}>
              保存
            </Button>
          )
        }
      >
        <Form {...layout} form={form}>
          <Card id="basicInfoLayout" title="基本信息">
            <Row gutter={[48, 24]}>
              <Col span={12}>
                {path !== 'detail' && (
                  <Form.Item label="会员名称" name="name" rules={[{ required: true, message: '请选择会员' }]}>
                    <Input.Search
                      onSearch={() => toggle(true)}
                      readOnly
                      enterButton={
                        <Button style={{ height: '32.19px' }} icon={<LinkOutlined />}>
                          选择
                        </Button>
                      }
                    />
                  </Form.Item>
                )}
                {path === 'detail' && (
                  <Form.Item label="会员名称" name="name" rules={[{ required: true, message: '请选择会员' }]}>
                    <Typography.Text>{memberInfo.name}</Typography.Text>
                  </Form.Item>
                )}
                <Form.Item label="会员类型">
                  <Typography.Text>{memberInfo.memberTypeName}</Typography.Text>
                </Form.Item>
                <Form.Item label="会员角色">
                  <Typography.Text>{memberInfo.roleName}</Typography.Text>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="会员等级">
                  {path !== 'detail' && (
                    <LevelBrand level={memberInfo.levelTag ? Level(memberInfo.levelTag) : memberInfo.level} />
                  )}
                  {path === 'detail' && <LevelBrand level={Level(memberInfo.levelTag)} />}
                </Form.Item>
                <Form.Item label="资金归集模式">
                  <Typography.Text>{memberInfo.fundModeName}</Typography.Text>
                </Form.Item>
                <Form.Item label="支付方式">
                  <Typography.Text>{memberInfo.payTypeName}</Typography.Text>
                </Form.Item>
                <Form.Item label="支付渠道">
                  <Typography.Text>{memberInfo.payChannelName}</Typography.Text>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card id="typeLayout" title="参数配置">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Table
                rowKey={(_record: any, index: any) => `table${index + 1}`}
                dataSource={dataSource}
                columns={columns}
                pagination={false}
              />
              {path !== 'detail' && (
                <Button
                  disabled={dataSource.length >= 1}
                  type="dashed"
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: '24px' }}
                  onClick={() => setTypeVisible(true)}
                >
                  新增参数配置
                </Button>
              )}
            </Space>
          </Card>
        </Form>
      </PageHeaderWrapper>
      {/* 选择会员 */}
      <ModalFormTable
        modalType="Drawer"
        modalTitle="选择会员"
        actionRef={modalRef}
        request={fetchMembersList}
        columns={[
          {
            title: '会员ID',
            key: 'id',
            dataIndex: 'memberId',
          },
          {
            title: '会员名称',
            key: 'name',
            dataIndex: 'name',
            searchField: 'Input',
          },
          {
            title: '会员类型',
            key: 'memberTypeName',
            dataIndex: 'memberTypeName',
          },
          {
            title: '会员角色',
            key: 'roleName',
            dataIndex: 'roleName',
          },
          {
            title: '会员等级',
            key: 'levelTag',
            dataIndex: 'levelTag',
          },
        ]}
        isRowSelection
        rowSelectionType="radio"
        rowKey="id"
        pagination={false}
        onOk={handleSubmit}
        width={900}
      />
      {/* 参数配置 */}
      <Modal width={576} title="新增参数配置" visible={typeVisible} onOk={handleConfirm} onCancel={handleCancel}>
        <Form form={form1} {...layout}>
          <Form.Item name="code" label="参数代码" rules={[{ required: true, message: '请选择参数代码' }]}>
            <Select>
              {channel.map((item: any) => (
                <Option key={item.code} value={item.code}>
                  {item.key}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="value" label="参数值" rules={[{ required: true, message: '请输入参数值' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="remark" label="参数描述">
            <TextArea maxLength={200} rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default MerchantPayTypeAdded
