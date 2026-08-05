import { useIntl } from '@linkseeks/i18n'
import React, { useState } from 'react'
import { Row, Col, Avatar } from 'antd'
import { Card } from '@linkseeks/ui'
import { isEmpty } from 'lodash'

const ColStyle = {
  display: 'flex',
  padding: '6px 16px',
  alignItems: 'center',
  borderRadius: '4px',
  backgroundColor: '#FAFBFC',
}
const TextStyle = {
  color: '#252D37',
  marginLeft: '10px',
}

export interface DemandLayoutIProps {
  /** 商城列表 */
  storeList?: any
  /** 标题 */
  title?: string
}

const DemandLayout: React.FC<DemandLayoutIProps> = (props: any) => {
  const { storeList } = props
  const intl = useIntl()
  return (
    <Card id="demandLayout" title={intl.formatMessage({ id: 'marketingAbility.shiyongshangcheng' })}>
      <Row gutter={[16, 16]}>
        {!isEmpty(storeList) &&
          storeList.map((item) => (
            <Col span={6} key={item.id}>
              <div style={ColStyle}>
                <Avatar size={32} src={item.logo} style={{ color: '#FFFFFF', backgroundColor: '#00A98F' }} />
                <span style={TextStyle}>{item.shopName}</span>
              </div>
            </Col>
          ))}
      </Row>
    </Card>
  )
}

export default DemandLayout
