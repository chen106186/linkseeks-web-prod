import React, { useRef } from 'react'
import { Card } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import StandardTable from '@/components/StandardTable'
import { ColumnType } from 'antd/lib/table/interface'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { getProductPriceMaterielGetMaterielPriceHistory } from '@apps/apis'
import { formatTimeString } from '@/utils'

const DetailLibrary: React.FC<{}> = () => {
  const ref = useRef<any>({})
  const { goodsPriceId } = useQuery()
  const intl = useIntl()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.wuliaobianhao',
      }),
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.wuliaomingcheng',
      }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.guigexinghao',
      }),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.pinlei',
      }),
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.pinpai',
      }),
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.danwei',
      }),
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.mulujia',
      }),
      dataIndex: 'costPrice',
      key: 'costPrice',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.shichangjia',
      }),
      dataIndex: 'marketPrice',
      key: 'marketPrice',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.hetongdingdanjia',
      }),
      dataIndex: 'orderPrice',
      key: 'orderPrice',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.hetongdingdan',
      }),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.gongyinghuiyuanID',
      }),
      dataIndex: 'upperMemberId',
      key: 'upperMemberId',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.gongyinghuiyuanmingcheng',
      }),
      dataIndex: 'upperMemberName',
      key: 'upperMemberName',
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.jiageyouxiaocong',
      }),
      dataIndex: 'effectiveStartTime',
      key: 'effectiveStartTime',
      render: (text) => {
        if (text) {
          const t = text * Math.pow(10, 13 - text.toString().length)
          return formatTimeString(t, 'YYYY-MM-DD')
        }
      },
    },
    {
      title: intl.formatMessage({
        id: 'priceManage.schema.formProduct.jiageyouxiaodao',
      }),
      dataIndex: 'effectiveEndTime',
      key: 'effectiveEndTime',
      render: (text) => {
        if (text) {
          const t = text * Math.pow(10, 13 - text.toString().length)
          return formatTimeString(t, 'YYYY-MM-DD')
        }
      },
    },
  ]
  const fetchData = (params: any) => {
    return new Promise((resolve) => {
      getProductPriceMaterielGetMaterielPriceHistory({
        ...params,
        materielPriceId,
      }).then((res) => {
        const { data } = res
        resolve(data)
      })
    })
  }

  return (
    <PageHeaderWrapper onBack={() => history.goBack()}>
      <Card>
        <StandardTable
          columns={columns}
          currentRef={ref}
          tableProps={{ rowKey: 'id' }}
          fetchTableData={(params: any) => fetchData(params)}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default DetailLibrary
