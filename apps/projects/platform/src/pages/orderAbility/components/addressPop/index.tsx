import React from 'react'
import { EnvironmentOutlined } from '@ant-design/icons'
import { Popover, Row, Space } from 'antd'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
export const AddressPop = (props) => {
  const { pickInfo = null, children } = props

  return pickInfo && pickInfo.deliverType === 2 ? (
    <Space>
      <EnvironmentOutlined style={{ marginRight: 8 }} />
      <Popover
        content={
          <Row>
            <div>
              <div>
                <EnvironmentOutlined /> {intl.formatMessage({ id: 'transaction_components.zitidizhi' })}
              </div>
              <p>
                {pickInfo.receiver || pickInfo.shipperName} / {pickInfo.phone}
              </p>
              <p>
                {pickInfo.receiver
                  ? pickInfo.address
                  : `${pickInfo.provinceName}${pickInfo.cityName}${pickInfo.districtName}${pickInfo.address}`}
              </p>
            </div>
          </Row>
        }
      >
        {children}
      </Popover>
    </Space>
  ) : (
    children
  )
}
