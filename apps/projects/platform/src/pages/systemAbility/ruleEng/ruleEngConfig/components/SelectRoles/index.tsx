import React, { useState, memo, useRef } from 'react'
import { Button, Col, Row } from 'antd'
import FetchSelect from '@/components/FetchSelect'
import { HandleType } from '@/components/CommonDrawer'
import SeeUserDrawer from '../SeeUserDrawer'
import { useIntl } from '@linkseeks/i18n'

const SelectRoles = (props: any) => {
  const intl = useIntl()
  const { onChange, onValueChange, ...rest } = props

  const roleIdRef = useRef<any>(rest?.value)
  const drawRef = useRef<HandleType>()

  const _onChange = (id) => {
    roleIdRef.current = id
    onChange?.(id)
    onValueChange?.(id)
  }

  return (
    <>
      <Row gutter={16}>
        <Col style={{ flex: 1 }}>
          <FetchSelect style={{ width: '100%' }} onChange={_onChange} {...rest} />
        </Col>
        <Col>
          <Button
            style={{ marginRight: 0 }}
            onClick={() => {
              drawRef?.current?.show(true, { roleId: roleIdRef.current })
            }}
          >
            {intl.formatMessage({ id: 'processRuleSetting.userList', defaultMessage: '用户列表' })}
          </Button>
        </Col>
      </Row>
      <SeeUserDrawer ref={drawRef} />
    </>
  )
}

export default memo(SelectRoles)
