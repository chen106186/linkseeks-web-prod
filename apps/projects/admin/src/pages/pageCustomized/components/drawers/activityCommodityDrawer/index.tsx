import React, { useEffect, useState } from 'react'
import { Button, Drawer, message, Space } from 'antd'
import { useWebIntl } from '@apps/locales'
import { StandardFormTable } from '@apps/components'
import {
  GetMarketingAdornPlatformActivityListAdornResponseDetail,
  getMarketingAdornPlatformActivityListAdorn,
} from '@apps/apis'
import moment from 'moment'
import { Table } from '@linkseeks/ui'
import { usePageStatus } from '@apps/services/hooks/usePageStatus'
import useSelectOptions from './hooks'

interface IProps {
  visible: boolean
  onCancel: () => void
  onOk?: (data: any) => void
  selectId?: number[]
}

const ActivityCommodityDrawer: React.FC<IProps> = (props) => {
  const { visible, selectId, onCancel, onOk } = props
  const translate = useWebIntl()
  const { shopId } = usePageStatus()
  const { activityTypeOptions } = useSelectOptions()
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([])
  const [selectedRows, setSelectedRows] = useState<
    GetMarketingAdornPlatformActivityListAdornResponseDetail['goodsList']
  >([])

  useEffect(() => {
    if (visible) {
      setSelectedRows([])
    }
  }, [visible])

  const handleCancel = () => {
    onCancel?.()
  }

  const handleOk = () => {
    if (selectedRows.length > 0) {
      onOk?.(selectedRows)
    } else {
      message.info(translate('web.common.selectOneRequest'))
    }
  }

  const fetchTableData = async (params: any) => {
    const payload = {
      ...params,
      shopId,
      innerStatusList: [8, 9],
    }

    const { data } = await getMarketingAdornPlatformActivityListAdorn(payload)
    setExpandedRowKeys(data?.data?.map((item) => item.id) || [])
    return data
  }

  const columns = StandardFormTable.createColumns<GetMarketingAdornPlatformActivityListAdornResponseDetail>([
    {
      title: translate('web.resource.shop.huodongid'),
      key: 'id',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.order.huodongmingchen'),
      key: 'activityName',
      searchField: 'Input',
    },
    {
      title: translate('web.resource.shop.huodongleixing'),
      key: 'activityTypeName',
      searchField: {
        type: 'Select',
        name: 'activityType',
      },
    },
    {
      title: translate('web.resource.shop.huodongzhuangtai'),
      key: 'outerStatusName',
    },
    {
      title: translate('web.resource.shop.huodongkaishishijian'),
      key: 'startTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: translate('web.resource.shop.huodongjieshushijian'),
      key: 'endTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ])

  const handleRowSelect = (keys, rows) => {
    const uniqueRows = rows.reduce(
      (acc, current) => {
        if (!acc.some((item) => item.skuId === current.skuId)) {
          acc.push(current)
        }
        return acc
      },
      [...selectedRows],
    )
    setSelectedRows(uniqueRows)
  }

  const rowSelection = {
    onChange: handleRowSelect,
    getCheckboxProps: (record) => ({
      disabled: selectId?.includes(record.skuId),
    }),
  }

  const expandedRowRender = (record: GetMarketingAdornPlatformActivityListAdornResponseDetail) => {
    return (
      <Table
        rowKey={'skuId'}
        pagination={false}
        rowSelection={rowSelection}
        columns={[
          {
            title: 'SKUID',
            dataIndex: 'skuId',
            width: 100,
          },
          {
            title: '商品名称',
            dataIndex: 'productName',
          },
          {
            title: '原价',
            dataIndex: 'price',
            width: 150,
          },
          {
            title: '活动价',
            dataIndex: 'activityPrice',
            width: 150,
            render: (text, record) => {
              return <span style={{ color: 'red' }}>{text || record.price}</span>
            },
          },
        ]}
        dataSource={record.goodsList || []}
      />
    )
  }

  return (
    <Drawer
      open={visible}
      width={950}
      title={translate('web.resource.shop.xuanzeyingxiaoshangpin')}
      onClose={handleCancel}
      destroyOnClose
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            {translate('web.common.cancel')}
          </Button>
          <Button onClick={handleOk} type="primary">
            {translate('web.common.confirm')}
          </Button>
        </div>
      }
    >
      <StandardFormTable
        columns={columns}
        request={(param) => fetchTableData(param)}
        searchSelectMaps={{
          activityType: activityTypeOptions,
        }}
        tableProps={{
          expandable: {
            expandedRowRender,
            defaultExpandedRowKeys: expandedRowKeys,
            indentSize: 0,
            defaultExpandAllRows: true,
          },
        }}
      />
    </Drawer>
  )
}

export default ActivityCommodityDrawer
