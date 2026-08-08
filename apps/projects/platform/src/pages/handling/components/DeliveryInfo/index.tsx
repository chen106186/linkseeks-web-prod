import MellowCard from '@/components/MellowCard'
import React, { useEffect, useMemo, useState } from 'react'
import { GetEnhanceSupplierAllDetailsResponse } from '@apps/apis'
import { statisticsColumns as orderColumns, productColumns, infoOrderColumns, infoProductColumns } from './columns'
import ButtonSwitch from '@/components/ButtonSwitch'
import { Table, Button, Tabs } from 'antd'
import CustomizeColumn from '@/components/CustomizeColumn'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import moment from 'moment'
const intl = getIntl()
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

const format = 'YYYY-MM-DD HH:mm:ss'

/**
 * isConfirm_deliverStatus_receiveStatus_receiptStatus
 */
const INNER_STATUS_TEXT = {
  '1_1_1': intl.formatMessage({ id: 'handling.daiquerenfahuo' }),
  '2_1_1': intl.formatMessage({ id: 'handling.yiquerenfahuo' }),
  '2_2_1': intl.formatMessage({ id: 'handling.daiquerenhuidan' }),
  '2_2_2': intl.formatMessage({ id: 'handling.yiquerenhuidan' }),
}

const ACTION_TEXT = {
  '1_1_1': intl.formatMessage({ id: 'handling.querenfahuo' }),
  '2_1_1': intl.formatMessage({ id: 'handling.querenshouhuo' }),
  '2_2_1': intl.formatMessage({ id: 'handling.querenhuidan' }),
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
      label: intl.formatMessage({ id: 'handling.shoufahuotongji' }),
      value: 'statistics',
    },
    {
      label: intl.formatMessage({ id: 'handling.shoufahuomingxi' }),
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
        title: intl.formatMessage({ id: 'handling.fahuodanhao' }),
        value: (
          <Link to={`/commodityAbility/stockSellStorage/bills/detail?id=${activeData?.deliveryId}`}>
            {activeData?.deliveryNo}
          </Link>
        ),
      },
      {
        title: intl.formatMessage({ id: 'handling.wuliudanhao' }),
        value: (
          <Link
            to={`/logisticsAbility/logisticsBillSubmit/logisticsBillQuery/preview?id=${activeData?.logisticsOrderId}`}
          >
            {activeData?.logisticsOrderNo}
          </Link>
        ),
      },
      {
        title: intl.formatMessage({ id: 'handling.rukudanhao' }),
        value: (
          <Link to={`/commodityAbility/stockSellStorage/bills/detail?id=${activeData?.storageId}`}>
            {activeData?.storageNo}
          </Link>
        ),
      },
      {
        title: intl.formatMessage({ id: 'handling.neibuzhuangtai' }),
        value: (
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <span>{INNER_STATUS_TEXT[currentInnerStatus] || ''}</span>
            {(mode && ACTION_TEXT[currentInnerStatus] && activeData?.[`${mode}Status`] === 1 && (
              <a
                onClick={() =>
                  handleOnSubmit(currentInnerStatus as '1_1_1', {
                    produceNoticeOrderId: activeData.produceNoticeOrderId,
                    pnoReceiveDeliverDetailId: activeData.id,
                  })
                }
              >
                {ACTION_TEXT[currentInnerStatus]}
              </a>
            )) ||
              null}
          </div>
        ),
      },
      {
        title: intl.formatMessage({ id: 'handling.fahuoshijian' }),
        value: activeData?.deliveryTime && moment(activeData?.deliveryTime).format(format),
      },
      {
        title: intl.formatMessage({ id: 'handling.wuliugongsi' }),
        value: activeData?.logisticsCompany,
      },
      {
        title: intl.formatMessage({ id: 'handling.rukushijian' }),
        value: activeData?.storageTime && moment(activeData?.storageTime).format(format),
      },
    ]
  }, [infoDataSource, activeBatch, mode])

  const handleTabOnChange = (value: string) => {
    setActiveBatch(+value)
  }

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'handling.shoufahuotongji' })}
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
                <TabPane
                  tab={`${intl.formatMessage({ id: 'handling.di' })}${_item}${intl.formatMessage({
                    id: 'handling.pici',
                  })}`}
                  key={_item}
                >
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
