import React from 'react'
import BasicInfo from '../../components/BasicInfo'
import AuditProcess from '../../components/AuditProcess'
import { useMemberInfo } from '../../services/contexts/memberContext'

const MemberBasicInfo: React.FC<any> = () => {
  const { memberMaintainInfo } = useMemberInfo()
  return (
    <div>
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <AuditProcess
          outerVerifyCurrent={
            memberMaintainInfo && memberMaintainInfo.currentOuterStep > 0 ? memberMaintainInfo.currentOuterStep - 1 : 0
          }
          innerVerifyCurrent={
            memberMaintainInfo && memberMaintainInfo.currentInnerStep > 0 ? memberMaintainInfo.currentInnerStep - 1 : 0
          }
          outerVerifySteps={memberMaintainInfo?.outerVerifySteps}
          innerVerifySteps={memberMaintainInfo?.innerVerifySteps}
        />
      </div>

      <BasicInfo
        basic={{
          account: memberMaintainInfo?.account,
          phone: memberMaintainInfo?.phone,
          email: memberMaintainInfo?.email,
          created: memberMaintainInfo?.createTime,
        }}
        channel={{
          memberType: memberMaintainInfo?.memberTypeEnum,
          level: memberMaintainInfo?.channelLevelTag,
          type: memberMaintainInfo?.channelTypeName,
          areas: memberMaintainInfo?.areas,
          desc: memberMaintainInfo?.remark,
        }}
        extra={memberMaintainInfo?.groups}
        outerHistory={memberMaintainInfo?.outerHistory}
        innerHistory={memberMaintainInfo?.innerHistory}
      />
    </div>
  )
}

export default MemberBasicInfo
