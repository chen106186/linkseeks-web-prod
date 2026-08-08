import React, { useState, useEffect } from 'react'
import { Dropdown, Space, Menu, message } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { authService } from '@apps/services'
import { postMemberLoginSwitchrole } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import defaultHomePath from '@/utils/defaultHomePath'
import { recentVisitLocalStorage } from '@linkseeks/storage'
import { history } from '@linkseeks/router-manager'
interface MemberRole {
  roleId: number
  roleName: string
  roleType: number
}

const Roles: React.FC = () => {
  const intl = useIntl()
  const [curRole, setCurRole] = useState<MemberRole>()
  const [roles, setRoles] = useState<MemberRole[]>([])
  const userInfo: any = authService.getAuth() || {}

  useEffect(() => {
    setRoles(userInfo.roles || [])

    if (userInfo.roles && userInfo.roles.length) {
      const current = userInfo.roles.find((item) => item.roleId === userInfo.memberRoleId)
      setCurRole(current)
    }
  }, [])

  const handleSelect = (item: MemberRole) => {
    const { roleId } = item
    if (roleId === curRole?.roleId) {
      return
    }

    const msg = message.loading({
      content: intl.formatMessage({ id: 'common.zhengzaiqiehuanjuese' }),
      duration: 0,
    })

    postMemberLoginSwitchrole({
      memberRoleId: roleId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        authService.setAuth(res.data)
        recentVisitLocalStorage.removeItem()
        setTimeout(() => {
          location.replace('/')
        }, 800)
      })
      .finally(() => {
        msg()
      })
  }

  const menuHeaderDropdown = (
    <Menu selectedKeys={curRole ? [`${curRole.roleId}`] : []}>
      {roles.map((item) => (
        <Menu.Item key={item.roleId} onClick={() => handleSelect(item)}>
          <Space>
            <span>{item.roleName}</span>
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={menuHeaderDropdown} placement="bottomRight">
      <Space size={5} style={{ cursor: 'pointer', padding: '0 6px', marginLeft: 10 }}>
        {curRole?.roleName}
        <CaretDownOutlined />
      </Space>
    </Dropdown>
  )
}

export default Roles
