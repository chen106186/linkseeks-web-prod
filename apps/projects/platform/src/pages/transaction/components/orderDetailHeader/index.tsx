import type { ReactNode } from 'react'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Row, Col, Skeleton } from 'antd'
import { OrderDetailContext } from '../../_public/order/context'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { ArrowLeftOutlined } from '@ant-design/icons'
import style from './index.less'
import { OrderKindType } from '@/constants/order'
const intl = getIntl()
export interface OrderDetailHeaderProps {
  extraRight?: ReactNode
  detailList?: {
    label: string
    name: string
    render?: (text, record?) => any
    [key: string]: any
  }[]
  detailData?: any
  backRole?: number
}

/**
 * 订单详情头部
 */
const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({ extraRight, detailList = [], detailData }) => {
  const isLoading = !!detailData

  const { versionContext } = useContext(OrderDetailContext)
  const [, setDataBo] = useState<any>({})
  // 单独处理请购单 对应单号文案
  if (detailData?.orderKind === OrderKindType.REQUISITION_ORDER) {
    detailList[0].label = intl.formatMessage({
      id: 'transaction_components.duiyingqinggoudanhao',
    })
  } else {
    detailList[0].label = intl.formatMessage({
      id: 'transaction_components.duiyingbaojiadanhao',
    })
  }

  useEffect(() => {
    if (versionContext) {
      setDataBo({
        version: versionContext?.version,
        orderNo: versionContext?.orderNo,
      })
    }
  }, [versionContext])

  return (
    <div className={style.detailHeader}>
      {isLoading ? (
        <Row>
          {
            <Col>
              <Row align="middle">
                <Col>
                  <ArrowLeftOutlined onClick={() => history.goBack()} />
                </Col>
                <Col className={style.titleAvator}>{intl.formatMessage({ id: 'transaction_components.dan' })}</Col>
              </Row>
            </Col>
          }

          <Col style={{ flex: 1 }}>
            <Row justify="space-between" align="middle" style={{ paddingTop: 14 }}>
              <Col style={{ flex: 1 }}>
                {!versionContext ? (
                  <Fragment>
                    <Row align="middle">
                      <Col span={6}>
                        <div className={style.titleAvatorText}>
                          {intl.formatMessage({ id: 'transaction_components.dingdanhao' })}: {detailData?.orderNo}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {detailList.map((v) => {
                        const { label, render, name, ...colProps } = v
                        return detailData && (detailData[name] || detailData[name] === 0) ? (
                          <Col key={label} {...colProps} className={style.detailCol}>
                            <span className={style.colLabel}>{label}:</span>
                            {render ? render(detailData[name], detailData) : <span>{detailData[name]}</span>}
                          </Col>
                        ) : null
                      })}
                    </Row>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Row align="middle">
                      <Col span={6}>
                        <div className={style.titleAvatorText}>
                          {intl.formatMessage({ id: 'transaction_components.dingdanhao' })}: {detailData?.orderNo}
                        </div>
                      </Col>
                      {/* <Col><EditCircleFillIcon style={{ fontSize: '16px', color: '#4888F0' }} /></Col> */}
                    </Row>
                    <Row>
                      {detailList.map((v) => {
                        const { label, render, name, ...colProps } = v
                        return detailData && (detailData[name] || detailData[name] === 0) ? (
                          <Col key={label} {...colProps} className={style.detailCol}>
                            <span className={style.colLabel}>{label}:</span>
                            {render ? render(detailData[name], detailData) : <span>{detailData[name]}</span>}
                          </Col>
                        ) : null
                      })}
                    </Row>
                  </Fragment>
                )}
              </Col>
              <Col>{extraRight}</Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Skeleton avatar={{ shape: 'square' }} active paragraph={{ rows: 3 }} />
      )}
    </div>
  )
}

OrderDetailHeader.defaultProps = {}

export default OrderDetailHeader
