import React, { useEffect, useState } from 'react'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import { observer, useLocalStore } from 'mobx-react'

import {
  postPurchaseBiddingManageBidding,
  getPurchaseBiddingDynamicBidding,
  getPurchaseBiddingRankingBidding,
  getPurchaseBiddingSignupMember,
  getPurchaseBiddingBiddingMateriel,
} from '@apps/apis'
import { formatTimeString } from '@/utils'
import { priceFormat } from '@/utils/numberFomat'

import QuotationDeskLayout from '../../../components/detail/components/quotationDeskLayout'
import BidDetailLayout from '../../../components/detail/components/bidDetailLayout'

import RankItem from './components/rank'
import StatusBox from './components/statusBox'

import styles from './index.less'
import { store } from '@/store'
import { useQuery, useLocation } from '@linkseeks/router-core'
import { useGlobal } from '@apps/container'
const intl = getIntl()

const Management = () => {
  const { id, number } = useQuery()
  const { pathname } = useLocation()
  const [dataSource, setDataSource] = useState<any>({})
  const [dynamic, setDynamic] = useState<any>({})
  const [queryPriceDynamics, setQueryPriceDynamics] = useState<any>([])
  const [signupMembers, setSignupMembers] = useState<any>([])
  const [awardProcess, setAwardProcess] = useState<any>([])
  const [lowestList, setLowestList] = useState<any>({})

  const { purchaseBiddingMessage } = useGlobal()

  useEffect(() => {
    const _data = purchaseBiddingMessage?.data
    if (purchaseBiddingMessage && !isEmpty(dataSource) && _data.id == id) {
      let _dynamic = { ...dynamic }
      _dynamic.count = _data.count
      _dynamic.id = _data.id
      _dynamic.memberName = _data.memberName
      _dynamic.minPrice = _data.minPrice
      setDynamic(_dynamic)
      setQueryPriceDynamics(_data.queryPriceDynamics)
      setSignupMembers(_data.sginUpInfos)
      setAwardProcess(_data.awardProcesss)
      setLowestList({
        type: 'min',
        title: intl.formatMessage({ id: 'detail.purchase.minPrice1' }),
        list: _data.awardProcesss
          ? _data.awardProcesss
              .map((item) => {
                return { type: 'min', time: formatTimeString(item.peportTime, 'HH:mm:ss'), value: item.sumPice }
              })
              .reverse()
          : [],
      })
    }
  }, [purchaseBiddingMessage])

  const fetchDataSource = async () => {
    const params = {
      id,
      number,
      current: 1,
      pageSize: 1,
    }

    const _params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }

    postPurchaseBiddingManageBidding({ ...params }, { ctlType: 'none' }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      setDataSource(data)
    })
    getPurchaseBiddingDynamicBidding({ ..._params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      setDynamic(data)
    })
    getPurchaseBiddingRankingBidding({ ..._params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      setQueryPriceDynamics(data)
    })
    getPurchaseBiddingSignupMember({ ..._params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      setSignupMembers(data)
    })
    getPurchaseBiddingBiddingMateriel({ ..._params }).then((res) => {
      if (res.code !== 1000) {
        history.goBack()
        return
      }
      const { data } = res
      setAwardProcess(data)
      setLowestList({
        type: 'min',
        title: intl.formatMessage({ id: 'detail.purchase.minPrice1' }),
        list: data
          ? data
              .map((item) => {
                return { type: 'min', time: formatTimeString(item.peportTime, 'HH:mm:ss'), value: item.sumPice }
              })
              .reverse()
          : [],
      })
    })
  }

  const rankItemOnChange = (key: string) => {
    const _params = {
      id,
      number,
      current: '1',
      pageSize: '1',
    }
    if (key === '1') {
      getPurchaseBiddingRankingBidding({ ..._params }).then((res) => {
        if (res.code !== 1000) {
          history.goBack()
          return
        }
        const { data } = res
        setQueryPriceDynamics(data)
      })
    } else {
      getPurchaseBiddingSignupMember({ ..._params }).then((res) => {
        if (res.code !== 1000) {
          history.goBack()
          return
        }
        const { data } = res
        setSignupMembers(data)
      })
    }
  }

  useEffect(() => {
    fetchDataSource()
  }, [])

  return (
    <div className={styles.warp}>
      <div className={styles.header}>
        <ArrowLeftOutlined className={styles.goBack} onClick={() => history.goBack()} />
        <div className={styles.title}>{dataSource?.details}</div>
      </div>
      <div className={styles.layout}>
        <Row gutter={[8, 8]}>
          <Col span={6}>
            <RankItem onTabChange={rankItemOnChange} detail={{ dynamic, queryPriceDynamics, signupMembers }} />
          </Col>
          <Col span={18}>
            <Row gutter={[8, 8]} style={{ marginBottom: '8px' }}>
              <Col span={16}>
                <QuotationDeskLayout chartsList={[lowestList]} />
              </Col>
              <Col span={8}>
                <StatusBox detail={dataSource} />
              </Col>
            </Row>
            <Row>
              <BidDetailLayout detail={{ awardProcess: awardProcess }} />
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default observer(Management)
