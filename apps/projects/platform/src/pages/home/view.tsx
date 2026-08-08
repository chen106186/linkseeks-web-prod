import React, { useState, useEffect, useCallback } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { Card } from 'antd'
import { useWebIntl } from '@apps/locales'
// import UseGuaid from './components/UseGuaid'
import UserCenter from './components/UserCenter'
import CustomWorkBench, { LayoutType } from './components/CustomWorkBench'
import LatestAnnounce from './components/LatestAnnounces'
import RecentVisit from './components/RecentVisit'
import AnyQuestion from './components/AnyQuestion'
import AdvertisementContainer from './components/AdvertisementSpace'
import {
  FundCenter,
  ShopCenter,
  ProductCenter,
  SettlementCenter,
  AfterSoldCenter,
  LogisticsCenter,
  Contract,
  PurchaseCenter,
  OrderCenter,
  VendorCenter,
} from './components/Centers'
import styles from './index.less'
import { CompassFilled } from '@ant-design/icons'
import useGetAuth from './hooks/useGetAuth'
import { getReportMemberHomeGetDataLayout, postReportMemberHomeUpdateDataLayout } from '@apps/apis'

const ComponentSelect = {
  /** 订单中心 */
  '/orderAbility': OrderCenter,
  /** 店铺中心 */
  '/shopAbility': ShopCenter,
  /** 采购中心 */
  '/procurementAbility': PurchaseCenter,
  /** 合同中心 */
  '/contract': Contract,
  /** 商品中心 */
  '/commodityAbility': ProductCenter,
  /** 资金账户管理中心 */
  '/payandSettle': FundCenter,
  /** 结算中心 */
  '/balance': SettlementCenter,
  /** 售后中心 */
  '/afterAbility': AfterSoldCenter,
  /** 物流中心 */
  '/logisticsAbility': LogisticsCenter,
  /** 会员中心 */
  '/supplierAbility': VendorCenter,
}

const Home: React.FC<{}> = () => {
  const intl = useIntl()
  const [loading, setLoading] = useState<boolean>(false)
  const [layout, setLayout] = useState<LayoutType[]>([])
  const { getLayoutCentersName, generateLayoutData } = useGetAuth()
  const translate = useWebIntl()

  useEffect(() => {
    async function getDataLayout() {
      setLoading(true)
      try {
        const { data, code } = await getReportMemberHomeGetDataLayout()
        if (code === 1000) {
          const names = getLayoutCentersName()
          const res = generateLayoutData(names, data || [])
          setLayout(res as unknown as LayoutType[])
        }
      } finally {
        setLoading(false)
      }
    }
    getDataLayout()
  }, [])

  const handleChangeOrder = useCallback(async (list: LayoutType[]) => {
    /** 将原数据补充进去 */
    const listKeys = list
      .filter((_item) => _item.isShow)
      .map((_item) => {
        const { isShow, ...rest } = _item
        return {
          ...rest,
          isShow: isShow ? 1 : 0,
        }
      })

    const { code } = await postReportMemberHomeUpdateDataLayout(listKeys as Omit<LayoutType, 'code'>[])
    if (code === 1000) {
      setLayout(list)
    }
  }, [])

  const renderCenters = useCallback(() => {
    if (loading) {
      return <Card loading={true}></Card>
    }

    return (
      <>
        {layout.map((item) => {
          const RenderComponent = ComponentSelect[item.code]
          return (
            <div
              className={styles.ability}
              style={{ order: item.sort, display: item.isShow ? 'block' : 'none' }}
              key={item.code}
            >
              {RenderComponent && <RenderComponent />}
            </div>
          )
        })}
      </>
    )
  }, [loading, layout])

  return (
    <PageHeaderWrapper title={translate('web.resource.home.shou-ye')}>
      {/* <div className={styles.userGuaid} style={{display: visible ? 'block': 'none'}}>
        <UseGuaid/>
      </div> */}
      <div className={styles.container}>
        <div className={styles.left}>
          <UserCenter />
          <div className={styles.otherCenters}>{renderCenters()}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.actions}>
            <CustomWorkBench handleChangeOrder={handleChangeOrder} layouts={layout} />
          </div>
          <div className={styles.commonMargin}>
            <LatestAnnounce />
          </div>
          <div className={styles.commonMargin}>
            <RecentVisit />
          </div>
          <div className={styles.commonMargin}>
            <AnyQuestion />
          </div>
          <div className={styles.commonMargin}>
            <AdvertisementContainer />
          </div>
        </div>
      </div>
    </PageHeaderWrapper>
  )
}

export default Home
