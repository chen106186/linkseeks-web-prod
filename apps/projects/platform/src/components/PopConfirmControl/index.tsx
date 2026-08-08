import { Popconfirm, PopconfirmProps } from 'antd'
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
export interface PopConfirmControlProps extends Partial<PopconfirmProps> {
  visible?: boolean
}
const PopConfirmControl: React.FC<PopConfirmControlProps> = (props) => {
  const { visible = true, children, ...restProps } = props
  const intl = useIntl()
  return (
    <Popconfirm
      title={intl.formatMessage({ id: 'components.quedingyaozhixingzhegecao' })}
      okText={intl.formatMessage({ id: 'components.shi1' })}
      cancelText={intl.formatMessage({ id: 'components.fou' })}
      {...restProps}
    >
      {children}
    </Popconfirm>
  )
}

export default PopConfirmControl
