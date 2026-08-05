import React, { Fragment, ReactNode } from 'react'
import { Row, Col, Typography, Divider, Tooltip } from 'antd'
import { formatTimeString } from '@/utils'
import style from './index.less'
import { PRICECONTRAST_TYPE } from '../../../../../constants'

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

const RowLayout: React.FC<IProps> = (props: any) => {
  const { rowSource, encrypt, priceContrast, pagination } = props

  console.log(priceContrast, 123)

  return (
    <Fragment>
      <div className={style.divider}>
        <div>
          <Divider type="vertical" className={style.vertical} />
          供应商信息
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
                    <p className={style['card-bold']}>¥{item.sumPrice && item.sumPrice.toFixed(2)}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>联系人:</p>
                  </Col>
                  <Col>
                    <p>{item.contacts}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>联系电话:</p>
                  </Col>
                  <Col>
                    <p>{item.tel}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>报价单号:</p>
                  </Col>
                  <Col>
                    <p>{item.quotedPriceNo}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>报价单摘要:</p>
                  </Col>
                  <Col>
                    <p>{item.quotedDetails}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-list']}>
                <Row>
                  <Col span={8}>
                    <p className={style['card-list_title']}>交易时间:</p>
                  </Col>
                  <Col>
                    <p>{formatTimeString(item.createTime)}</p>
                  </Col>
                </Row>
              </div>
              <div className={style['card-badge']}>
                {item.isDecrypt === PRICECONTRAST_TYPE.UNENCRYPTED
                  ? priceContrast === 1
                    ? '已解密'
                    : '未加密'
                  : '未解密'}
              </div>
              {item.isDecrypt === PRICECONTRAST_TYPE.UNENCRYPTED && (
                <Typography.Link
                  href={`/purchaseManage/demandVouch/demandBidMgt/quote?id=${item.id}&number=${item.quotedPriceNo}&turn=${item.turn}`}
                  className={style['card-link']}
                >
                  查看报价详情
                </Typography.Link>
              )}
              {item.isDecrypt === PRICECONTRAST_TYPE.UNDECRYPTED && (
                <Tooltip placement="topLeft" title="当前报价为密封报价，请先解密报价单">
                  <Typography.Text className={style['card-link']} type="success">
                    查看报价详情
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
