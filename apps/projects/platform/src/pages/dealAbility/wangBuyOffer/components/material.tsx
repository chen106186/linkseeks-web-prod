import React from 'react'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import { Button, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { downloadFileByNameAndUrl } from '@apps/utils'
import { useWebIntl } from '@apps/locales'

const intl = getIntl()
interface materialProps {
  askPurchaseGoodsResponses: any
}

const Material: React.FC<materialProps> = (props: any) => {
  const { askPurchaseGoodsResponses } = props
  const translate = useWebIntl()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      key: 'goodsNo',
      dataIndex: 'goodsNo',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaomingcheng',
        defaultMessage: '物料名称',
      }),
      key: 'goodsName',
      dataIndex: 'goodsName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.guigexinghao',
        defaultMessage: '规格型号',
      }),
      key: 'specification',
      dataIndex: 'specification',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei', defaultMessage: '品类' }),
      key: 'categoryName',
      dataIndex: 'categoryName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai', defaultMessage: '品牌' }),
      key: 'brandName',
      dataIndex: 'brandName',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei', defaultMessage: '单位' }),
      key: 'unit',
      dataIndex: 'unit',
    },
    {
      title: translate('web.resource.deal.xunyuanshuliang'),
      key: 'num',
      dataIndex: 'num',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.fujian', defaultMessage: '附件' }),
      key: 'enclosureUrls',
      dataIndex: 'enclosureUrls',
      render: (text: any, redor: any) => (
        <div>
          {text.map((item) => {
            return (
              <Button type="link" onClick={() => downloadFileByNameAndUrl(item.url, item.name)}>
                {item.name}
              </Button>
            )
          })}
        </div>
      ),
    },
  ]

  return (
    <Card id="material" title={translate('web.resource.deal.xunyuanwuliao')}>
      <Table columns={columns} dataSource={askPurchaseGoodsResponses} />
    </Card>
  )
}

export default Material
