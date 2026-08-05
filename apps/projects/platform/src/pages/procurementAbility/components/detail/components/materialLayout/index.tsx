import React, { useRef, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import Card from '../../../card'
import { EyeAuthButton } from '@apps/components'
import { DetailAuthButton } from '@apps/components'
import DetailDrawer from '../../../detailDrawer'
import { ColumnType } from 'antd/lib/table/interface'
import { getIntl } from '@linkseeks/i18n'

export interface IPROPS {
  id?: number
  number?: number
  column?: ColumnType<any>[]
  fetch?: () => Promise<unknown>
  layoutTitle?: string
}

const intl = getIntl()

const MaterialLayout: React.FC<IPROPS> = (props: any) => {
  const { id, number, fetch, layoutTitle, column } = props
  const [visible, setVisible] = useState<boolean>(false)
  const currentRef = useRef({})
  const [dataSource, setDataSource] = useState<any>([])

  const handleClick = (item: any) => {
    setDataSource([
      {
        linkTitle: intl.formatMessage({ id: 'detail.purchase.basicLayout' }),
        linkContent: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.materialCode' }),
            content: item.number,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.materialName' }),
            content: item.name,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }),
            content: item?.goodsGroup ?? item?.materialGroup,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.nameCode' }),
            content: item.model,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.customerCategory' }),
            content: item.category,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.brand' }),
            content: item.brand,
          },
        ],
      },
      {
        linkTitle: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }),
        linkContent: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.unitName' }),
            content: item.unit,
          },
          {
            label: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }),
            content: item.purchaseCount,
          },
        ],
      },
      {
        linkTitle: intl.formatMessage({ id: 'detail.purchase.file' }),
        linkContent: [
          {
            label: intl.formatMessage({ id: 'detail.purchase.file' }),
            file: item.urls ? true : false,
            content: item.urls,
          },
        ],
      },
    ])
    setVisible(true)
  }

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialCode' }),
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.materialName' }),
      key: 'name',
      dataIndex: 'name',
      render: (text: any, record: any) => (
        <EyeAuthButton type="button" handleClick={() => handleClick(record)}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({ id: 'detail.purchase.goodsGroup' }),
      key: 'materialGroup',
      dataIndex: 'materialGroup',
      render: (text: any, record: any) => {
        return text ? text : record?.goodsGroup
      },
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
      title: intl.formatMessage({ id: 'detail.purchase.purchaseCount' }),
      key: 'purchaseCount',
      dataIndex: 'purchaseCount',
    },
  ]

  const productlist = (params: any) => {
    return new Promise((resolve) => {
      fetch({ id, number, ...params })
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
        keepAlive={false}
        currentRef={currentRef}
        columns={column ? column : columns}
        tableProps={{ rowKey: 'id' }}
        fetchTableData={(params: any) => productlist(params)}
      />
      <DetailDrawer
        title={intl.formatMessage({ id: 'detail.purchase.modalTitle25' })}
        visible={visible}
        dataSource={dataSource}
        onCalcel={() => setVisible(false)}
      />
    </Card>
  )
}

MaterialLayout.defaultProps = {
  layoutTitle: intl.formatMessage({ id: 'detail.purchase.materialLayout' }),
}

export default MaterialLayout
