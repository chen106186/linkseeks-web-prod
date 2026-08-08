/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 10:36:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-29 18:32:29
 * @Description: 解除解冻
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Row, Col, Spin } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { StopOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberCustomerAbilityMaintenanceDetail,
  GetMemberCustomerAbilityMaintenanceDetailResponse,
  postMemberCustomerAbilityMaintenanceFreeze,
} from '@apps/apis'
import { MEMBER_TYPE_CHANNEL_CORPORATE, MEMBER_TYPE_CHANNEL_INDIVIDUAL } from '@/constants/member'
import { PageHeaderWrapper } from '@apps/components'
import AvatarWrap from '@/components/AvatarWrap'
import FlowRecords from '@/components/FlowRecords'
import CustomizeColumn from '@/components/CustomizeColumn'
import NiceForm from '@/components/NiceForm'
import { freezeSchema } from '../freeze/schema'
import { MEMBER_OUTER_COLUMNS, MEMBER_INNER_COLUMNS } from '../../../constant'
import { renderFieldTypeContent } from '../../../utils'
import MemberBasicInfo from '../../../components/MemberBasicInfo'
import MemberChannelInfo from '../../../components/MemberChannelInfo'
import styles from './index.less'

type ValueType = {
  /**
   * 理由
   */
  reason: string
}

const formActions = createFormActions()

const MemberMaintainUnfreeze: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [memberInfo, setMemberInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailResponse>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [infoLoading, setInfoLoaading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const intl = useIntl()

  const getBasicInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoaading(true)
    getMemberCustomerAbilityMaintenanceDetail({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setMemberInfo(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoaading(false)
      })
  }

  useEffect(() => {
    getBasicInfo()
  }, [])

  // 解冻与解冻
  const handleSubmit = (values: ValueType) => {
    setConfirmLoading(true)
    return postMemberCustomerAbilityMaintenanceFreeze({
      validateId: validateId,
      status: 1,
      reason: values.reason || '',
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setModalVisible(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        setConfirmLoading(false)
      })
  }

  const anchorsArr = [
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'customerAbility.management.maintain.basic' }),
    },
    memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_CORPORATE ||
    memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_INDIVIDUAL
      ? {
          key: 'channelInfo',
          label: intl.formatMessage({ id: 'customerAbility.management.maintain.channel' }),
        }
      : null,
    ...(memberInfo && memberInfo.groups
      ? memberInfo.groups.map((item, index) => ({
          key: `group${index}`,
          label: item.groupName,
        }))
      : []),
    {
      key: 'flowRecords',
      label: intl.formatMessage({ id: 'customerAbility.management.maintain.flowRecords' }),
    },
  ].filter(Boolean)

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={
          <AvatarWrap
            info={{
              name: memberInfo?.name,
            }}
            extra={memberInfo?.levelTag}
          />
        }
        items={
          anchorsArr as {
            key: string
            label: string
          }[]
        }
        extra={
          <Button icon={<StopOutlined />} onClick={() => setModalVisible(true)}>
            {intl.formatMessage({ id: 'customerAbility.management.maintain.unfreeze.unfreeze' })}
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <MemberBasicInfo
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

          {/* 渠道信息 */}
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
                            {renderFieldTypeContent(
                              ele.fieldType,
                              ele.fieldType === 'list' ? ele.registers : ele.fieldValue,
                            )}
                          </div>
                        ),
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
                id="flowRecords"
              />
            </div>
          </Col>
        </Row>

        {/* 解冻相关 */}
        <Modal
          title={intl.formatMessage({ id: 'customerAbility.management.maintain.unfreeze.unfreeze.title' })}
          visible={modalVisible}
          confirmLoading={confirmLoading}
          onOk={() => formActions.submit()}
          onCancel={() => setModalVisible(false)}
          destroyOnClose
        >
          <NiceForm
            previewPlaceholder="' '"
            actions={formActions}
            schema={freezeSchema}
            effects={($, { setFieldState }) => {
              FormEffectHooks.onFieldInit$('reason').subscribe(() => {
                setFieldState('reason', (fieldState) => {
                  fieldState.props.title = intl.formatMessage({
                    id: 'customerAbility.management.maintain.unfreeze.unfreeze.form.reason',
                  })
                })
              })
            }}
            onSubmit={handleSubmit}
          />
        </Modal>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberMaintainUnfreeze
