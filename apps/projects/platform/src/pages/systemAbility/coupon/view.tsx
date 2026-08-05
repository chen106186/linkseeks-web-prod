/**
 * @Description 优惠券
 */
import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Tabs, Row, Col, Spin } from 'antd'
import {
  getMarketingWebCouponDetailCount,
  getMarketingWebCouponDetailPage,
  GetMarketingWebCouponDetailCountResponse,
  GetMarketingWebCouponDetailPageResponse,
  getCommodityShopListShopByReq,
  GetCommodityShopListShopByReqResponse,
} from '@apps/apis'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { COUPON_STATE_UNUSED, COUPON_STATE_USED, COUPON_STATE_EXPIRED } from './utils'
import MellowCard from '@/components/MellowCard'
import CouponCard from './components/CouponCard'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const { TabPane } = Tabs
const intl = getIntl()
const MyCoupon: React.FC = () => {
  const [activeKey, setActiveKey] = useState(`${COUPON_STATE_UNUSED}`)
  const [mallList, setMallList] = useState<GetCommodityShopListShopByReqResponse>([])

  const basicParams = {
    environment: `1`,
    memberId: undefined, // 这里传入 memberId 反倒查不出数据，只能跟app、小程序一致不传了
    roleId: undefined, // 这里传入 roleId 反倒查不出数据，只能跟app、小程序一致不传了
    current: `1`,
    pageSize: `99999`,
  }

  const fetchMallData = async () => {
    const { code, data } = await getCommodityShopListShopByReq(
      {
        type: '1',
        environment: '1',
      } as any,
      { ctlType: 'none' },
    )
    if (code === 1000) {
      setMallList(data)
    }
    return []
  }

  useEffect(() => {
    fetchMallData()
  }, [])

  const { data: analysis } = useHttpRequest<GetMarketingWebCouponDetailCountResponse>(
    () =>
      getMarketingWebCouponDetailCount({
        environment: `1`,
        shopId: undefined,
        memberId: undefined, // 这里传入 memberId 反倒查不出数据，只能跟app、小程序一致不传了
        roleId: undefined, // 这里传入 roleId 反倒查不出数据，只能跟app、小程序一致不传了
      }) as any,
    { manual: false },
  )
  const {
    data: couponList,
    run: fetchCouponList,
    loading,
  } = useHttpRequest<GetMarketingWebCouponDetailPageResponse>(
    (
      params = {
        status: `${COUPON_STATE_UNUSED}`,
        ...basicParams,
      },
    ) => getMarketingWebCouponDetailPage(params) as any,
    {
      manual: false,
    },
  )

  const handleTabsChange = (activeKey: string) => {
    setActiveKey(activeKey)
    fetchCouponList({
      status: activeKey,
      ...basicParams,
    })
  }

  return (
    <PageHeaderWrapper>
      <MellowCard
        bodyStyle={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <div className={styles.myCoupon}>
          <Tabs activeKey={activeKey} onChange={handleTabsChange}>
            <TabPane
              tab={`${intl.formatMessage({ id: 'coupon.weishiyong', defaultMessage: '未使用' })} (${
                analysis?.receiveCount || 0
              })`}
              key={`${COUPON_STATE_UNUSED}`}
            />
            <TabPane
              tab={`${intl.formatMessage({ id: 'coupon.yishiyong', defaultMessage: '已使用' })} (${
                analysis?.userCount || 0
              })`}
              key={`${COUPON_STATE_USED}`}
            />
            <TabPane
              tab={`${intl.formatMessage({ id: 'coupon.yiguoqi', defaultMessage: '已过期' })} (${
                analysis?.expireCount || 0
              })`}
              key={`${COUPON_STATE_EXPIRED}`}
            />
          </Tabs>
        </div>
      </MellowCard>
      <div className={styles['myCoupon-list']}>
        {!loading ? (
          <Row gutter={[16, 16]}>
            {couponList?.data?.map((item) => (
              <Col span={12} key={item.id}>
                <CouponCard mallList={mallList} data={item} status={+activeKey} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className={styles['myCoupon-loading']}>
            <Spin />
          </div>
        )}
      </div>
    </PageHeaderWrapper>
  )
}

export default MyCoupon
