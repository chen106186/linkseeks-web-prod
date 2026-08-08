import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Card from '@/components/DetailLayout/components/card'

import { getIntl } from '@linkseeks/i18n'
import { Button, Table } from 'antd'
import { INTERNALSTATE_COLOR } from '../../list/schema/wangBuyScema'
import { format } from 'util'
import EyePreview from '@/components/EyePreview'
import { ColumnType } from 'antd/lib/table'
import { downloadFileByNameAndUrl } from '@apps/utils/src/download'
const intl = getIntl()
interface materialTableProps {}

const MaterialTable: React.FC<any> = (props: any) => {
  const { tableMessage = [] } = props
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
      title: intl.formatMessage({
        id: 'transaction_components.qiugoushuliang',
        defaultMessage: '求购数量',
      }),
      key: 'num',
      dataIndex: 'num',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.fujian', defaultMessage: '附件' }),
      key: 'enclosureUrls',
      dataIndex: 'enclosureUrls',
      render: (text: any) => (
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
    <Card
      id="materialTable"
      title={intl.formatMessage({
        id: 'transaction_components.qiugouwuliao',
        defaultMessage: '求购物料',
      })}
    >
      <Table columns={columns} dataSource={tableMessage} />
    </Card>
  )
}

export default MaterialTable
