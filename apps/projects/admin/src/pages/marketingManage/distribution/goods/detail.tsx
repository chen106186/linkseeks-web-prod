import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Card, Select, Input, Checkbox, Button, Popconfirm, Table, message, Col, Row } from 'antd'
import { BraftEditor, ImageBox, PageHeaderWrapper, type RecordColumns, StandardFormTable } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import {
  getProductPlatformSocialDistributionGoodsDetail,
  postProductPlatformSocialDistributionGoodsExamine,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { SaveOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { Form, Modal, Radio } from '@linkseeks/ui'
const { TextArea } = Input

const SocialDistributionGoods = () => {
  const intl = useIntl()
  const ref = useRef({} as ActionType)
  const { id, preview } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [auditDataSource, setAuditDataSource] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<number>(1)
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [showAuditBtn, setShowAuditBtn] = useState<boolean>(false)
  const [checkForm] = Form.useForm()

  useEffect(() => {
    getProductPlatformSocialDistributionGoodsDetail({
      id: id,
    }).then((res) => {
      if (res.code !== 1000) {
        message.warning('加载失败')
      }
      const data = res.data
      if (data.auditStatus === 0) {
        setShowAuditBtn(true)
      }
      let productList = [
        {
          id: data.id,
          commodityId: data.commodityId,
          skuId: data.skuId,
          productImgUrl: data.productImgUrl,
          productName: data.productName + data.attr,
          category: data.category,
          brand: data.brand,
          unit: data.unit,
          price: data.price,
          auditSubmitTime: data.auditSubmitTime,
          commissionRate: data.commissionRate,
          estimatedCommission: data.estimatedCommission,
        },
      ]
      setDataSource(productList)
      const sortedAuditRecordList = [...data.auditRecordList].sort((a, b) => b.id - a.id)
      setAuditDataSource(sortedAuditRecordList)
    })
  }, [])

  const handleStatusChange = (value: any) => {
    setCheckStatus(value.target.value)
  }

  const handleVerifyModal = () => {
    checkForm.resetFields()
    checkForm.setFieldsValue({
      id: id,
    })
    setVisibleModal(true)
  }

  const handleOK = () => {
    checkForm.validateFields().then((values) => {
      postProductPlatformSocialDistributionGoodsExamine({ ...values }).then((res) => {
        setConfirmLoading(false)
        if (res.code === 1000) {
          setVisibleModal(false)
          history.replace('/marketingManage/distribution/goods')
        }
      })
      setConfirmLoading(true)
    })
  }

  const handleCancel = () => {
    checkForm.resetFields()
    setVisibleModal(false)
  }

  const columns: RecordColumns<any>[] = [
    {
      title: '商品ID',
      key: 'commodityId',
      dataIndex: 'commodityId',
      fixed: 'left',
      width: 60,
      searchField: 'Input',
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
      key: 'productName',
      dataIndex: 'productName',
      render: (_text, record) => <>{record.productName}</>,
    },
    {
      title: '品类',
      key: 'category',
      dataIndex: 'category',
      render: (_text, record) => <>{record.category}</>,
    },
    {
      title: '品牌',
      key: 'brand',
      dataIndex: 'brand',
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
      render: (_text, record) => <>{record.price}</>,
    },
    {
      title: '申请审核时间',
      key: 'auditSubmitTime',
      dataIndex: 'auditSubmitTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '设置分销比例',
      key: 'commissionRate',
      dataIndex: 'commissionRate',
      width: 110,
      render: (_text, record) => <>{(record.commissionRate * 100).toFixed(2) + '%'}</>,
    },
    {
      title: '预估佣金金额',
      key: 'estimatedCommission',
      dataIndex: 'estimatedCommission',
      render: (_text, record) => <>{record.estimatedCommission}</>,
    },
  ]

  const auditColumns: RecordColumns<any>[] = [
    {
      title: '序号',
      key: 'index',
      render: (_text, _record, index) => index + 1,
    },
    {
      title: '操作会员角色',
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: '审核类型',
      key: 'operate',
      dataIndex: 'operate',
    },
    {
      title: '操作时间',
      key: 'operateTime',
      dataIndex: 'operateTime',
      render: (text) => formatTimeString(text, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: '备注',
      key: 'opinion',
      dataIndex: 'opinion',
    },
  ]

  return (
    <div>
      <PageHeaderWrapper
        title="查看分销商品"
        extra={
          showAuditBtn && (
            <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleVerifyModal}>
              提交审核
            </Button>
          )
        }
      >
        <Card title="设置分销商品和佣金">
          <Table bordered dataSource={dataSource} columns={columns} />
        </Card>
        <Card title="审核记录">
          <Table bordered dataSource={auditDataSource} columns={auditColumns} />
        </Card>

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
    </div>
  )
}

export default SocialDistributionGoods
