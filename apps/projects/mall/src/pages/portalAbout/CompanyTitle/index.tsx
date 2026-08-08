import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { getMemberAbilityInfoInviteCondition } from '@apps/apis'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import quality from './quality.png'
import Satisfaction from '../../portalSearchResult/Satisfaction'
import styles from './index.module.less'

interface Props {
  companyName?: string
  companyNumber?: string
  companyTime?: string
  identification?: string
  fnChangeStatus?: Function
  collectStatus?: boolean
  useStatus?: boolean
  userInfo: any
  roleId?: string
  memberId?: string
  mallInfo?: any
}

function CompanyTitle(props: Props) {
  const {
    companyName = '-',
    companyNumber = '-',
    companyTime = '0',
    identification = '5',
    fnChangeStatus,
    collectStatus = false,
    userInfo,
    memberId,
    roleId,
    mallInfo,
  } = props

  const [MemberMessage, setMemberMessage] = useState<any>({})

  /**
   * 是否会员
   */
  const fnGetUserStatus = () => {
    if (!memberId || !mallInfo) {
      return
    }
    let obj: any = {
      subMemberId: memberId,
      subRoleId: roleId,
      shopType: mallInfo.type,
    }
    getMemberAbilityInfoInviteCondition(obj).then((res) => {
      setMemberMessage(res.data)
    })
  }

  const fnChangeStatusNew = () => {
    if (fnChangeStatus) {
      fnChangeStatus()
    }
  }

  /**
   * 发送信息邀请会员
   */
  const fnApplyUser = () => {
    if (MemberMessage.validateId) {
      return
    }
    window.open(`${MEMBER_CENTER_URL}/memberAbility/profile/query`)
  }

  useEffect(() => {
    fnGetUserStatus()
  }, [memberId, mallInfo])

  return (
    <ul className={styles['company-main']}>
      <li>
        <div className={styles['company-title']}>{companyName}</div>
        <div className={styles['company-second-title']}>
          <div className={styles['company-quality']}>
            <img src={quality} alt="" />
            <span>{companyNumber}</span>
          </div>
          <div className={styles['company-time']}>入驻 {companyTime} 年</div>
          <div style={{ marginLeft: '8px' }}>
            <Satisfaction identification={identification} hasKey={false}></Satisfaction>
          </div>
        </div>
      </li>
      {userInfo && (
        <li className={styles['company-right']}>
          {userInfo.memberId !== memberId && userInfo.memberRoleId !== roleId && (
            <Button style={{ marginRight: '16px' }} onClick={fnChangeStatusNew}>
              {collectStatus ? '取消收藏' : '加入收藏'}
            </Button>
          )}
          {MemberMessage && MemberMessage.show && (
            <>
              {MemberMessage && MemberMessage.status == 2 ? (
                <Button style={{ background: '#00a98f', color: '#ffffff' }}>
                  立即派单
                  <a
                    href={`${MEMBER_CENTER_URL}/logisticsAbility/logisticsBillSubmit/waitSbumitLogisticsBill`}
                    className="all-jump"
                  ></a>
                </Button>
              ) : (
                <Button onClick={fnApplyUser} style={{ background: '#00a98f', color: '#ffffff' }}>
                  邀请成为会员
                </Button>
              )}
            </>
          )}
        </li>
      )}
    </ul>
  )
}

export default CompanyTitle
