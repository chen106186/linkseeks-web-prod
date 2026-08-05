import React, { useState, useEffect } from 'react'
import { Spin, Row, Col } from '@linkseeks/ui'
import { PageHeaderWrapper } from '@apps/components'
import { usePageStatus } from '@/hooks/usePageStatus'
import StoreShopItem from '../../services/components/storeShopItem'
import useStore from '../../services/hooks/useStore'
import { StoreShopItemType } from '../../services/types'
import StoreInfoTitle from '../../services/components/storeInfoTitle'

const ShopAdorn: React.FC = () => {
  const { id } = usePageStatus()
  const { storeDetail, getStoreShopList } = useStore({ id: Number(id) })
  const [loading, setLoading] = useState<boolean>(true)
  const [storeShopList, setStoreShopList] = useState<StoreShopItemType[]>([])

  useEffect(() => {
    setLoading(true)
    getStoreShopList(id)
      .then((data) => setStoreShopList(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageHeaderWrapper title={<StoreInfoTitle storeInfo={storeDetail} />} backDom>
      <Spin spinning={loading}>
        <Row gutter={16}>
          {storeShopList.map((item) => (
            <Col lg={24} xl={12} key={item.id}>
              <StoreShopItem itemInfo={item} storeId={id} />
            </Col>
          ))}
        </Row>
      </Spin>
    </PageHeaderWrapper>
  )
}

export default ShopAdorn
