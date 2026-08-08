import React, { ReactNode, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card } from 'antd'
import { ImageBox, PageHeaderWrapper, RecordColumns, StandardFormTable } from '@apps/components'
import { formatTimeString } from '@/utils'
import { EyeAuthButton } from '@apps/components'
import { getProductBrandGetUnCheckBrandList } from '@apps/apis'
import { DetailAuthButton } from '@apps/components'

/**
 * 待审核品牌列表
 * @returns
 */
const CheckBrand: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const intl = useIntl()

  const fetchData = (params: any) => {
    const searchParams = {
      ...params,
    }
    const postData = {
      ...searchParams,
      name: searchParams?.name || '',
      status: 2,
    }
    return new Promise((resolve, reject) => {
      getProductBrandGetUnCheckBrandList(postData).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }
  const columns: RecordColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'trademark.addBrand.card.2.logoUrl', defaultMessage: '品牌LOGO' }),
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 100,
      render: (logoUrl) => <ImageBox width={48} height={48} src={logoUrl} preview />,
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      searchField: {
        main: true,
        type: 'Input',
      },
      className: 'commonPickColor',
      render: (text, record) => (
        <EyeAuthButton url={`/commodityAbility/trademark/trademarkWillCheck/detail?id=${record.id}&preview=1`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.memberName' }),
      dataIndex: 'memberName',
      key: 'memberName',
      searchField: 'Input',
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.applyTime' }),
      dataIndex: 'applyTime',
      key: 'applyTime',
      render: (text) => text && formatTimeString(text),
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.applyTime - b.applyTime,
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.status' }),
      dataIndex: 'status',
      key: 'status',
      searchField: {
        type: 'Select',
        valueEnum: [
          { label: intl.formatMessage({ id: 'trademark.schema.status.1', defaultMessage: '全部' }), value: 0 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.2', defaultMessage: '待提交审核' }), value: 1 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.3', defaultMessage: '待审核' }), value: 2 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.4', defaultMessage: '审核不通过' }), value: 3 },
          { label: intl.formatMessage({ id: 'trademark.schema.status.5', defaultMessage: '审核通过' }), value: 4 },
        ],
      },
      render: (text, record) => {
        let component: ReactNode = null
        if (record.status === 1)
          component = (
            <>
              <span className="commonStatusInvalid"></span>
              {intl.formatMessage({ id: 'trademark.schema.status.2' })}
            </>
          )
        else if (record.status === 2)
          component = (
            <>
              <span className="commonStatusModify"></span>
              {intl.formatMessage({ id: 'trademark.schema.status.3' })}
            </>
          )
        else if (record.status === 3)
          component = (
            <>
              <span className="commonStatusStop"></span>
              {intl.formatMessage({ id: 'trademark.schema.status.4' })}
            </>
          )
        else if (record.status === 4)
          component = (
            <>
              <span className="commonStatusValid"></span>
              {intl.formatMessage({ id: 'trademark.schema.status.5' })}
            </>
          )
        return component
      },
    },
    {
      title: intl.formatMessage({ id: 'trademark.columns.option' }),
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record) => (
        <DetailAuthButton>
          <Button
            type="link"
            onClick={() => history.push(`/commodityAbility/trademark/trademarkWillCheck/detail?id=${record.id}`)}
          >
            {intl.formatMessage({ id: 'trademark.columns.check' })}
          </Button>
        </DetailAuthButton>
      ),
    },
  ]

  return (
    <PageHeaderWrapper>
      <Card>
        <StandardFormTable columns={columns} actionRef={ref} request={(params: any) => fetchData(params)} autoScrollX />
      </Card>
    </PageHeaderWrapper>
  )
}

export default CheckBrand
