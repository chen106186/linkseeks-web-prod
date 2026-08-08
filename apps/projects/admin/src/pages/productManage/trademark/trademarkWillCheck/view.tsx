import type { ReactNode } from 'react'
import React, { useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button } from 'antd'
import { ImageBox, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { formatTimeString } from '@/utils'
import { EyeAuthButton, DetailAuthButton } from '@apps/components'
import { getProductBrandGetPlatformUnCheckBrandList } from '@apps/apis'

const Trademark: React.FC = () => {
  const ref = useRef({} as ActionType)

  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getProductBrandGetPlatformUnCheckBrandList({
        ...params,
        name: params.name || '',
        status: 2,
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
      render: (text, record) => (
        <EyeAuthButton url={`/productManage/trademark/trademarkWillCheck/detail?id=${record.id}&preview=1`}>
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
      render: (text) => text && formatTimeString(text),
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.applyTime - b.applyTime,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
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
    {
      title: '操作',
      key: 'option',
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <>
            <DetailAuthButton>
              <Button
                type="link"
                onClick={() => history.push(`/productManage/trademark/trademarkWillCheck/detail?id=${record.id}`)}
              >
                审核
              </Button>
            </DetailAuthButton>
          </>
        )
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
