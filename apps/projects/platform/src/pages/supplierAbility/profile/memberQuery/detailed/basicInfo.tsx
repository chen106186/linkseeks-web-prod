/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-28 10:02:03
 * @Description: 会员基础信息详情
 */
import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd'
import { observer, inject } from 'mobx-react'
import { IMemberModule } from '@/module/memberModule'
import { MEMBER_TYPE_CHANNEL_CORPORATE, MEMBER_TYPE_CHANNEL_INDIVIDUAL } from '@/constants/member'
import AuditProcess from '@/components/AuditProcess'
import CustomizeColumn from '@/components/CustomizeColumn'
import FlowRecords from '@/components/FlowRecords'
import { MEMBER_OUTER_COLUMNS, MEMBER_INNER_COLUMNS } from '../../../constant'
import BasicInfo from '../../../components/MemberBasicInfo'
import MemberChannelInfo from '../../../components/MemberChannelInfo'
import { renderFieldTypeContent } from '../../../utils'
import styles from './basicInfo.less'
import { getMemberSupplierAbilityInfoDetailBasic } from '@apps/apis'

interface MemberBasicInfoProps {
  validateId?: string
}

const MemberBasicInfo: React.FC<MemberBasicInfoProps> = ({ validateId }) => {
  const [memberInfo, setMemberInfo] = useState<any>({})
  useEffect(() => {
    if (validateId) {
      getMemberSupplierAbilityInfoDetailBasic({
        validateId,
      })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setMemberInfo(res.data)
        })
        .catch((err) => {
          console.warn(err)
        })
    }
  }, [validateId])
  return (
    <Row gutter={[16, 16]}>
      {/* 会员审核流程 */}
      <Col span={24}>
        <div id="verifySteps">
          <AuditProcess
            outerVerifySteps={memberInfo?.outerVerifySteps}
            outerVerifyCurrent={memberInfo?.currentOuterStep}
            innerVerifySteps={memberInfo?.innerVerifySteps}
            innerVerifyCurrent={memberInfo?.currentInnerStep}
          />
        </div>
      </Col>

      {/* 基本信息 */}
      <Col span={24}>
        <div id="basicInfo">
          <BasicInfo
            dataSource={{
              memberId: memberInfo?.memberId,
              memberTypeName: memberInfo?.memberTypeName,
              account: memberInfo?.account,
              name: memberInfo?.name,
              roleName: memberInfo?.roleName,
              phone: memberInfo?.phone,
              outerStatus: memberInfo?.outerStatus,
              outerStatusName: memberInfo?.outerStatusName,
              levelTag: memberInfo?.levelTag,
              email: memberInfo?.email,
              createTime: memberInfo?.registerTime,
              innerStatus: memberInfo?.innerStatus,
              innerStatusName: memberInfo?.innerStatusName,
            }}
          />
        </div>
      </Col>

      {/* 渠道信息 */}
      {/* 平台录入的会员不需要填渠道信息的 */}
      {memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_CORPORATE ||
      memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_INDIVIDUAL ? (
        <Col span={24}>
          <div id="channelInfo">
            <MemberChannelInfo
              dataSource={{
                level: memberInfo?.channelLevelTag,
                type: memberInfo?.channelTypeName,
                areas: memberInfo?.areas,
                desc: memberInfo?.remark,
              }}
            />
          </div>
        </Col>
      ) : null}

      {/* 其他注册信息 */}
      {memberInfo && memberInfo.groups
        ? memberInfo.groups.map((item, index) => (
            <Col span={24} key={`group${index}`}>
              <div id={`group${index}`}>
                <CustomizeColumn
                  title={item.groupName}
                  data={item.elements.map((ele) => ({
                    title: ele.fieldLocalName,
                    value: (
                      <div className={styles['changed']}>
                        {/* {renderFieldTypeContent(ele.fieldType, ele.fieldValue, ele.lastValue)} */}
                        {renderFieldTypeContent(
                          ele.fieldType,
                          ele.fieldType === 'list' ? ele.registers : ele.fieldValue,
                        )}
                      </div>
                    ),
                  }))}
                  id={`group${index}`}
                />
              </div>
            </Col>
          ))
        : null}

      {/* 流转记录 */}
      <Col span={24}>
        <div id="flowRecords">
          <FlowRecords
            outerColumns={MEMBER_OUTER_COLUMNS}
            innerColumns={MEMBER_INNER_COLUMNS}
            outerRowkey="id"
            innerRowkey="id"
            outerDataSource={memberInfo?.outerHistory}
            innerDataSource={memberInfo?.innerHistory}
          />
        </div>
      </Col>
    </Row>
  )
}

export default MemberBasicInfo
