import React, { useState } from 'react'
import { Tooltip, Spin } from '@linkseeks/ui'
import { MoreHorizontalIcon } from '@linkseeks/icons'
import type {
  GetCommodityShopSelfShopListResponseDetail,
  PostMemberMaintenanceGetMemberDetailResponse,
} from '@apps/apis'
import styles from './index.less'
import { getMemberDetail } from '../../feature'

interface MemberInfoProps {
  data: GetCommodityShopSelfShopListResponseDetail
}

const MemberInfo: React.FC<MemberInfoProps> = (props) => {
  const { data } = props
  const [memberDetail, setMemberDetail] = useState<PostMemberMaintenanceGetMemberDetailResponse>()
  const [spinLoading, setSpinLoading] = useState<boolean>(false)

  const MemberDetail = () => {
    return (
      <Spin spinning={spinLoading}>
        <div className={styles['member-detail']}>
          <div className={styles['member-detail-title']}>会员信息</div>
          <div className={styles['member-detail-line']}>
            <label>会员名称：</label>
            <span>{memberDetail?.memberName}</span>
          </div>
          <div className={styles['member-detail-line']}>
            <label>会员等级：</label>
            <span>{memberDetail?.levelTag}</span>
          </div>
          <div className={styles['member-detail-line']}>
            <label>会员类型：</label>
            <span>{memberDetail?.memberTypeName}</span>
          </div>
          <div className={styles['member-detail-line']}>
            <label>会员角色：</label>
            <span>{memberDetail?.roleName}</span>
          </div>
        </div>
      </Spin>
    )
  }

  const handleOpenChange = async (open: boolean) => {
    console.log(open, 'open')
    // 多次点击同一个不重复请求
    if (open && (!memberDetail || memberDetail?.memberId !== data?.memberId)) {
      setSpinLoading(true)
      const result = await getMemberDetail(data?.memberId, data?.memberRoleId)
      setSpinLoading(false)
      setMemberDetail(result)
    }
  }

  return data?.memberName ? (
    <Tooltip
      placement="bottomRight"
      title={<MemberDetail />}
      color="#FFF"
      trigger="click"
      onOpenChange={handleOpenChange}
    >
      <div className={styles['member-info']}>
        <span className={styles['member-info-name']}>{data?.memberName}</span>

        <div className={styles['member-info-icon-wrap']}>
          <MoreHorizontalIcon size={16} className={styles['member-info-icon']} />
        </div>
      </div>
    </Tooltip>
  ) : null
}

export default MemberInfo
