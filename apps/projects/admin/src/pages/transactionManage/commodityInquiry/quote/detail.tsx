import React, { Fragment, useEffect, useState } from 'react'
import { Tag, Typography, Space } from 'antd'
import { Image } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import type { ColumnType } from 'antd/lib/table/interface'
import { PageHeaderWrapper } from '@apps/components'
import { Context } from '@/components/DetailLayout/components/context'
import { formatTimeString } from '@/utils'
import { LinkOutlined } from '@ant-design/icons'
import ProgressLayout from '@/components/DetailLayout/components/progressLayout'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import ListLayout from '@/components/DetailLayout/components/listLayout'
import GeneralLayout from '@/components/DetailLayout/components/generalLayout'
import RecordLyout from '@/components/DetailLayout/components/recordLyout'
import { jumpDefaultMall } from '@/constants'
import {
  getCommodityMobileStoreMobileFindByMemberIdAndRoleId,
  getCommodityShopDetails,
  getTradeInquiryDetails,
  getTradePlatformProductQuotationDetails,
} from '@apps/apis'
import { downloadFileByNameAndUrl, getMallLink } from '@apps/utils'

const TABLINK = [
  { key: 'progressLayout', label: '流转进度' },
  { key: 'basicLayout', label: '基本信息' },
  { key: 'inquiryProductLayout', label: '商品询价' },
  { key: 'otherLayout', label: '其他说明' },
  { key: 'fileLayout', label: '附件' },
  { key: 'recordLyout', label: '流转记录' },
]

const ConfirmOfferDetail = () => {
  const { id } = useQuery()
  // const { pathname } = useLocation()
  // const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  // const [pathPci] = useState(pathname.split('/')[pathname.split('/').length - 3])
  const [dataSource, setDataSource] = useState<any>({})
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [otherEffect, setOtherEffect] = useState<any>([])
  const [fileEffect, setFileEffect] = useState<any>([])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '报价单号', extra: data.quotationNo },
          { label: '报价摘要', extra: data.details },
          { label: '外部状态', extra: <Tag color="default">{data.externalStateName}</Tag> },
          { label: '询价会员', extra: data.memberName },
        ],
      },
      {
        col: [
          { label: '对应询价单号', extra: data.inquiryListNo },
          { label: '报价会员', extra: data.supplyMembersName },
          { label: '报价截止时间', extra: formatTimeString(data.quotationAsTime) },
        ],
      },
      {
        col: [{ label: '单据时间', extra: formatTimeString(data.voucherTime) }],
      },
    ])
  }

  const handleOtherEffect = (data: any) => {
    setOtherEffect([
      {
        col: [
          { label: '最小起订', extra: data.minimumOrder },
          { label: '交付说明', extra: data.deliveryInstructions },
          { label: '付款说明', extra: data.paymentType },
        ],
      },
      {
        col: [
          { label: '税费说明', extra: data.taxes },
          { label: '物流说明', extra: data.logistics },
          { label: '包装说明', extra: data.packRequire },
        ],
      },
      {
        col: [{ label: '其他说明', extra: data.otherRequire }],
      },
    ])
  }

  const handleFileEffect = (data: any) => {
    setFileEffect([
      {
        col: [
          {
            label: '附件',
            extra: (
              <>
                {data.enclosureUrls &&
                  data.enclosureUrls.map((item: any, index: number) => (
                    <Typography.Link
                      style={{ display: 'block', paddingBottom: '8px' }}
                      key={`link_${index + 1}`}
                      onClick={() => downloadFileByNameAndUrl(item.url, item.name)}
                    >
                      <LinkOutlined />
                      {item.name}
                    </Typography.Link>
                  ))}
              </>
            ),
          },
        ],
      },
    ])
  }

  const fetchDataSource = async () => {
    await getTradePlatformProductQuotationDetails({ id }).then((res: any) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      data.externalLogStates = data.externalQuotationStateResponses ? [...data.externalQuotationStateResponses] : []
      // data.interiorLogStates = data.interiorQuotationStateResponses ? [...data.interiorQuotationStateResponses] : null;
      data.externalLogs = data.externalRequisitionFormResponses ? [...data.externalRequisitionFormResponses] : []
      // data.interiorLogs = data.interiorQuotationLogResponses ? [...data.interiorQuotationLogResponses] : null;
      setDataSource(data)
      handleBasicEffect(data)
      handleOtherEffect(data)
      handleFileEffect(data)
    })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const jumpCommodityDetail = async (record: any) => {
    try {
      if (dataSource) {
        // 根据商城id获取商城信息
        const { data: shopInfo } = await getCommodityShopDetails({ id: String(dataSource?.shopId) })
        if (shopInfo) {
          const mallLink = getMallLink(shopInfo.url, shopInfo.isSelf ? record?.memberId : undefined)
          let commodityUrl = ``
          if (!shopInfo.isSelf) {
            // 根据会员id和角色id获取店铺id
            const { data: storeInfo } = await getCommodityMobileStoreMobileFindByMemberIdAndRoleId({
              memberId: record?.memberId,
              roleId: record?.memberRoleId,
            } as any)
            commodityUrl = `/shop/${storeInfo.id}/inquiry/detail/${record.commodityId}`
          } else {
            commodityUrl = `/inquiry/detail/${record.commodityId}`
          }
          window.open(mallLink + commodityUrl)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columns: ColumnType<any>[] = [
    {
      title: '商品ID',
      key: 'productId',
      dataIndex: 'productId',
    },
    {
      title: '商品图片',
      key: 'imgUrl',
      dataIndex: 'imgUrl',
      render: (imgUrl) => <img src={imgUrl} width={24} height={24} />,
    },
    {
      title: '商品名称',
      key: 'productName',
      dataIndex: 'productName',
      render: (productName, data) => (
        <Space direction="vertical">
          <Typography.Link
            target="_blank"
            style={{
              maxWidth: 360,
            }}
            ellipsis
            onClick={
              () => jumpCommodityDetail(data)
              // jumpDefaultMall(`/shop/${data.memberId}/commodity/detail/${data.commodityId}`)
            }
            title={productName}
          >
            {productName}
          </Typography.Link>
        </Space>
      ),
    },
    {
      title: '品类',
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: '品牌',
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: '采购数量',
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
    {
      title: '含税/税率',
      key: 'taxRate',
      dataIndex: 'taxRate',
      render: (taxRate) => {
        if (taxRate) {
          return `是/${taxRate}%`
        } else {
          return '否'
        }
      },
    },
    {
      title: '报价单价',
      key: 'price',
      dataIndex: 'price',
      render: (price) => <>{price ? `￥${price.toFixed(2)}` : '￥0.00'}</>,
    },
    {
      title: '金额',
      key: 'money',
      dataIndex: 'money',
      render: (money) => <>{money ? `￥${money.toFixed(2)}` : '￥0.00'}</>,
    },
  ]

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper subTitle={dataSource.quotationNo} title={dataSource.details} isAnchor items={TABLINK}>
        <Space direction="vertical" size={16}>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <ListLayout
            id={id}
            anchor="inquiryProductLayout"
            title="询价商品"
            columns={columns}
            fetch={getTradeInquiryDetails}
          />
          <GeneralLayout anchor="otherLayout" title="其他说明" effect={otherEffect} />
          <GeneralLayout anchor="fileLayout" title="附件" effect={fileEffect} />
          <RecordLyout />
        </Space>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}

export default ConfirmOfferDetail
