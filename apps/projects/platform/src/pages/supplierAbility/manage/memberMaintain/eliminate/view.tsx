/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-04 10:36:43
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-29 17:49:03
 * @Description: 解除关系
 */
import React, { useState, useEffect } from 'react'
import { Button, Modal, Row, Col, Spin, Tooltip, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { StopOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { createFormActions } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberSupplierAbilityMaintenanceDetail,
  GetMemberSupplierAbilityMaintenanceDetailResponse,
  postMemberSupplierAbilityMaintenanceEliminate,
} from '@apps/apis'
import { MEMBER_TYPE_CHANNEL_CORPORATE, MEMBER_TYPE_CHANNEL_INDIVIDUAL } from '@/constants/member'
import { PageHeaderWrapper } from '@apps/components'
import AvatarWrap from '@/components/AvatarWrap'
import FlowRecords from '@/components/FlowRecords'
import CustomizeColumn from '@/components/CustomizeColumn'
import NiceForm from '@/components/NiceForm'
import { unfriendModalSchema } from './schema'
import { MEMBER_OUTER_COLUMNS, MEMBER_INNER_COLUMNS } from '../../../constant'
import { renderFieldTypeContent } from '../../../utils'
import MemberBasicInfo from '../../../components/MemberBasicInfo'
import MemberChannelInfo from '../../../components/MemberChannelInfo'
import styles from './index.less'

type ValueType = {
  /**
   * 日期
   */
  date: string
  /**
   * 理由
   */
  reason: string
}

const formActions = createFormActions()

const MemberMaintainEliminate: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [memberInfo, setMemberInfo] = useState<GetMemberSupplierAbilityMaintenanceDetailResponse>(null)
  const [infoLoading, setInfoLoaading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [unfriendModalVisible, setUnfriendModalVisible] = useState(false)

  const intl = useIntl()

  const getBasicInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoaading(true)
    getMemberSupplierAbilityMaintenanceDetail({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          console.log(555, res.data)
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

  const handleSubmit = (values: ValueType) => {
    setConfirmLoading(true)
    return postMemberSupplierAbilityMaintenanceEliminate({
      validateId: validateId,
      ...values,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setUnfriendModalVisible(false)
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
      label: intl.formatMessage({ id: 'member.management.maintain.basic' }),
    },
    memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_CORPORATE ||
    memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_INDIVIDUAL
      ? {
          key: 'channelInfo',
          label: intl.formatMessage({ id: 'member.management.maintain.channel' }),
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
      label: intl.formatMessage({ id: 'member.management.maintain.flowRecords' }),
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
          <Space size={16}>
            <Button icon={<StopOutlined />} onClick={() => setUnfriendModalVisible(true)}>
              {intl.formatMessage({ id: 'member.management.maintain.eliminate.remove' })}
            </Button>
          </Space>
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
                  innerStatus: memberInfo?.innerStatus,
                  innerStatusName: memberInfo?.innerStatusName,
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
              />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>

      {/* 解除关系相关 */}
      <Modal
        title={
          <div>
            {intl.formatMessage({ id: 'supplier.management.maintain.eliminate.remove.title' })}
            <Tooltip
              title={intl.formatMessage({ id: 'member.management.maintain.eliminate.remove.title-description' })}
            >
              <QuestionCircleOutlined style={{ marginLeft: 8 }} />
            </Tooltip>
          </div>
        }
        visible={unfriendModalVisible}
        confirmLoading={confirmLoading}
        onOk={() => formActions.submit()}
        onCancel={() => setUnfriendModalVisible(false)}
        destroyOnClose
      >
        <NiceForm
          previewPlaceholder="' '"
          components={{
            DatePicker,
          }}
          effects={() => {}}
          actions={formActions}
          schema={unfriendModalSchema}
          onSubmit={handleSubmit}
        />
      </Modal>
    </Spin>
  )
}

export default MemberMaintainEliminate
