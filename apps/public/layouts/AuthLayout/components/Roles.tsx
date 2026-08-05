import React, { useState, useEffect } from 'react'
import { Dropdown, Space, Menu, message } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { getAuth, getCookieAuth, setAuth, setRouters } from '@/utils/auth'
import { postMemberLoginSwitchrole } from '@linkseeks/apis'
import { useIntl } from '@linkseeks/i18n'
import defaultHomePath from '@/utils/defaultHomePath'
import { clearRecentVisit } from '@/utils/recentVisit'
import { history } from '@linkseeks/router-manager'
interface MemberRole {
  memberRoleId: number
  memberRoleName: string
  roleType: number
}

const Roles: React.FC = () => {
  const intl = useIntl()
  const [curRole, setCurRole] = useState<MemberRole>(null)
  const [roles, setRoles] = useState<MemberRole[]>([])

  useEffect(() => {
    const userInfo: any = getAuth() || {}
    const cookieUserInfo: any = getCookieAuth() || {}
    // console.log(userInfo, 10086)
    setRoles(userInfo.roles || [])

    if (userInfo.roles && userInfo.roles.length) {
      const current = userInfo.roles.find((item) => item.memberRoleId === cookieUserInfo.memberRoleId)
      setCurRole(current)
    }
  }, [])

  const handleSelect = (item: MemberRole) => {
    console.log(item)
    const { memberRoleId } = item
    if (memberRoleId === curRole.memberRoleId) {
      return
    }

    const msg = message.loading({
      content: intl.formatMessage({ id: 'common.zhengzaiqiehuanjuese' }),
      duration: 0,
    })

    postMemberLoginSwitchrole({
      memberRoleId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        console.log(res.data, 'schemaMode: info?.schemaMode, =>?>>> schemaMode: info?.schemaMode,')
        setAuth(res.data)
        clearRecentVisit()
        setTimeout(() => {
          history.goHome()
        }, 800)
      })
      .finally(() => {
        msg()
      })
  }

  const menuHeaderDropdown = (
    <Menu selectedKeys={curRole ? [`${curRole.memberRoleId}`] : []}>
      {roles.map((item) => (
        <Menu.Item key={item.memberRoleId} onClick={() => handleSelect(item)}>
          <Space>
            <span>{item.memberRoleName}</span>
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <Dropdown overlay={menuHeaderDropdown} placement="bottomRight">
      <Space size={5} style={{ cursor: 'pointer', padding: '0 6px', marginLeft: 10 }}>
        {curRole?.memberRoleName}
        <CaretDownOutlined />
      </Space>
    </Dropdown>
  )
}

export default Roles
