import MellowCard from '@/components/MellowCard'
import React, { useEffect, useMemo, useState } from 'react'
import { statisticsColumns as orderColumns, productColumns, infoOrderColumns, infoProductColumns } from './columns'
import ButtonSwitch from '@/components/ButtonSwitch'
import { Table, Tabs } from 'antd'
import CustomizeColumn from '@/components/CustomizeColumn'
import { formatTimeString } from '@/utils'
import { GetEnhanceSupplierAllDetailsResponse } from '@apps/apis'

const TabPane = Tabs.TabPane

type infoDataSourceType = GetEnhanceSupplierAllDetailsResponse['pnoReceiveDeliverDetailDOList']
interface Iprops {
  /**
   * 是否是确认生产通知单。
   * 用于判断是确认发货，确认收货还是确认回单
   */
  mode?: 'deliver' | 'receive' | 'receipt'
  /**
   * 通知单来源: 1-订单加工 2-商品加工
   */
  source: 1 | 2
  /**
   * 面板
   */
  panelKey?: 'statistics' | 'info'
  /**
   * 收发货统计跟detail 一样
   */
  statisticsDataSource: GetEnhanceSupplierAllDetailsResponse['details']
  /**
   * 收发货明细
   * infoDataSource
   */
  infoDataSource: infoDataSourceType
  /**
   * 确认回单，确认发货，确认收货
   */
  onConfirm?: (
    currentInnerStatus: keyof typeof ACTION_TEXT,
    params: { produceNoticeOrderId: number; pnoReceiveDeliverDetailId: number },
  ) => void
}

/**
 * isConfirm_deliverStatus_receiveStatus_receiptStatus
 */
const INNER_STATUS_TEXT = {
  '1_1_1': '待确认发货',
  '2_1_1': '已确认发货',
  '2_2_1': '待确认回单',
  '2_2_2': '已确认回单',
}

const ACTION_TEXT = {
  '1_1_1': '确认发货',
  '2_1_1': '确认收货',
  '2_2_1': '确认回单',
}

const DeliveryInfo: React.FC<Iprops> = (props: Iprops) => {
  const { statisticsDataSource, infoDataSource, source, panelKey, mode, onConfirm } = props
  const [radioValue, setRadioValue] = useState<'statistics' | 'info'>(panelKey)
  const statisticsColumns = useMemo(() => (source === 1 ? orderColumns : productColumns), [source])
  const infoColumns = useMemo(() => (source === 1 ? infoOrderColumns : infoProductColumns), [source])
  const [activeBatch, setActiveBatch] = useState<number>(1)
  const [tabOptions, setTabOptions] = useState<number[]>([])

  useEffect(() => {
    setRadioValue(panelKey)
  }, [panelKey])

  useEffect(() => {
    const length = (infoDataSource && infoDataSource.length) || 0
    if (length === 0) {
      return
    }
    const options = new Array(length).fill(0).map((item, _key) => _key + 1)
    setTabOptions(options)
  }, [infoDataSource])

  const options = [
    {
      label: '收发货统计',
      value: 'statistics',
    },
    {
      label: '收发货明细',
      value: 'info',
    },
  ]
  const cacheOptions = useMemo(() => {
    if (!infoDataSource || infoDataSource.length === 0) {
      return options.filter((_row) => _row.value !== 'info')
    }
    return options
  }, [infoDataSource])
  const handleRadioChange = (value: 'statistics' | 'info') => {
    setRadioValue(value)
  }

  const handleOnSubmit = async (
    currentInnerStatus: keyof typeof ACTION_TEXT,
    params: { produceNoticeOrderId: number; pnoReceiveDeliverDetailId: number },
  ) => {
    onConfirm?.(currentInnerStatus, params)
  }

  const batchColumns = useMemo(() => {
    const activeData: infoDataSourceType[0] | null =
      (infoDataSource && infoDataSource.length > 0 && infoDataSource[activeBatch - 1]) || null
    const currentInnerStatus = `${activeData?.deliverStatus}_${activeData?.receiveStatus}_${activeData?.receiptStatus}`
    return [
      {
        title: '发货单号',
        value: <a>{activeData?.deliveryNo}</a>,
      },
      {
        title: '物流单号',
        value: <a>{activeData?.logisticsOrderNo}</a>,
      },
      {
        title: '入库单号',
        value: <a>{activeData?.storageNo}</a>,
      },
      {
        title: '内部状态',
        value: (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span>{INNER_STATUS_TEXT[currentInnerStatus] || ''}</span>
            {(mode &&
              ACTION_TEXT[currentInnerStatus] &&
              activeData?.[`${mode}Status`] === 1 &&
              // <a
              //   onClick={() => handleOnSubmit(currentInnerStatus as "1_1_1", {produceNoticeOrderId: activeData.produceNoticeOrderId, pnoReceiveDeliverDetailId: activeData.id })}
              // >
              //   {ACTION_TEXT[currentInnerStatus]}
              // </a>
              ACTION_TEXT[currentInnerStatus]) ||
              null}
          </div>
        ),
      },
      {
        title: '发货时间',
        value: activeData?.deliveryTime && formatTimeString(activeData?.deliveryTime),
      },
      {
        title: '物流公司',
        value: activeData?.logisticsCompany,
      },
      {
        title: '入库时间',
        value: activeData?.storageTime && formatTimeString(activeData?.storageTime),
      },
    ]
  }, [infoDataSource, activeBatch, mode])

  const handleTabOnChange = (value: string) => {
    setActiveBatch(+value)
  }

  return (
    <MellowCard
      title="收发货统计"
      extra={<ButtonSwitch options={cacheOptions} value={radioValue} onChange={handleRadioChange} />}
    >
      {radioValue === 'statistics' && (
        <Table columns={statisticsColumns} rowKey="id" dataSource={statisticsDataSource} />
      )}
      {radioValue === 'info' && infoDataSource?.length > 0 && (
        <div>
          <Tabs defaultActiveKey="1" activeKey={activeBatch.toString()} onChange={handleTabOnChange}>
            {tabOptions.map((_item) => {
              return (
                <TabPane tab={`第${_item}批次`} key={_item}>
                  <CustomizeColumn data={batchColumns} column={4} />
                  <Table
                    columns={infoColumns}
                    rowKey={(record) => `${record.produceNoticeOrderDetailId}-${record.productId}`}
                    dataSource={infoDataSource[activeBatch - 1]?.pnoReceiveDeliverDetailProductBOList}
                  ></Table>
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      )}
    </MellowCard>
  )
}

DeliveryInfo.defaultProps = {
  panelKey: 'statistics',
  mode: null,
  onConfirm: null,
}

export default DeliveryInfo
