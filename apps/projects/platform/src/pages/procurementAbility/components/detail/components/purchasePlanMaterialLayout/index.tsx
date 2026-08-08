import React, { useRef, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import { Space, Typography, Button } from 'antd'
import Card from '../../../card'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import { ColumnType } from 'antd/lib/table/interface'
import DrawerLayout from './drawer'
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
const PurchasePlanMaterialLayout: React.FC<IPROPS> = (props: any) => {
  const { id, fetch, layoutTitle, column } = props
  const currentRef = useRef({})
  const [visible, setVisible] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any>([])

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.type' }),
      key: 'number',
      dataIndex: 'number',
      render: (text: any, record: any) => (
        <Space direction="vertical" size={0}>
          <EyeAuthButton class type="button">
            {text}
          </EyeAuthButton>
          <Typography.Text>{record.name}</Typography.Text>
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
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount2' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
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
      title: intl.formatMessage({ id: 'detail.purchase.purchasePrice' }),
      key: 'purchasePrice',
      dataIndex: 'purchasePrice',
      render: (text: any) => (
        <>
          {text
            ? `${intl.formatMessage({ id: 'common.money' })}${text.toFixed(2)}`
            : `${intl.formatMessage({ id: 'common.money' })}0`}
        </>
      ),
    },
    {
      title: intl.formatMessage({ id: 'table.purchase.operate' }),
      key: 'operate',
      dataIndex: 'operate',
      render: (_t: any, record: any) => (
        <Button type="link" onClick={() => handleClick(record)}>
          {intl.formatMessage({ id: 'table.purchase.see' })}
          {intl.formatMessage({ id: 'detail.purchase.modalTitle26' })}
        </Button>
      ),
    },
  ]

  const handleClick = (data: any) => {
    setDataSource(data.purchaseNeedPlanDetailList)
    setVisible(true)
  }

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
      <DrawerLayout dataSource={dataSource} visible={visible} onClose={() => setVisible(false)} />
    </Card>
  )
}

PurchasePlanMaterialLayout.defaultProps = {
  layoutTitle: intl.formatMessage({ id: 'detail.purchase.materialLayout1' }),
}

export default PurchasePlanMaterialLayout
