import React, { useEffect, useState } from 'react'
import { message, Modal, Radio } from 'antd'
import { MouseEvent } from 'react'
import { useAuth } from '@apps/services'
import {
  getMemberUserRegisterTencentIm,
  getMemberAbilityInfoGetPlatformImUsers,
  getMemberAbilityInfoGetHasImAuthUsers,
} from '@apps/apis'
const CustomerServiceList = (props: { visible: any; onClose: any; memberId?: any; isAdmin?: boolean }) => {
  const { visible, onClose, memberId, isAdmin } = props
  const [list, setList] = useState<any[]>([])
  const [userId, setUserId] = useState()
  const toImChat = (e: MouseEvent<HTMLButtonElement, MouseEvent>, userId: undefined) => {
    e.stopPropagation()
    navigateServices(userId)
  }

  const getToCustomerUrl = async (userId: any) => {
    const { getAuth } = useAuth()
    const { accessToken } = getAuth() || {}
    if (!accessToken) {
      return false
    }
    //   // 腾讯客服
    const userID = `TIM-${userId}`
    const conversationID = `C2C${userID}`
    return {
      url: process.env.IM_URL,
      payload: `t=${accessToken}${conversationID ? '&conversationID=' + conversationID : ''}&source=1`,
    }
  }

  const navigateServices = async (userId: any) => {
    let url: any
    let payload: any
    const { code, data, message: msg } = await getMemberUserRegisterTencentIm({ userId })
    if (code !== 1000) {
      message.error(msg)
      return
    }
    try {
      const res = await getToCustomerUrl(userId)
      if (!res) {
        message.error('请先登录')
        return
      }
      url = res?.url
      payload = res?.payload
    } catch (err) {
      message.error(err)
    }
    if (url) {
      window.location.href = url + '?' + payload
      onClose()
    } else {
      message.error('没有可用的IM信息')
    }
  }

  useEffect(() => {
    if (visible && isAdmin) {
      // 如果是平台客服
      getMemberAbilityInfoGetPlatformImUsers().then((res) => {
        setList(res.data)
      })
      return
    }
    if (visible && memberId) {
      getMemberAbilityInfoGetHasImAuthUsers({
        memberId,
      }).then((res) => {
        setList(res.data)
      })
    }
  }, [visible, memberId, isAdmin])

  return (
    <Modal
      zIndex={9999}
      title={'请选择需要聊天的客服'}
      open={visible}
      onCancel={onClose}
      onOk={(e) => toImChat(e, userId)}
    >
      <Radio.Group value={userId} onChange={(e) => setUserId(e.target.value)}>
        {list.map((v) => (
          <Radio key={v.userId} value={v.userId} style={{ display: 'block' }}>
            {v.userName}（{v.memberName}）
          </Radio>
        ))}
      </Radio.Group>
    </Modal>
  )
}

export default CustomerServiceList
