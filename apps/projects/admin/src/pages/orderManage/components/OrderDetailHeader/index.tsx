import React, { ReactNode } from 'react'
import { Row, Col } from 'antd'
import { history } from '@linkseeks/router-manager'
import { ArrowLeftOutlined } from '@ant-design/icons'
import style from './index.less'

export interface OrderDetailHeaderProps {
  headerTitle: {
    // 图标显示的文字
    titleLabel: string
    titleValue: ReactNode
    picName?: string
  } | null
  extraRight?: ReactNode
  detailList?: { label: string; name: string; render?(text, record?); [key: string]: any }[]
  detailData?: any
}

/**
 * 订单详情头部
 */
const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({
  headerTitle,
  extraRight,
  detailList = [],
  detailData = {},
}) => {
  return (
    <div className={style.detailHeader}>
      <Row>
        {headerTitle && (
          <Col>
            <Row align="middle">
              <Col>
                <ArrowLeftOutlined onClick={() => history.goBack()} />
              </Col>
              <Col className={style.titleAvator}>{headerTitle.picName}</Col>
            </Row>
          </Col>
        )}

        <Col style={{ flex: 1 }}>
          <Row justify="space-between" align="middle" style={{ paddingTop: 14 }}>
            <Col style={{ flex: 1 }}>
              <div className={style.titleAvatorText}>
                {headerTitle?.titleLabel}
                {headerTitle?.titleValue}
              </div>
              <Row>
                {detailList.map((v) => {
                  const { label, render, name, ...colProps } = v
                  return detailData[name] ? (
                    <Col key={label} {...colProps} className={style.detailCol}>
                      <span className={style.colLabel}>{label}:</span>
                      {render ? render(detailData[name], detailData) : <span>{detailData[name]}</span>}
                    </Col>
                  ) : null
                })}
              </Row>
            </Col>
            <Col>{extraRight}</Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

OrderDetailHeader.defaultProps = {}

export default OrderDetailHeader
