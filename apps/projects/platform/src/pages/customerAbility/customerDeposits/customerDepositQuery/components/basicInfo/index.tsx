/* eslint-disable react/no-array-index-key */
/*
 * @Description: 客户基础信息详情
 */
import React, { useContext, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col } from 'antd'
import AuditProcess from '@/components/AuditProcess'
import CustomizeColumn from '@/components/CustomizeColumn'
import FlowRecords from '@/components/FlowRecords'
import { MEMBER_OUTER_COLUMNS, MEMBER_INNER_COLUMNS } from '../../../../constant'
import MemberDetailsContext from '../../../../memberDetailsContext'
import BasicInfo from '../../../../components/MemberBasicInfo'
import { renderFieldTypeContent } from '../../../../utils'
import styles from './index.less'

const CustomerBasicInfo: React.FC<any> = (props) => {
  const contenxt = useContext(MemberDetailsContext)
  const { details: memberInfo } = contenxt
  const { validateId, id } = props

  const intl = useIntl()

  useEffect(() => {
    const anchors = [
      {
        key: 'verifySteps',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.verifySteps' }),
      },
      {
        key: 'basicInfo',
        name: intl.formatMessage({ id: 'member.management.maintain.basic' }),
      },
      ...(memberInfo && memberInfo.groups
        ? memberInfo.groups.map((item, index) => ({
            key: `group${index}`,
            name: item.groupName,
          }))
        : []),
      {
        key: 'flowRecords',
        name: intl.formatMessage({ id: 'member.management.maintain.flowRecords' }),
      },
    ].filter(Boolean)
    contenxt.onAnchorsReady(anchors)
  }, [memberInfo])

  const handleModifyAfter = () => {
    contenxt.refreshDetails?.()
  }

  return (
    <Row gutter={[16, 16]}>
      {/* 会员审核流程 */}
      <Col span={24}>
        <div id="verifySteps">
          <AuditProcess
            outerVerifySteps={memberInfo?.outerVerifySteps}
            outerVerifyCurrent={memberInfo?.outerVerifySteps.findIndex(
              (item) => item.step === memberInfo?.currentOuterStep,
            )}
            innerVerifySteps={memberInfo?.innerVerifySteps}
            innerVerifyCurrent={memberInfo?.innerVerifySteps.findIndex(
              (item) => item.step === memberInfo?.currentInnerStep,
            )}
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
            }}
          />
        </div>
      </Col>

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
                      <div className={styles.changed}>
                        {renderFieldTypeContent(
                          ele.fieldType,
                          ele.fieldType == 'list' ? ele.registers : ele.fieldValue,
                        )}
                      </div>
                    ),
                    columnProps: {
                      span: ele.fieldType === 'list' ? 3 : 1,
                    },
                  }))}
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

export default CustomerBasicInfo
