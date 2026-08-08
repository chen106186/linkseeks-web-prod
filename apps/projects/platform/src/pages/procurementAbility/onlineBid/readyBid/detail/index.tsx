import React, { useEffect, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Row, Col, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { observer, useLocalStore } from 'mobx-react'
import CustomerServiceList from '@apps/components/src/web/CustomerServiceList'
import { getPurchaseOnlineBiddingBiddingDetails } from '@apps/apis'
import { priceFormat } from '@/utils/numberFomat'
import { formatTimeString } from '@/utils'
import { toChatRoom } from '@/utils/im'
import { store } from '@/store'
import StatusBox from '../../../purchaseBid/readyBid/manage/components/statusBox'
import QuotationDeskLayout from '../../../components/detail/components/quotationDeskLayout'
import BidDetailLayout from '../../../components/detail/components/bidDetailLayout'
import IMBtn from '../../../components/detail/components/iMBtn'
import { useQuery, useLocation } from '@linkseeks/router-core'
import HistoryItem from './history'

const intl = getIntl()

import styles from './index.less'
import { useGlobal } from '@apps/container'
import { useToggle } from '@linkseeks/hooks'

const Detail = () => {
  const { purchaseBiddingMessageSupplier } = useGlobal()

  const { id, number, onlineId } = useQuery()
  const { pathname } = useLocation()
  const [visible, toggle] = useToggle()
  const [dataSource, setDataSource] = useState<any>({})
  const [chartsList, setChartsList] = useState<any>([])

  useEffect(() => {
    const _data = purchaseBiddingMessageSupplier?.data
    if (purchaseBiddingMessageSupplier && !isEmpty(dataSource) && _data.id == onlineId) {
      const _obj = {
        ranking: _data.ranking,
        minLowPrice: _data.minPrice,
        quotationDesks: _data.awardProcesss,
      }
      fetchDataSource(_obj)
    }
  }, [purchaseBiddingMessageSupplier])

  const fetchDataSource = async (socketObj?: any) => {
    const params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }
    await getPurchaseOnlineBiddingBiddingDetails({ ...params }).then((res) => {
      if (res.code !== 1000) {
        message.warning(res.message)
        history.goBack()
        return
      }
      const { data } = res
      let _flag = false
      if (socketObj) {
        _flag = true
        data.ranking = socketObj.ranking
        data.minLowPrice = socketObj.minLowPrice
      }
      let _data: any = { ...data }
      _data?.offerLogs?.forEach((item, index, arr) => {
        const _arrLength = arr.length
        if (index != _arrLength - 1 && _arrLength > 2) {
          _data.offerLogs[index].offerRatio = Number(
            (((item.offerPrice - arr[index + 1].offerPrice) / arr[index + 1].offerPrice) * 100).toFixed(2),
          )
        }
      })
      setDataSource(_data)
      let _list: any[] = []
      let _offerList: any[] = []
      let _minList: any[] = []
      let _quotationDesks = data?.quotationDesks ? [...data.quotationDesks].reverse() : []
      if (_flag) {
        _quotationDesks = socketObj.quotationDesks
      }
      _quotationDesks.forEach((item: any) => {
        _offerList.push({
          type: 'offer',
          time: formatTimeString(item.offerTime || item.peportTime, 'HH:mm:ss'),
          value: item.price || item.sumPice,
        })
      })
      _list.push({ title: intl.formatMessage({ id: 'detail.purchase.quotedAmount' }), type: 'offer', list: _offerList })
      if (data.isOpenPurchase) {
        _quotationDesks.forEach((item: any) => {
          _minList.push({
            type: 'min',
            time: formatTimeString(item.offerTime || item.peportTime, 'HH:mm:ss'),
            value: item.minPrice,
          })
        })
        _list.push({ title: intl.formatMessage({ id: 'detail.purchase.minPrice1' }), type: 'min', list: _minList })
      }
      setChartsList(_list)
    })
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  return (
    <div className={styles.warp}>
      <div className={styles.header}>
        <ArrowLeftOutlined className={styles.goBack} onClick={() => history.goBack()} />
        <div className={styles.title}>
          {dataSource?.details}
          <span>{dataSource?.createMemberName}</span>
          <IMBtn func={() => toggle(true)} />
          <CustomerServiceList visible={visible} onClose={toggle} memberId={dataSource.createMemberId} />
        </div>
      </div>
      <div className={styles.layout}>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <HistoryItem detail={dataSource} />
          </Col>
          <Col span={12}>
            <QuotationDeskLayout chartsList={chartsList} />
          </Col>
          <Col span={6}>
            <StatusBox detail={dataSource} hasBidBtn={true} refresh={() => fetchDataSource()} />
          </Col>
        </Row>
        <Row>
          <BidDetailLayout detail={dataSource} btnType={2} />
        </Row>
      </div>
    </div>
  )
}

export default observer(Detail)
