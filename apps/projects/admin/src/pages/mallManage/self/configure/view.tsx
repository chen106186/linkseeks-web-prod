import React, { useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Row, Col } from '@linkseeks/ui'
import { ENVIRONMENT_OPTIONS } from '../../services/constants'
import useSelfMall from '../../services/hooks/useSelfMall'
import SelfMallItem from '../../services/components/SelfMallItem'

const SelfConfigure: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(ENVIRONMENT_OPTIONS[0].key)
  const { mallList, refresh } = useSelfMall({ environment: activeKey })

  return (
    <PageHeaderWrapper backDom isTabs items={ENVIRONMENT_OPTIONS} onTabChange={(key) => setActiveKey(key)}>
      <Row gutter={16}>
        {mallList.map((item) => (
          <Col lg={24} xl={12} key={item.id}>
            <SelfMallItem mallInfo={item} onRefresh={refresh} />
          </Col>
        ))}
      </Row>
    </PageHeaderWrapper>
  )
}

export default SelfConfigure
