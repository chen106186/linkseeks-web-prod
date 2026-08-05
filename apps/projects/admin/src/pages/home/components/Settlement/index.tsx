import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col } from 'antd'
import styles from './index.less'
import cx from 'classnames'
import { RightOutlined } from '@ant-design/icons'

// 收付款图标
import feeIcon1 from '@/assets/home-icon-15.png'
import feeIcon2 from '@/assets/home-icon-16.png'
import feeIcon3 from '@/assets/home-icon-17.png'
import feeIcon4 from '@/assets/home-icon-18.png'
import feeIcon5 from '@/assets/home-icon-19.png'
import feeIcon6 from '@/assets/home-icon-20.png'
import { Link } from '@linkseeks/router-core'
// import {
//   getReportPlatformHomeGetAccountAndSettleAccountTally,
//   GetReportPlatformHomeGetAccountAndSettleAccountTallyResponse,
// } from '@apps/apis'
import useViewRequest from '../../common/hooks/useViewRequest'

// TODO 替换接口
const Settlement: React.FC = () => {
  const { loading, responseData, ref } = useViewRequest<any, any>(() => {}, {})

  const list = useMemo(() => {
    return [
      {
        title: '待付款代收账款结算',
        icon: feeIcon1,
        count: responseData?.toBePay?.count,
        link: `/settlementManage/platformSettlement/accountPayable?status=2`,
      },
      {
        title: '已完成代收账款结算',
        icon: feeIcon2,
        count: responseData?.complete?.count,
        link: `/settlementManage/platformSettlement/accountPayable?status=4`,
      },
    ]
  }, [responseData])

  const otherList = useMemo(() => {
    return {
      group1: [
        {
          title: '待审核提现申请',
          count: responseData?.tobeValifyCashout?.count,
          icon: feeIcon3,
          link: `/settlementManage/capitalAccount/checkWithdraw`,
          name: responseData?.tobeValifyCashout?.name,
        },
        {
          title: '待支付提现申请',
          icon: feeIcon4,
          count: responseData?.tobePayCashout.count,
          link: `/settlementManage/capitalAccount/paymentWithdraw`,
          name: responseData?.tobePayCashout?.name,
        },
      ],
      group2: [
        {
          title: '待付款积分结算',
          count: responseData?.scoreToBePay?.count,
          icon: feeIcon5,
          link: `/settlementManage/platformSettlement/score?status=2`,
          name: responseData?.scoreToBePay?.name,
        },
        {
          title: '已完成积分结算',
          icon: feeIcon6,
          count: responseData?.scoreComplete.count,
          link: `/settlementManage/platformSettlement/score?status=4`,
          name: responseData?.scoreComplete?.name,
        },
      ],
    }
  }, [responseData])

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 9, marginBottom: 0 }} ref={ref}>
      {list.map((_row, index) => {
        const boxCx = cx(styles.notePaperBox, {
          [styles.notePaperBoxGreen]: index === 1,
        })
        return (
          <Col xxl={5} xl={5} lg={12} md={12} sm={24} xs={24} style={{ paddingBottom: 0 }} key={index}>
            <div className={boxCx}>
              <div className={styles.notePaperContainer}>
                <div className={styles.noteHeader}>
                  <img src={_row.icon} alt="" />
                  <span className={styles.text}>{_row.title}</span>
                </div>
                <div className={styles.noteGap}></div>
                <div className={styles.noteBody}>
                  <span className={styles.value}>{_row.count}</span>
                  {(_row.link && (
                    <Link to={_row.link}>
                      查看 <RightOutlined />
                    </Link>
                  )) || (
                    <div>
                      查看 <RightOutlined />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        )
      })}
      {Object.keys(otherList).map((_row: keyof typeof otherList | (string & {})) => {
        return (
          <Col xxl={7} xl={7} lg={12} md={12} sm={24} xs={24} style={{ paddingBottom: 0 }} key={_row}>
            <Row>
              {otherList[_row].map(
                (_item: { icon: any; count: number; title: string; link: string; name: string }, index: number) => {
                  return (
                    <Col span={24} style={{ padding: 0, marginTop: index === 1 ? '12px' : 0 }} key={index}>
                      <div className={cx(styles.lineDesc, styles.feeCustomCard)}>
                        <div className={styles.info}>
                          <img src={_item.icon} />
                          <div className={styles.lineDescText}>
                            <p className={styles.lineDescTitle}>{_item?.count}</p>
                            <p className={styles.lineDescTip}>{_item?.title}</p>
                          </div>
                        </div>
                        {(_item.link && (
                          <Link to={_item.link}>
                            查看 <RightOutlined />
                          </Link>
                        )) || (
                          <div>
                            查看 <RightOutlined />
                          </div>
                        )}
                      </div>
                    </Col>
                  )
                },
              )}
            </Row>
          </Col>
        )
      })}
    </Row>
  )
}

export default Settlement
