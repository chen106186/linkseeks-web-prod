/* 这个是付款计划组建  */
import React, { useState } from 'react'
import { Row } from 'antd'
import style from '../index.less'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import moment from 'moment'
import cx from 'classnames'
import { isEqual } from 'lodash'
import { Card } from '@linkseeks/ui'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()

export interface Iprops {
  /* 付款计划数组 */
  IsShow?: boolean
  payPlanList: any
  basics: any
  contractId: any
  children?: React.ReactNode
  title?: string
  payItem?: React.ReactNode
  setkey?: Function
  oldPayPlanList?: any
}

const PaymentCard: React.FC<Iprops> = ({
  IsShow,
  payPlanList,
  basics,
  contractId,
  children,
  title,
  payItem,
  setkey,
  oldPayPlanList,
}) => {
  const [isNew, setIsNew] = useState<boolean>(true)

  /* 非手工单进入请款 */
  const like = (sourceType, item) => {
    sessionStorage.setItem('basics', JSON.stringify(basics))
    history.push(
      '/contract/funds/addbill/Add?applyId=' + contractId + '&sourceType=' + sourceType + '&paymentId=' + item.id,
    )
  }
  const key = (item) => {
    setkey(item)
  }

  const handleBtnChange = (data: boolean) => {
    setIsNew(data)
  }

  const data = isNew ? payPlanList : oldPayPlanList

  /**当合同变更时 新旧付款计划需要去掉id相关 再对比是否一致 */
  const handlePayPlanList = (list) => {
    const newList = list?.length
      ? list.map((i) => {
          const res = {
            ...i,
            id: 0,
          }
          return res
        })
      : []
    return newList
  }

  return (
    <Card
      id="conditions"
      title={title ? title : intl.formatMessage({ id: 'contract.fukuanjihua' })}
      extra={
        oldPayPlanList && !isEqual(handlePayPlanList(payPlanList), handlePayPlanList(oldPayPlanList)) ? (
          <div className={style.changeBtn}>
            <div className={cx(style.btn, !isNew ? style.active : '')} onClick={() => handleBtnChange(false)}>
              {translate('web.resource.member.biangengqian')}
            </div>
            <div className={cx(style.btn, isNew ? style.active : '')} onClick={() => handleBtnChange(true)}>
              {translate('web.resource.member.biangenghou')}
            </div>
          </div>
        ) : null
      }
    >
      <Row gutter={[8, 8]}>
        <div className={style.warp}>
          {data?.length
            ? data.map((item: any, index: number) => {
                return (
                  <div className={style.warp_item} key={index}>
                    <div className={style.title}>{intl.formatMessage({ id: 'contract.fukuanbili' })}</div>
                    <div className={style.proportion}>{item.payRatio ? item.payRatio : item.paidRatio}%</div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div className={style.Price}>
                        {intl.formatMessage({ id: 'common.money' })}
                        {item.payAmount}
                      </div>
                      {children ? (
                        <div onClick={() => key(item)}> {children} </div>
                      ) : (
                        IsShow && (
                          <div
                            onClick={() => like(1, item)}
                            style={{
                              cursor: 'pointer',
                              fontSize: 12,
                              backgroundColor: '#00A98F',
                              color: '#fff',
                              padding: '4px 8px',
                            }}
                          >
                            {intl.formatMessage({ id: 'contract.qingkuan' })}
                          </div>
                        )
                      )}
                    </div>
                    <div className={style.warp_List}>
                      <div className={style.warp_ListItem}>
                        <div className={style.label}>{intl.formatMessage({ id: 'contract.fukuanjieduan' })}</div>
                        <div className={style.text}>{item.payStage}</div>
                      </div>
                      <div className={style.warp_ListItem}>
                        <div className={style.label}>{intl.formatMessage({ id: 'contract.yujifukuanshijian' })}：</div>
                        <div className={style.text}>
                          {item.expectPayTime ? item.expectPayTime : moment(item.payTime).format('YYYY-MM-DD')}
                        </div>
                      </div>
                      <div className={style.warp_ListItem}>
                        <div className={style.label}>{intl.formatMessage({ id: 'contract.fukuanfangshi' })}：</div>
                        <div className={style.text}>{item.payWayName}</div>
                      </div>
                      {payItem ? payItem : null}
                    </div>
                  </div>
                )
              })
            : null}
        </div>
      </Row>
    </Card>
  )
}
PaymentCard.defaultProps = {
  IsShow: false,
  payPlanList: [],
  basics: {},
  contractId: 0,
  children: null,
  payItem: null,
}

export default PaymentCard
