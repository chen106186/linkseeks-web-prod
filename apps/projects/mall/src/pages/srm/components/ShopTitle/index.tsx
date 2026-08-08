import React, { useState, useEffect } from 'react'
import { Button, message, Modal } from 'antd'
import useCountdown from '@/hooks/useCountdown'
import { postPurchasePurchaseInquiryCheckMemberLifecycleRuleSetting } from '@apps/apis'
import styles from './index.module.less'
import { getLoginDomainFn, MEMBER_CENTER_URL } from '@/constants/domain'
import { useGlobalConext } from '@/context/globalProvider'

interface Props {
  timer: number // 报名结束时间
  projectName?: string
  projectType?: string
  days?: string
  hours?: string
  minutes?: string
  id?: string
  purchaseInquiryNo?: string
  userInfo?: any
  isRegister?: number // 报价次数
  canRegister?: boolean // 当前用户能否报价
  isSignUp?: number // 是否已报名,
  isMePublish?: number // 是否是自己发布的竞价单 1:是; 0:否;
  isSubMember?: boolean // 是否下级会员
  memberRoleId?: string
  memberId?: string
}

const ShopTitle: React.FC<Props> = (props) => {
  const {
    timer,
    projectName = '',
    projectType = '',
    days = '0',
    hours = '0',
    minutes = '0',
    id = '0',
    purchaseInquiryNo = '0',
    userInfo,
    isRegister,
    canRegister = true,
    isSignUp,
    isMePublish,
    isSubMember,
    memberRoleId,
    memberId,
  } = props
  const { url } = useGlobalConext()
  const [userMessage, setUserMessage] = useState<any>({})
  const { count, setTime } = useCountdown()
  // 登录域名
  const LOGIN_DOMAIN = getLoginDomainFn(url)

  const PAGENAME = {
    /** 采购询价单 */
    INQUIRY_ORDER: '采购询价单',
    /** 采购招标单 */
    TENDER_ORDER: '采购招标单',
    /** 采购竞价单 */
    BIDDING_ORDER: '采购竞价单',
  }

  /**
   * 获取订单状态
   * @param type 页面类型
   *
   */
  const fnIsOverdue = (type: string) => {
    let resolve = false
    if (!!!count?.d && !!!count?.h && !!!count?.m) {
      resolve = false
    } else if ((type === PAGENAME.INQUIRY_ORDER || type === PAGENAME.TENDER_ORDER) && isRegister && isRegister > 0) {
      resolve = false
    } else if (type === PAGENAME.BIDDING_ORDER && isSignUp && isSignUp > 0) {
      resolve = false
    } else {
      resolve = true
    }
    return resolve
  }

  useEffect(() => {
    if (userInfo) {
      const userInfoDesc = JSON.parse(JSON.stringify(userInfo))
      setUserMessage(userInfoDesc)
    }
  }, [])

  useEffect(() => {
    if (timer) {
      setTime(timer)
    }
  }, [timer])

  const handleLink = (type: string) => {
    let link = ''
    if (type === PAGENAME.TENDER_ORDER) {
      link = `${MEMBER_CENTER_URL}/procurementAbility/tender/readyBidRegister/add?id=${id}`
    } else if (type === PAGENAME.BIDDING_ORDER) {
      link = `${MEMBER_CENTER_URL}/procurementAbility/onlineBid/readySignUp/signUp?id=${id}&number=${purchaseInquiryNo}`
    }
    return link
  }
  /* 校验会员是否允许参与寻源 */
  const checkMemberLifeCycle = (linkseeks?: string) => {
    const param: any = {
      memberId,
      roleId: memberRoleId,
      lifeCycleStageRuleId: 1,
    }
    postPurchasePurchaseInquiryCheckMemberLifecycleRuleSetting(param).then((res) => {
      if (res.code === 1000) {
        const { data } = res
        message.destroy()
        if (!data) {
          Modal.warning({
            content: `您目前阶段暂不允许进行${
              projectType === PAGENAME.INQUIRY_ORDER ? '报价' : '报名'
            }，请咨询您的采购商！`,
          })
        } else {
          window.open(linkseeks)
        }
      }
    })
  }

  /** 未成为下级会员提示 */
  const handleIsSubMember = (linkseeks?: string) => {
    if (!isSubMember) {
      Modal.warning({
        content: `您还未申请成为入库供应商，请先申请后再${projectType === PAGENAME.INQUIRY_ORDER ? '报价' : '报名'}!`,
      })
      return
    }
    checkMemberLifeCycle(linkseeks)
  }

  return (
    <div className={styles['shop-title-warp']}>
      <div className={styles['shop-title-left']}>
        <div className={styles['shop-title']}>{projectName}</div>
        <div className={styles['shop-title-tips']}>{projectType}</div>
      </div>
      <div className={styles['shop-title-right']}>
        {projectType === PAGENAME.INQUIRY_ORDER && (
          <div style={!canRegister ? { height: '32px', marginBottom: '16px' } : {}}>
            {canRegister && (
              <>
                {userMessage && userMessage.memberId ? (
                  <Button
                    type="primary"
                    style={{ marginBottom: '16px' }}
                    disabled={!canRegister || !fnIsOverdue(projectType)}
                    onClick={() =>
                      handleIsSubMember(
                        `${MEMBER_CENTER_URL}/procurementAbility/offter/addOffter/add?id=${id}&number=${purchaseInquiryNo}&type=quote`,
                      )
                    }
                  >
                    {fnIsOverdue(projectType) ? '立即报价' : isRegister && isRegister > 0 ? '已经报价' : '已经截止'}
                  </Button>
                ) : (
                  <Button type="primary" style={{ marginBottom: '16px' }} href={LOGIN_DOMAIN}>
                    {fnIsOverdue(projectType) ? '立即报价' : isRegister && isRegister > 0 ? '已经报价' : '已经截止'}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
        {projectType === PAGENAME.BIDDING_ORDER && (
          <div style={!!isMePublish ? { height: '32px', marginBottom: '16px' } : {}}>
            {!!!isMePublish && (
              <>
                {userMessage && userMessage.memberId ? (
                  <Button
                    type="primary"
                    style={{ marginBottom: '16px' }}
                    disabled={!!isSignUp || !fnIsOverdue(projectType)}
                    onClick={() => handleIsSubMember(handleLink(projectType))}
                  >
                    {fnIsOverdue(projectType) ? '立即报名' : isSignUp && isSignUp > 0 ? '已经报名' : '已经截止'}
                  </Button>
                ) : (
                  <Button type="primary" style={{ marginBottom: '16px' }} href={LOGIN_DOMAIN}>
                    {fnIsOverdue(projectType) ? '立即报名' : isSignUp && isSignUp > 0 ? '已经报名' : '已经截止'}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
        {projectType === PAGENAME.TENDER_ORDER && (
          <div style={!canRegister ? { height: '32px', marginBottom: '16px' } : {}}>
            {canRegister && (
              <>
                {userMessage && userMessage.memberId ? (
                  <Button
                    type="primary"
                    style={{ marginBottom: '16px' }}
                    disabled={!canRegister || !fnIsOverdue(projectType)}
                    onClick={() => handleIsSubMember(handleLink(projectType))}
                  >
                    {fnIsOverdue(projectType) ? '立即报名' : isRegister && isRegister > 0 ? '已经报名' : '已经截止'}
                  </Button>
                ) : (
                  <Button type="primary" style={{ marginBottom: '16px' }} href={LOGIN_DOMAIN}>
                    {fnIsOverdue(projectType) ? '立即报名' : isRegister && isRegister > 0 ? '已经报名' : '已经截止'}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
        <div>
          {projectType !== PAGENAME.INQUIRY_ORDER ? '报名' : '报价'}
          {'剩余'}：<span className={styles['shop-title-small-btn']}>{count?.d}</span> {'天'}
          <span className={styles['shop-title-small-btn']}>{count?.h}</span> {'时'}
          <span className={styles['shop-title-small-btn']}>{count?.m}</span> {'分'}
        </div>
      </div>
    </div>
  )
}

export default ShopTitle
