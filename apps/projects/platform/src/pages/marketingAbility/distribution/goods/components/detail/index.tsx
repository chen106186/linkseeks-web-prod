import React, { Fragment, useEffect, useState } from 'react'
import { Card, Input, Button, Table, message } from 'antd'
import { ImageBox, PageHeaderWrapper, type RecordColumns } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getProductMerchantSocialDistributionGoodsDetail,
  postProductMerchantSocialDistributionGoodsUpdate,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import { SaveOutlined } from '@ant-design/icons'

const SocialDistributionGoods = () => {
  const { id, preview } = usePageStatus()
  const [unsaved, setUnsaved] = useState(true)
  const { initialValue } = useInitialValue(getProductMerchantSocialDistributionGoodsDetail, { id: id })
  const [dataSource, setDataSource] = useState([])
  const [auditDataSource, setAuditDataSource] = useState([])
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview
  const [loading, setLoading] = useState<boolean>(false)
  usePrompt({ when: (isAdd || isEdit) && unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  useEffect(() => {
    if (initialValue === null) {
      return
    }
    console.log(initialValue)
    let productList = [
      {
        id: initialValue.id,
        commodityId: initialValue.commodityId,
        skuId: initialValue.skuId,
        productImgUrl: initialValue.productImgUrl,
        productName: initialValue.productName + initialValue.attr,
        category: initialValue.category,
        brand: initialValue.brand,
        unit: initialValue.unit,
        price: initialValue.price,
        auditSubmitTime: initialValue.auditSubmitTime,
        commissionRate: initialValue.commissionRate,
        estimatedCommission: initialValue.estimatedCommission,
      },
    ]
    setDataSource(productList)
    const sortedAuditRecordList = [...initialValue.auditRecordList].sort((a, b) => b.id - a.id)
    setAuditDataSource(sortedAuditRecordList)
  }, [initialValue])

  const handleSubmit = () => {
    if (dataSource.length == 0) {
      message.warning('没有数据')
      return
    }
    setUnsaved(false)
    postProductMerchantSocialDistributionGoodsUpdate({
      id: dataSource[0].id,
      commissionRate: dataSource[0].commissionRate,
    }).then((data) => {
      if (data.code !== 1000) {
        message.warning('保存失败')
      }
      history.replace('/marketingAbility/distribution/goods')
    })
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
      render: (_text, record, index) => (
        <>
          {!isView ? (
            <Input
              size="small"
              value={(record.commissionRate * 100).toFixed(2)}
              onChange={(e) => {
                const newVal = parseFloat(e.target.value || '0') / 100
                const newData = [...dataSource]
                const estimatedCommission = (record.price * newVal).toFixed(2)
                newData[index] = {
                  ...newData[index],
                  commissionRate: newVal,
                  estimatedCommission: estimatedCommission,
                }
                setDataSource(newData)
              }}
              suffix="%"
            />
          ) : (
            (record.commissionRate * 100).toFixed(2) + '%'
          )}
        </>
      ),
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
        title="编辑分销商品"
        extra={
          !isView && (
            <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
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
      </PageHeaderWrapper>
    </div>
  )
}

export default SocialDistributionGoods
