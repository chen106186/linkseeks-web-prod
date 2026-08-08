import React, { Fragment, useEffect, useState } from 'react'
import { Space, Tag, Typography } from 'antd'
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
import {
  GetTradePlatformInquiryListDetailsResponse,
  getCommodityMobileStoreMobileFindByMemberIdAndRoleId,
  getCommodityShopDetails,
  getCommodityShopListShopByReq,
  getTradePlatformInquiryListDetails,
} from '@apps/apis'
import { downloadFileByNameAndUrl, getMallLink } from '@apps/utils'

const TABLINK = [
  { key: 'progressLayout', label: '流转进度' },
  { key: 'basicLayout', label: '基本信息' },
  { key: 'inquiryProductLayout', label: '询价商品' },
  { key: 'conditionLayout', label: '交易条件' },
  { key: 'fileLayout', label: '附件' },
  { key: 'recordLyout', label: '流转记录' },
]

const ProductInquiryDetail = () => {
  const { id } = useQuery()
  const [dataSource, setDataSource] = useState<GetTradePlatformInquiryListDetailsResponse>()
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [conditionEffect, setConditionEffect] = useState<any>([])
  const [fileEffect, setFileEffect] = useState<any>([])

  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          { label: '询价单号', extra: data.inquiryListNo },
          { label: '询价摘要', extra: data.details },
        ],
      },
      {
        col: [
          { label: '外部状态', extra: <Tag color="default">{data.externalStateName}</Tag> },
          // { label: '内部状态', extra: <Badge status="default" text={data.interiorStateName} /> },
          { label: '被询价会员', extra: data.memberName },
        ],
      },
      {
        col: [{ label: '单据时间', extra: formatTimeString(data.voucherTime) }],
      },
    ])
  }

  const handleConditionEffect = (data: any) => {
    setConditionEffect([
      {
        col: [
          { label: '交付日期', extra: formatTimeString(data.deliveryTime) },
          { label: '交付地址', extra: data.fullAddress },
          { label: '报价截止时间', extra: formatTimeString(data.quotationAsTime) },
        ],
      },
      {
        col: [
          { label: '报价要求', extra: data.offer },
          { label: '付款方式', extra: data.paymentType },
          { label: '税费要求', extra: data.taxes },
        ],
      },
      {
        col: [
          { label: '物流要求', extra: data.logistics },
          { label: '包装要求', extra: data.packRequire },
          { label: '其他要求', extra: data.otherRequire },
        ],
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
                      // href={`/api/support/file/download?fileName=${item.name}&fileUrl=${item.url}`}
                      // target="_blank"
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
    await getTradePlatformInquiryListDetails({ id }).then((res: any) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      data.externalLogStates = data.externalInquiryListStateResponses ? [...data.externalInquiryListStateResponses] : []
      data.externalLogs = data.externalInquiryListLogResponses ? [...data.externalInquiryListLogResponses] : []
      setDataSource(data)
      handleBasicEffect(data)
      handleConditionEffect(data)
      handleFileEffect(data)
    })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  const jumpCommodityDetail = async (record: any) => {
    try {
      if (dataSource?.shopId) {
        const params: any = {
          type: 1,
        }
        const infoRes = await getCommodityShopListShopByReq(params)
        if (infoRes.code === 1000 && infoRes.data.length > 0) {
          const shopInfo = infoRes.data.find((item) => item.id === dataSource?.shopId)
          const defaultMall =
            infoRes.data.find((item) => item.environment === 1 && item.isDefault && !item.isSelf) ||
            infoRes.data.filter((item) => item.environment === 1 && !item.isSelf)[0]
          const defaultOwnMall =
            infoRes.data.find((item) => item.environment === 1 && item.isDefault && item.isSelf) ||
            infoRes.data.filter((item) => item.environment === 1 && item.isSelf)[0]
          if (shopInfo) {
            const url =
              shopInfo.environment === 1 ? shopInfo.url : shopInfo.isSelf ? defaultOwnMall?.url : defaultMall?.url
            const mallLink = getMallLink(url, shopInfo.isSelf ? dataSource?.memberId : undefined)
            let commodityUrl = ``
            if (!shopInfo.isSelf) {
              // 根据会员id和角色id获取店铺id
              const { data: storeInfo } = await getCommodityMobileStoreMobileFindByMemberIdAndRoleId({
                memberId: dataSource?.memberId,
                roleId: dataSource?.memberRoleId,
              } as any)
              commodityUrl = `/shop/${storeInfo.id}/inquiry/detail/${record.commodityId}`
            } else {
              commodityUrl = `/inquiry/detail/${record.commodityId}`
            }
            window.open(mallLink + commodityUrl)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columns: ColumnType<any>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
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
            onClick={() => jumpCommodityDetail(data)}
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
  ]

  return (
    <Context.Provider value={dataSource}>
      <PageHeaderWrapper subTitle={dataSource?.inquiryListNo} title={dataSource?.details} isAnchor items={TABLINK}>
        <Space direction="vertical" style={{ display: 'flex' }} size={16}>
          <ProgressLayout />
          <BasicLayout effect={basicEffect} />
          <ListLayout
            id={id}
            anchor="inquiryProductLayout"
            title="询价商品"
            columns={columns}
            done
            data={dataSource?.inquiryListProductRequests || []}
            // fetch={getTradeEnquiryProductList}
          />
          <GeneralLayout anchor="conditionLayout" title="交易条件" effect={conditionEffect} />
          <GeneralLayout anchor="fileLayout" title="附件" effect={fileEffect} />
          <RecordLyout />
        </Space>
      </PageHeaderWrapper>
    </Context.Provider>
  )
}

export default ProductInquiryDetail
