import { useCallback, useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Dropdown, Badge, List, Avatar, Form } from '@linkseeks/ui'
import { BellIcon, ArrowDownFillIcon } from '@linkseeks/icons'
import { authLocalStorage } from '@linkseeks/storage'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { SOCKET_URL } from '@/constants'
import { encryptedByAES } from '@linkseeks/crypto'
import { postMemberManageSecurityPswUpdate, getSupportPlatformPage } from '@apps/apis'
import { formatTimeString } from '@/utils'
import defaultAvatar from '@/assets/default_avatar.png'
import msgSystem from '@/assets/msg_system.png'
import msgPlatform from '@/assets/msg_platform.png'
import { usePageStatus } from '@/hooks/usePageStatus'
import PwdModal from './components/PwdModal'
import style from './index.less'
import useAuth from '@apps/services/auth/useAuth'
import { authService } from '@apps/services'

type SocketData = {
  action: 'msg_no_read_message'
  data: string
  receiver: string
  sender: string
  timestamp: number
}

const RightContent: React.FC = () => {
  const { getAuth } = useAuth()
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [messageData, setMessageData] = useState<any[]>([])
  const [unreadMsg, setUnReadMsg] = useState<number>(0)
  const [msgLoading, setMsgLoading] = useState(true)
  const [editPwdVisible, setEditPwdVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const { updatePwd } = usePageStatus()
  const initClick = useRef<boolean>(false)

  const authInfo = getAuth()

  useEffect(() => {
    if (updatePwd) {
      setEditPwdVisible(true)
    }
  }, [])

  useEffect(() => {
    if (visible) {
      setMsgLoading(true)
      getSupportPlatformPage({ current: '1', pageSize: '4' }).then((data) => {
        if (data.code === 1000) {
          setMsgLoading(false)
          setMessageData(data.data.data)
        }
      })
    }
  }, [visible])

  const handleChangePwd = useCallback((value: any) => {
    console.log('value', value)
    setConfirmLoading(true)
    const param: any = {
      email: value.email ? encryptedByAES(value?.email) : null,
      phone: value.phone ? encryptedByAES(value?.phone) : null,
      emailSmsCode: value.emailSmsCode ? encryptedByAES(value?.emailSmsCode) : null,
      phoneSmsCode: value.phoneSmsCode ? encryptedByAES(value?.phoneSmsCode) : null,
      newPassword: value.newPwd ? encryptedByAES(value.newPwd) : null,
      oldPassword: value.oldPwd ? encryptedByAES(value.oldPwd) : null,
    }

    postMemberManageSecurityPswUpdate(param, { penetrateError: true }).then((res) => {
      if (res.code === 1000) {
        setEditPwdVisible(false)
        form.resetFields()
      }
      setConfirmLoading(false)
    })
  }, [])

  const handleCancel = useCallback(() => {
    setEditPwdVisible(false)
  }, [])

  /**
   * 退出登录
   */
  const handleLogOut = async () => {
    await authService.logOut()
    authService.removeAuth()
    authService.removeAuthRouteCache()
    history.goLogin()
  }

  const items = [
    {
      label: <div onClick={() => setEditPwdVisible(true)}>修改密码</div>,
      key: 'modifypwd',
    },
    {
      label: <div onClick={handleLogOut}>退出登录</div>,
      key: 'logout',
    },
  ]

  const ws = useRef<WebSocket | null>(null)

  const webSocketInit = useCallback(() => {
    if (SOCKET_URL && (!ws.current || ws.current.readyState === 3) && authInfo) {
      const url = `${SOCKET_URL}/support/websocket?accessToken=${encodeURIComponent(authInfo.accessToken)}`
      ws.current = new WebSocket(url)
      ws.current.onopen = (e) => {
        console.log(e)
      }
      ws.current.onmessage = (e) => {
        const data: SocketData = JSON.parse(e.data)
        if (data.action === 'msg_no_read_message') {
          setUnReadMsg(+data.data)
        }
      }
      ws.current.onclose = () => {
        console.log('关闭连接')
      }
      ws.current.onerror = () => {
        console.log('socket 出错')
      }
    }
  }, [ws])

  useLayoutEffect(() => {
    webSocketInit()
    return () => {
      ws.current?.close()
    }
  }, [ws, webSocketInit])

  const handleDocumentClick = (event) => {
    if (dropdownOpen) {
      const dropdownNode = document.querySelector('.ant-dropdown')
      if (dropdownNode && !dropdownNode.contains(event.target)) {
        if (!initClick.current) {
          initClick.current = true
          return
        }
        setDropdownOpen(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [dropdownOpen])

  return (
    <div className={style.wrap}>
      <Dropdown
        className={style.messageDropdown}
        trigger={['click']}
        open={dropdownOpen}
        dropdownRender={() => (
          <div className={style.noticeBox}>
            <div className={style.header}>消息列表</div>
            <List
              itemLayout="horizontal"
              loading={msgLoading}
              dataSource={messageData}
              footer={
                <Link className={style.messageFooter} to="/systemManage/message" onClick={() => setDropdownOpen(false)}>
                  {'查看更多 ->'}
                </Link>
              }
              renderItem={(item: any) => {
                return (
                  <List.Item>
                    <div className={style.msgContainer}>
                      <div className={style.msgItemIcon}>
                        <Avatar src={item.type == 1 ? msgSystem : msgPlatform} />
                      </div>
                      <div>
                        <div className={style.msgTitle}>{item.title}</div>
                        <div className={style.msgTime}>{formatTimeString(item.sendTime)}</div>
                      </div>
                    </div>
                  </List.Item>
                )
              }}
            />
          </div>
        )}
      >
        <span className={style.topMessage} onClick={() => setDropdownOpen(true)}>
          <Badge count={unreadMsg} size={'small'}>
            <BellIcon size={20} className={style.bellIcon} onClick={() => setVisible(!visible)} />
          </Badge>
        </span>
      </Dropdown>
      <Dropdown menu={{ items }}>
        <div className={style.avatarWrap}>
          <img src={authInfo?.logo || defaultAvatar} className={style['avatar']} />
          <div className={style['username']}>
            <span>{authInfo?.userName}</span>
            <ArrowDownFillIcon size={16} />
          </div>
        </div>
      </Dropdown>
      <PwdModal
        form={form}
        visible={editPwdVisible}
        onCancel={handleCancel}
        onOk={handleChangePwd}
        confirmLoading={confirmLoading}
      />
    </div>
  )
}

export default RightContent
