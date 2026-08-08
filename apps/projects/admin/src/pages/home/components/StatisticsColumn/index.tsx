import React, { useMemo } from 'react'
import { Row, Col, Card, Space, Skeleton } from 'antd'
import styles from './index.less'
import { RightOutlined } from '@ant-design/icons'

import totalIcona3 from '@/assets/home-icon-10.png'
import totalCommdity from '@/assets/home-icon-13.png'
import totalBrand1 from '@/assets/home-icon-21.png'
import totalBrand2 from '@/assets/home-icon-22.png'
import { Link } from '@linkseeks/router-core'
import useViewRequest from '../../common/hooks/useViewRequest'
import { getProductReportGetPlatformCommodity, GetProductReportGetPlatformCommodityResponse } from '@apps/apis'

// TODO 替换接口
const StatisticsColumn = (props) => {
  const { loading, responseData, ref } = useViewRequest<GetProductReportGetPlatformCommodityResponse, any>(
    getProductReportGetPlatformCommodity,
    {},
  )
  const list = useMemo(() => {
    return [
      {
        title: '商品统计',
        alias: '全部商品',
        key: 'product',
        totalCount: responseData?.productCount,
        children: [
          {
            count: responseData?.commodityManagementList[0].count || 0,
            name: responseData?.commodityManagementList[0].name,
            link: responseData?.commodityManagementList[0]?.link || null,
            icon: totalIcona3,
          },
          {
            count: responseData?.commodityManagementList[1]?.count || 0,
            name: responseData?.commodityManagementList[1]?.name,
            link: responseData?.commodityManagementList[1]?.link || null,
            icon: totalCommdity,
          },
        ],
      },
      {
        title: '品牌统计',
        alias: '全部品牌',
        key: 'brand',
        totalCount: responseData?.brandCount,
        children: [
          {
            count: responseData?.brandManagementList[0].count || 0,
            name: responseData?.brandManagementList[0].name,
            link: responseData?.brandManagementList[0]?.link || null,
            icon: totalBrand1,
          },
          {
            count: responseData?.brandManagementList[1]?.count || 0,
            name: responseData?.brandManagementList[1]?.name,
            link: responseData?.brandManagementList[1]?.link || null,
            icon: totalBrand2,
          },
        ],
      },
    ]
  }, [responseData])

  // const { loading, data } = props;
  return (
    <Row gutter={[24, 12]} ref={ref}>
      {list.map((_item) => {
        return (
          <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24} key={_item.key}>
            <Card loading={loading} headStyle={{ borderBottom: 'none' }} title={_item.title} bordered={false}>
              {/* <div className={styles.commodityTotalTitle}>
                <span>{_item.alias}</span>
                <p>{_item.totalCount}</p>
              </div> */}
              <Row gutter={[24, 12]}>
                {_item.children.map((_row, number) => {
                  return (
                    <Col
                      key={_item.key + number}
                      xxl={12}
                      xl={12}
                      lg={24}
                      md={12}
                      sm={24}
                      xs={24}
                      className={styles.commodityTotalDesc}
                    >
                      <div className={styles.container}>
                        <div className={styles.left}>
                          <img src={_row.icon} />
                          <div className={styles.lineDescText}>
                            <p className={styles.lineDescTitle}>{_row.count}</p>
                            <p className={styles.lineDescTip}>{_row.name}</p>
                          </div>
                        </div>
                        {(_row.link && (
                          <Link to={_row.link}>
                            查看&nbsp;
                            <RightOutlined />
                          </Link>
                        )) || <a>查看</a>}
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default StatisticsColumn
