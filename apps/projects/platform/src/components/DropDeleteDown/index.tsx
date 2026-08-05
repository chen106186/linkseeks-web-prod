import React, { ReactElement } from 'react'
import { Dropdown, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
export interface DropDeleteDownProps {
  children: ReactElement
}

const DropDeleteDown: React.FC<DropDeleteDownProps> = (props) => {
  const intl = useIntl()
  return (
    <Dropdown overlay={props.children} trigger={['click']}>
      <Button>
        {intl.formatMessage({ id: 'components.gengduo' })} <DownOutlined />
      </Button>
    </Dropdown>
  )
}

DropDeleteDown.defaultProps = {}

export default DropDeleteDown
