import React, { Fragment, useEffect, useState } from 'react'
import { Card, Input, Button, Table, message, Col, Row } from 'antd'
import { ImageBox, PageHeaderWrapper, type RecordColumns } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import {
  getOrderSocialDistributionParamGet,
  postCommodityWebShopWebAll,
  postProductMerchantSocialDistributionGoodsSave,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import CollocationLayout from '@/pages/marketingAbility/distribution/components/collocationLayout'
import { SaveOutlined } from '@ant-design/icons'
import useInitialValue from '@/hooks/useInitialValue'

const SocialDistributionGoods = () => {
  const { id, preview } = usePageStatus()
  const [unsaved, setUnsaved] = useState(true)
  const [dataSource, setDataSource] = useState([])
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview
  const [productVisible, setProductVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [shopIdList, setShopIdList] = useState([])
  const [configRate, setConfigRate] = useState<number>(0.1)
  const { initialValue } = useInitialValue(getOrderSocialDistributionParamGet, {})
  usePrompt({ when: (isAdd || isEdit) && unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  useEffect(() => {
    if (initialValue === null) {
      return
    }
    setConfigRate(initialValue.rate)
  }, [initialValue])
  useEffect(() => {
    postCommodityWebShopWebAll({ isMemberType: true }, { ctlType: 'none' }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      const tmpShopIdList = []
      res.data.map((item) => {
        if (item.environment !== 3) {
          return
        }
        tmpShopIdList.push(item.id)
      })
      setShopIdList(tmpShopIdList)
    })
  }, [])

  const handleSelectProducts = (params) => {
    const merged = [...dataSource, ...params]

    const uniqueMap = new Map()

    merged.forEach((item) => {
      const estimatedCommission = (item.price * configRate).toFixed(2)
      item.commissionRate = configRate
      item.estimatedCommission = estimatedCommission
      uniqueMap.set(item.skuId, item) // skuId 相同的后加入的会覆盖
    })

    setDataSource(Array.from(uniqueMap.values()))
    setProductVisible(false)
  }

  const handleSubmit = () => {
    if (dataSource.length === 0) {
      message.warning('请选择商品')
      return
    }
    let productList = []
    dataSource.forEach((item) => {
      productList.push({
        commodityId: item.commodityId,
        skuId: item.skuId,
        shopId: 4,
        commissionRate: item.commissionRate,
      })
    })
    setUnsaved(false)
    postProductMerchantSocialDistributionGoodsSave({
      productList: productList,
    }).then((data) => {
      if (data.code !== 1000) {
        message.warning('保存失败')
        return
      }
      history.replace('/marketingAbility/distribution/goods')
    })
  }

  const toggle = (flag: boolean) => {
    setProductVisible(flag)
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
      key: 'categoryId',
      dataIndex: 'categoryId',
      render: (_text, record) => <>{record.category}</>,
    },
    {
      title: '品牌',
      key: 'brandId',
      dataIndex: 'brandId',
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
      ),
    },
    {
      title: '预估佣金金额',
      key: 'estimatedCommission',
      dataIndex: 'estimatedCommission',
      render: (_text, record) => <>{record.estimatedCommission}</>,
    },
    {
      title: '操作',
      key: 'state',
      dataIndex: 'state',
      fixed: 'right',
      render: (_text, record) => (
        <Fragment>
          <Button
            type="link"
            onClick={() => {
              const newData = dataSource.filter((item) => item.skuId !== record.skuId)
              setDataSource(newData)
            }}
          >
            移除
          </Button>
        </Fragment>
      ),
    },
  ]

  return (
    <div>
      <PageHeaderWrapper
        title={isAdd ? '新建分销商品' : isEdit ? '编辑分销商品' : '查看分销商品'}
        extra={
          <Button loading={loading} icon={<SaveOutlined />} type="primary" onClick={handleSubmit}>
            提交审核
          </Button>
        }
      >
        <Card>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Button onClick={() => setProductVisible(true)}>选择商品</Button>
            </Col>
            <Col span={24}>
              <Table bordered dataSource={dataSource} columns={columns} />
            </Col>
          </Row>

          <CollocationLayout
            shopIdList={shopIdList}
            visible={productVisible}
            toggle={toggle}
            onConfirm={handleSelectProducts}
          />
        </Card>
      </PageHeaderWrapper>
    </div>
  )
}

export default SocialDistributionGoods
