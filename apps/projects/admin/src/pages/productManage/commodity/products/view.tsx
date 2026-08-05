import type { ReactNode } from 'react'
import React, { useRef } from 'react'
import { ImageBox, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import useSelectOptions from '../services/hooks/useSelectOptions'
import { getProductCommodityPlatformGetPlatformCommodityList } from '@apps/apis'

const Products: React.FC = () => {
  const ref = useRef({} as ActionType)
  const selectData = useSelectOptions()

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 80,
      searchField: {
        type: 'Input',
        name: 'commodityId',
      },
    },
    {
      title: '商品图',
      dataIndex: 'mainPic',
      key: 'mainPic',
      width: 100,
      fixed: 'left',
      render: (logoUrl) => <ImageBox width={48} height={48} src={logoUrl} preview />,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      className: 'commonPickColor',
      searchField: {
        main: true,
      },
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/productManage/commodity/products/detail?id=${record.id}`}>{text}</EyeAuthButton>
      ),
    },
    {
      title: '商家名称',
      dataIndex: 'memberName',
      key: 'memberName',
      searchField: 'Input',
    },
    {
      title: '会员品类',

      dataIndex: 'customerCategoryFullName',
      key: 'customerCategoryFullName',
    },
    {
      title: '平台品类',
      dataIndex: 'categoryFullName',
      key: 'categoryFullName',
      searchField: {
        type: 'Cascader',
        name: 'categoryId',
      },
    },
    {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      searchField: {
        type: 'SearchSelect',
        name: 'brandId',
      },
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: '产品定价',
      dataIndex: 'priceType',
      key: 'priceType',
      render: (text: any) => {
        if (text === 1) return '现货价格'
        else if (text === 2) return '价格需要询价'
        else if (text === 3) return '积分兑换商品'
        else if (text === 4) return '赠品'
      },
    },
    {
      title: '价格',
      dataIndex: 'min',
      key: 'min',
      searchField: {
        type: 'NumberRanage',
        name: ['min', 'max'],
        placeholder: ['最低价', '最高价'],
      },
      render: (text: any, reocrd: any) => {
        if (reocrd.priceType === 1) {
          if (reocrd.max === reocrd.min) return <>￥{reocrd.min}</>
          else
            return (
              <>
                ￥{reocrd.min} ~ ￥{reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 3) {
          if (reocrd.max === reocrd.min) return <>{reocrd.min}</>
          else
            return (
              <>
                {reocrd.min} ~ {reocrd.max}
              </>
            )
        }
        if (reocrd.priceType === 2) return null
      },
    },
    {
      title: '申请审核时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (text: any) => text && formatTimeString(text),
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.applyTime - b.applyTime,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      searchField: {
        title: '商品状态',
        type: 'Select',
        valueEnum: [
          {
            label: '待审核',
            value: 2,
          },
          {
            label: '审核不通过',
            value: 3,
          },
          {
            label: '审核通过',
            value: 4,
          },
          {
            label: '上架',
            value: 5,
          },
          {
            label: '下架',
            value: 6,
          },
          {
            label: '已归档',
            value: 8,
          },
        ],
      },
      render: (text: any, record: any) => {
        let component: ReactNode = null
        if (record.status === 1)
          component = (
            <>
              <span className="commonStatusStop" />
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
              <span className="commonStatusInvalid" />
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
        else if (record.status === 5)
          component = (
            <span
              style={{
                color: '#00A98F',
                padding: '2px 5px',
                background: 'rgba(235,247,242,1)',
                borderRadius: '4px',
              }}
            >
              已上架
            </span>
          )
        else if (record.status === 6)
          component = (
            <span style={{ padding: '2px 5px', background: 'rgba(244,245,247,1)', borderRadius: '4px' }}>已下架</span>
          )
        else if (record.status === 8)
          component = (
            <>
              <span className="commonStatusStop" />
              已归档
            </>
          )
        return component
      },
    },
  ]

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getProductCommodityPlatformGetPlatformCommodityList(params).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </PageHeaderWrapper>
  )
}

export default Products
