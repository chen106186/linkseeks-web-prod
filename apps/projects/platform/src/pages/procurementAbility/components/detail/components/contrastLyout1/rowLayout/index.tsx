import React, { Fragment, ReactNode } from 'react'
import { Row, Col, Typography, Divider, Tooltip } from 'antd'
import { formatTimeString } from '@/utils'
import style from './index.less'
import { PRICECONTRAST_TYPE } from '../../../../../constants'
import { getIntl } from '@linkseeks/i18n'

export interface IProps {
  /** 信息数据 */
  rowSource?: any
  /** 是否加密 */
  encrypt?: number
  /** 比价方式 */
  priceContrast?: number
  /** 分页 */
  pagination?: ReactNode
}

const intl = getIntl()

const RowLayout: React.FC<IProps> = (props: any) => {
  const { rowSource, encrypt, priceContrast, pagination } = props

  return (
    <Fragment>
      <div className={style.divider}>
        <div>
          <Divider type="vertical" className={style.vertical} />
          {intl.formatMessage({ id: 'detail.purchase.modalTitle18' })}
        </div>
        {pagination}
      </div>
      <Row gutter={[12, 0]}>
        {rowSource.map((item: any) => (
          <Col span={6} key={item.id}>
            <div className={style.colStyle}>
              <div className={style['card-list']}>
                <Row>
                  <Col>
                    <p className={style['card-bold']}>{item.createMemberName}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col>
                    <p className={style['card-bold']}>
                      {intl.formatMessage({ id: 'common.money' })}
                      {item.sumPrice && item.sumPrice.toFixed(2)}
                    </p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'detail.purchase.contacts1' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>{item.contacts}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'detail.purchase.telNumber' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>{item.tel}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'detail.purchase.quotedPriceNo' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>{item.quotedPriceNo}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'detail.purchase.quotedDetails' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>{item.quotedDetails}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>
                      {intl.formatMessage({ id: 'detail.purchase.conditionTime' })}:
                    </p>
                  </Col>
                  <Col>
                    <p>{formatTimeString(item.createTime)}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-badge']}>
                {item.isDecrypt === PRICECONTRAST_TYPE.UNENCRYPTED
                  ? priceContrast === 1
                    ? intl.formatMessage({ id: 'detail.purchase.label39' })
                    : intl.formatMessage({ id: 'detail.purchase.label12' })
                  : intl.formatMessage({ id: 'detail.purchase.label40' })}
              </div>
              {item.isDecrypt === PRICECONTRAST_TYPE.UNENCRYPTED && (
                <Typography.Link
                  href={`/procurementAbility/confirmOffer/quote?id=${item.id}&number=${item.quotedPriceNo}&turn=${item.turn}`}
                  className={style['card-link']}
                >
                  {intl.formatMessage({ id: 'table.purchase.see' })}
                  {intl.formatMessage({ id: 'detail.purchase.label43' })}
                </Typography.Link>
              )}
              {item.isDecrypt === PRICECONTRAST_TYPE.UNDECRYPTED && (
                <Tooltip placement="topLeft" title={intl.formatMessage({ id: 'detail.purchase.message81' })}>
                  <Typography.Text className={style['card-link']} type="success">
                    {intl.formatMessage({ id: 'table.purchase.see' })}
                    {intl.formatMessage({ id: 'detail.purchase.label43' })}
                  </Typography.Text>
                </Tooltip>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </Fragment>
  )
}
export default RowLayout
