/** 分销员查询 */
import React, { Fragment, useState, useRef, useEffect } from 'react'
import { Button, message, Popconfirm, Tag } from 'antd'
import StatusTag from '@/components/StatusTag'
import {
  EyeAuthButton,
  AuthButton,
  PageHeaderWrapper,
  StandardFormTable,
  StatusAuthButton,
  ImageBox,
} from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import ModalBox from '../components/modalBox'
import DateModalLayout from '../components/dateModal'
import {
  postProductPlatformSocialDistributionGoodsExamine,
  getOrderSocialDistributionParamGet,
  getProductMerchantSocialDistributionGoodsPage,
  postProductMerchantSocialDistributionGoodsStatus,
  getProductMerchantSocialDistributionGoodsDetail,
} from '@apps/apis'
import useSelectOptions from './services/hooks/useSelectOptions'
import moment from 'moment'
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { Form, Input, Radio, Modal, Space, Card } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import useInitialValue from '@/hooks/useInitialValue'

const { TextArea } = Input
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
  { key: '0', label: '未审核' },
  { key: '1', label: '审核不通过' },
  { key: '2', label: '审核通过' },
  { key: '3', label: '平台下架' },
]

const SocialDistributionGoods: React.FC = () => {
  const ref = useRef({} as ActionType)
  const [visible, setVisible] = useState<boolean>(false)
  const [rowParams, setRowParams] = useState<any>({})
  const [dateInfo, setDateInfo] = useState<dateInfoProps>()
  const [dateVisible, setDateVisible] = useState<boolean>(false)
  const selectData = useSelectOptions()
  const [tabLink, setTabLink] = useState<any[]>(LinkData)
  const [activeKey, setActiveKey] = useState<string>('')
  const [checkStatus, setCheckStatus] = useState<number>(1)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [socialDistributionParamStatus, setSocialDistributionParamStatus] = useState<boolean>(false)
  const [checkForm] = Form.useForm()
  const { initialValue } = useInitialValue(getOrderSocialDistributionParamGet, {})

  useEffect(() => {
    if (initialValue === null) {
      return
    }
    setSocialDistributionParamStatus(initialValue.status === 1)
  }, [initialValue])

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  const handleVerifyModal = (record) => {
    checkForm.resetFields()
    checkForm.setFieldsValue({
      id: record.id,
    })
    setVisibleModal(true)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      postProductPlatformSocialDistributionGoodsExamine({ ...values }).then((res) => {
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

  const onTabChange = (key) => {
    setActiveKey(key)
    ref.current.reload()
  }

  const handleStatus = (record) => {
    postProductMerchantSocialDistributionGoodsStatus({
      id: record.id,
      isEnable: record.status === 1 ? 0 : 1,
    }).then((res) => {
      if (res.code === 1000) {
        ref.current.reload()
      }
    })
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '商品ID',
      key: 'commoditySocialDistributionId',
      dataIndex: 'commoditySocialDistributionId',
      fixed: 'left',
      width: 60,
      searchField: 'Input',
      render: (_text, record) => <>{record.id}</>,
    },
    {
      title: '商品SKU ID',
      key: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title: '商品图',
      key: 'productImgUrl',
      dataIndex: 'productImgUrl',
      render: (productImgUrl) => <ImageBox width={48} height={48} src={productImgUrl} preview />,
    },
    {
      title: '商品属性名称',
      key: 'name',
      dataIndex: 'name',
      searchField: {
        main: true,
      },
      render: (_text, record) => (
        <Space>
          <AuthButton type="custom" code="detail">
            <Link to={`/marketingAbility/distribution/goods/detail?id=${record.id}&preview=true`}>
              {record.productName + record.attrs}
            </Link>
          </AuthButton>
        </Space>
      ),
    },
    {
      title: '品类',
      key: 'categoryId',
      dataIndex: 'categoryId',
      searchField: 'Select',
      render: (_text, record) => <>{record.category}</>,
    },
    {
      title: '品牌',
      key: 'brandId',
      dataIndex: 'brandId',
      searchField: 'Select',
      render: (_text, record) => <>{record.brand}</>,
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      render: (_text, record) => <>{record.unit}</>,
    },
    {
      title: '价格',
      key: 'price',
      dataIndex: 'price',
      render: (_text, record) => <>{record.unitPrice['0-0']}</>,
    },
    {
      title: '佣金比例',
      key: 'commissionRate',
      dataIndex: 'commissionRate',
      render: (_text, record) => <>{(record.commissionRate * 100).toFixed(2)}%</>,
    },
    {
      title: '预估佣金金额',
      key: 'estimatedCommission',
      dataIndex: 'estimatedCommission',
      render: (_text, record) => <>{record.estimatedCommission}</>,
    },
    {
      title: '申请审核时间',
      key: 'auditSubmitTime',
      dataIndex: 'auditSubmitTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '申请通过时间',
      key: 'auditApprovalTime',
      dataIndex: 'auditApprovalTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '审核状态',
      key: 'auditStatus',
      dataIndex: 'auditStatus',
      render: (text: any) => {
        if (text === 0) return '未审核'
        else if (text === 1) return '审核不通过'
        else if (text === 2) return '审核通过'
        else if (text === 3) return '平台下架'
      },
    },
    {
      title: '启用状态',
      key: 'socialDistributionStatus',
      dataIndex: 'socialDistributionStatus',
      searchField: {
        title: '启用状态',
        type: 'Select',
        valueEnum: [
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 2,
          },
        ],
      },
      render: (text: any, record) => {
        if (record.status === 1) return '已启用'
        else if (record.status === 2) return '已禁用'
      },
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Space>
          {(record.auditStatus === 1 || record.auditStatus === 2) && record.status === 2 && (
            <AuthButton type="custom" code="edit">
              <Link to={`/marketingAbility/distribution/goods/edit?id=${record.id}`}>修改</Link>
            </AuthButton>
          )}
          {record.auditStatus === 2 && (
            <AuthButton type="custom" code="status">
              <a onClick={() => handleStatus(record)}>{record.status === 1 ? '禁用' : '启用'}</a>
            </AuthButton>
          )}
        </Space>
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

  const fetchData = async (params: any) => {
    const { ...arg } = params
    const payload = { ...arg }

    console.log('payload', payload)
    console.log('activeKey', activeKey)

    return new Promise((resolve) => {
      getProductMerchantSocialDistributionGoodsPage({ ...payload, auditStatus: activeKey }).then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })
  }

  const searchButtons = [
    {
      children: '新增',
      type: 'primary',
      icon: 'add',
      key: 'add',
      onClick: () => history.push('/marketingAbility/distribution/goods/add'),
    },
  ]

  return (
    <PageHeaderWrapper isTabs items={tabLink} onTabChange={(key) => onTabChange(key)}>
      <Card>
        {socialDistributionParamStatus ? (
          <Tag color="success">当前分销设置已开启</Tag>
        ) : (
          <Tag color="error">当前分销设置已关闭</Tag>
        )}
        <StandardFormTable
          columns={columns}
          autoScrollX
          request={(params) => fetchData(params)}
          rowKey="id"
          actionRef={ref}
          searchSelectMaps={selectData}
          searchButtons={searchButtons}
        />
      </Card>

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
        title="审核分销商品"
        visible={visibleModal}
        onOk={handleOK}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <Form layout="vertical" form={checkForm}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="isPass"
            label=""
            rules={[
              {
                required: true,
                message: '请选择审核状态',
              },
            ]}
            initialValue={1}
          >
            <Radio.Group onChange={handleStatusChange}>
              <Radio value={1}>审核通过</Radio>
              <Radio value={0}>审核不通过</Radio>
            </Radio.Group>
          </Form.Item>
          {checkStatus === 0 && (
            <Form.Item
              name="opinion"
              label={'审核不通过原因'}
              rules={[
                {
                  required: true,
                  message: '请填写原因',
                },
              ]}
            >
              <TextArea rows={3} placeholder="请填写原因" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </PageHeaderWrapper>
  )
}
export default SocialDistributionGoods
