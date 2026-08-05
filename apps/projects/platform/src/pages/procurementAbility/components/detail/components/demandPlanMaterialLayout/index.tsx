import React, { useRef } from 'react'
import StandardTable from '@/components/StandardTable'
import { Space, Typography } from 'antd'
import Card from '../../../card'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { ColumnType } from 'antd/lib/table/interface'
import { formatTimeString } from '@/utils'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
export interface IPROPS {
  id?: number
  fetch?: () => Promise<unknown>
  /** 标题 */
  layoutTitle?: string
  /** 需要展示的column */
  column?: string
}

const DemandPlanMaterialLayout: React.FC<IPROPS> = (props: any) => {
  const { id, fetch, layoutTitle, column } = props
  const currentRef = useRef({})

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space size={0}>
          <Typography.Text>{text}</Typography.Text>
          <Typography.Text>/{record.name}</Typography.Text>
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }),
      key: 'goodsGroup',
      dataIndex: 'goodsGroup',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
      key: 'category',
      dataIndex: 'category',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.brand' }),
      key: 'brand',
      dataIndex: 'brand',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.unitName' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.needCount' }),
      key: 'needCount',
      dataIndex: 'needCount',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.costPrice' }),
      key: 'costPrice',
      dataIndex: 'costPrice',
      render: (text: any) => (
        <>
          {text
            ? `${intl.formatMessage({ id: 'common.money' })}${text.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.needPrice' }),
      key: 'needPrice',
      dataIndex: 'needPrice',
      render: (text: any) => (
        <>
          {text
            ? `${intl.formatMessage({ id: 'common.money' })}${text.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.arriveTime' }),
      key: 'arriveTime',
      dataIndex: 'arriveTime',
      render: (text: any) => <Typography.Text>{formatTimeString(text, 'YYYY-MM-DD')}</Typography.Text>,
    },
  ]

  const productlist = (params: any) => {
    return new Promise((resolve) => {
      fetch({ id, ...params })
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }

  return (
    <Card id="materialLayout" title={layoutTitle}>
      <StandardTable
        currentRef={currentRef}
        columns={columns}
        tableProps={{ rowKey: 'id' }}
        fetchTableData={(params: any) => productlist(params)}
      />
    </Card>
  )
}

DemandPlanMaterialLayout.defaultProps = {
  layoutTitle: intl.formatMessage({ id: 'detail.purchase.materialLayout1' }),
}

export default DemandPlanMaterialLayout
