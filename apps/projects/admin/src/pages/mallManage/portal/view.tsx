import React from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Col, Row } from '@linkseeks/ui'
import { SHOP_TYPE_ENUM } from '@apps/constants'
import DoorItem from '../services/components/PortalItem'
import usePortalList from '../services/hooks/usePortalList'

const Door: React.FC = () => {
  const { portalList, refresh } = usePortalList()

  const mainPortal = portalList.find((item) => item.type === SHOP_TYPE_ENUM.MAIN_PORTAL)

  return (
    <PageHeaderWrapper>
      <Row gutter={16}>
        {mainPortal && (
          <Col span={24}>
            <DoorItem mallInfo={mainPortal} onRefresh={refresh} />
          </Col>
        )}
        {portalList.map(
          (item) =>
            item.type !== SHOP_TYPE_ENUM.MAIN_PORTAL && (
              <Col lg={24} xl={12} key={item.id}>
                <DoorItem mallInfo={item} onRefresh={refresh} />
              </Col>
            ),
        )}
      </Row>
    </PageHeaderWrapper>
  )
}

export default Door
