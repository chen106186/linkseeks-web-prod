import type { ReactNode } from 'react'
import React, { useRef } from 'react'
import { ImageBox, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { getProductBrandGetPlatformBrandList } from '@apps/apis'

const Trademark: React.FC = () => {
  const ref = useRef({} as ActionType)

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getProductBrandGetPlatformBrandList({
        ...params,
        name: params.name || '',
        status: params.status || 0,
        memberName: params.memberName || '',
      }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  const defaultColumns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      fixed: 'left',
    },
    {
      title: '品牌LOGO',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 100,
      fixed: 'left',
      render: (logoUrl) => <ImageBox width={48} height={48} src={logoUrl} preview />,
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      key: 'name',
      className: 'commonPickColor',
      fixed: 'left',
      searchField: {
        main: true,
      },
      render: (text: any, record: any) => (
        <EyeAuthButton url={`/productManage/trademark/trademarkSearch/detail?id=${record.id}&preview=1`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: '会员名称',
      dataIndex: 'memberName',
      key: 'memberName',
      searchField: 'Input',
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
        type: 'Select',
        title: '状态',
        valueEnum: [
          { label: '全部', value: 0 },
          // { label: '待提交审核', value: 1 },
          { label: '待审核', value: 2 },
          { label: '审核不通过', value: 3 },
          { label: '审核通过', value: 4 },
        ],
      },
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
  ]

  return (
    <PageHeaderWrapper backDom={false}>
      <StandardFormTable
        columns={defaultColumns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="id"
        actionRef={ref}
      />
    </PageHeaderWrapper>
  )
}

export default Trademark
