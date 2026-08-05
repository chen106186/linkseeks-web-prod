import React, { useMemo, useRef } from 'react'
import { Row, Col, Spin } from '@linkseeks/ui'
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'
import StatusTag from '@/components/StatusTag'
import styles from './index.less'
// 图标图片集
import orderIcon from '@/assets/home-icon-23.png'
import memberIcon from '@/assets/home-icon-12.png'
import productIcon from '@/assets/home-icon-10.png'
import brandIcon from '@/assets/home-icon-11.png'
import useViewRequest from '../../common/hooks/useViewRequest'
import {
  getOrderReportGetTodayNew,
  GetOrderReportGetTodayNewResponse,
  getMemberReportGetTodayNew,
  GetMemberReportGetTodayNewResponse,
  getProductReportGetTodayNew,
  GetProductReportGetTodayNewResponse,
  getCommodityReportGetTodayNew,
  GetCommodityReportGetTodayNewResponse,
} from '@apps/apis'
import { priceFormat } from '@/utils/numberFomat'

interface Iprops {}

const TodayAdd: React.FC<Iprops> = (props) => {
  const { responseData: orderData, ref: orderRef } = useViewRequest<GetOrderReportGetTodayNewResponse, any>(
    getOrderReportGetTodayNew,
    {},
  )

  const { responseData: memberData, ref: memberRef } = useViewRequest<GetMemberReportGetTodayNewResponse, any>(
    getMemberReportGetTodayNew,
    {},
  )

  const { responseData: productData, ref: productRef } = useViewRequest<GetProductReportGetTodayNewResponse, any>(
    getProductReportGetTodayNew,
    {},
  )

  const { responseData: commodityData, ref: commodityRef } = useViewRequest<GetCommodityReportGetTodayNewResponse, any>(
    getCommodityReportGetTodayNew,
    {},
  )

  const list = useMemo(
    () => [
      {
        // TODO 这里暂时先展示订单数量
        title: '今日新增订单',
        number: orderData?.todayCount || 0,
        icon: orderIcon,
        percent: orderData?.rate || 0,
        ref: orderRef,
      },
      {
        title: '今日新增会员',
        number: memberData?.todayCount || 0,
        icon: memberIcon,
        percent: memberData?.rate || 0,
        ref: memberRef,
      },
      {
        title: '今日新增商品',
        number: productData?.todayCount || 0,
        icon: productIcon,
        percent: productData?.rate || 0,
        ref: productRef,
      },
      {
        title: '今日新增店铺',
        number: commodityData?.todayCount || 0,
        icon: brandIcon,
        percent: commodityData?.rate || 0,
        ref: commodityRef,
      },
    ],
    [orderData, memberData, productData, commodityData, orderRef, memberRef, productRef, commodityRef],
  )

  return (
    <Spin spinning={false}>
      <Row gutter={[12, 12]}>
        {list.map((item, key) => {
          return (
            <Col xxl={6} xl={6} lg={12} md={12} sm={24} xs={24} key={key} ref={item.ref}>
              <div className={styles.homeCard}>
                <div className={styles.body}>
                  <div className={styles.content}>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles.number}>{item.number}</div>
                  </div>
                  <div className={styles.icon}>
                    <img src={item.icon} alt="" />
                  </div>
                </div>
                <div className={styles.footer}>
                  <StatusTag
                    title={
                      <span>
                        {item.percent >= 0 ? <CaretUpOutlined /> : <CaretDownOutlined />} {item.percent} %
                      </span>
                    }
                    type={item.percent >= 0 ? 'success' : 'danger'}
                  />
                  <span>&nbsp;&nbsp;相比昨日</span>
                </div>
              </div>
            </Col>
          )
        })}
      </Row>
    </Spin>
  )
}

export default TodayAdd
