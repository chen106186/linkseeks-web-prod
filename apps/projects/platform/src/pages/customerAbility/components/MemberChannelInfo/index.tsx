/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-18 17:26:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:24:29
 * @Description: 会员渠道信息
 */

import React, { useState } from 'react'
import { Row, Col, Descriptions, Button, message } from 'antd'
import { useIntl } from '@linkseeks/i18n'
// import {
//   getMemberCustomerAbilityMaintenanceDetailBasicChannel,
//   GetMemberCustomerAbilityMaintenanceDetailBasicChannelResponse,
//   postMemberCustomerAbilityMaintenanceDetailBasicChannelUpdate,
// } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import ModifyChannelDrawer, { ValueType } from '../ModifyChannelDrawer'
import styles from './index.less'

export type ChannelInfoProps = {
  /**
   * 数据
   */
  dataSource: {
    /**
     * 渠道级别
     */
    level: string
    /**
     * 渠道类型
     */
    type: string
    /**
     * 代理地市
     */
    areas: string[]
    /**
     * 渠道描述
     */
    desc: string
  }
  /**
   * 审核id
   */
  validateId?: string
  /**
   * 修改渠道信息之后触发事件
   */
  onModifyAfter?: () => void
}

const MemberChannelInfo: React.FC<ChannelInfoProps> = (props: ChannelInfoProps) => {
  const { dataSource, validateId, onModifyAfter, ...rest } = props
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [channelInfo, setChannelInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailBasicChannelResponse>()
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const intl = useIntl()

  const handleVisibleDrawer = (flag?) => {
    setVisibleDrawer(!!flag)
  }

  const handleModifyChannelInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    // getMemberCustomerAbilityMaintenanceDetailBasicChannel({
    //   validateId,
    // })
    //   .then((res) => {
    //     if (res.code === 1000) {
    //       setChannelInfo(res.data)
    //       handleVisibleDrawer(true)
    //     }
    //   })
    //   .catch((err) => {
    //     console.warn(err)
    //   })
    //   .finally(() => {
    //     setInfoLoading(false)
    //   })
  }

  const handleSubmit = (value: ValueType) => {
    const { areaCodes, ...rest } = value
    setSubmitLoading(true)
    const payload = {
      validateId: +validateId,
      areas: areaCodes,
      ...rest,
    }
    const msg = message.loading({
      content: intl.formatMessage({
        id: 'customerAbility.components.MemberChannelInfo.edit.message',
        defaultMessage: '正在提交，请稍候...',
      }),
      duration: 0,
    })
    // postMemberCustomerAbilityMaintenanceDetailBasicChannelUpdate(payload, {
    //   timeout: 0,
    // })
    //   .then((res) => {
    //     if (res.code !== 1000) {
    //       return
    //     }
    //     handleVisibleDrawer(false)
    //     onModifyAfter?.()
    //   })
    //   .finally(() => {
    //     msg()
    //     setSubmitLoading(false)
    //   })
  }

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'customerAbility.components.MemberChannelInfo.title',
        defaultMessage: '渠道信息',
      })}
      {...rest}
      className={styles['channel-info']}
      extra={
        <>
          {validateId && (
            <Button type="link" loading={infoLoading} onClick={handleModifyChannelInfo}>
              {intl.formatMessage({ id: 'customerAbility.components.MemberChannelInfo.edit', defaultMessage: '修改' })}
            </Button>
          )}
        </>
      }
    >
      <Row gutter={16}>
        <Col span={8}>
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfo.level',
                defaultMessage: '渠道级别',
              })}
              labelStyle={{ width: 106 }}
            >
              {dataSource.level || ''}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfo.type',
                defaultMessage: '渠道类型',
              })}
              labelStyle={{ width: 106 }}
            >
              {dataSource.type || ''}
            </Descriptions.Item>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfo.desc',
                defaultMessage: '渠道描述',
              })}
              labelStyle={{ width: 106 }}
            >
              {dataSource.desc || ''}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={16}>
          <Descriptions column={1}>
            <Descriptions.Item
              label={intl.formatMessage({
                id: 'customerAbility.components.MemberChannelInfo.areas',
                defaultMessage: '代理地市',
              })}
              labelStyle={{ width: 106 }}
            >
              <Row gutter={16} style={{ flex: 1 }}>
                {dataSource.areas
                  ? dataSource.areas.map((item) => (
                      <Col key={item} span={12}>
                        {item}
                      </Col>
                    ))
                  : null}
              </Row>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <ModifyChannelDrawer
        visible={visibleDrawer}
        onClose={() => handleVisibleDrawer(false)}
        onSubmit={handleSubmit}
        submitLoading={submitLoading}
        channelInfo={{
          upperMembers: channelInfo?.upperMembers,
          channelTypes: channelInfo?.channelTypes,
        }}
        channelValue={{
          upperRelationId: channelInfo?.upperRelationId,
          channelTypeId: channelInfo?.channelTypeId,
          channelLevel: channelInfo?.channelLevelTag,
          areaCodes: channelInfo?.areaCodes,
          remark: channelInfo?.remark,
        }}
      />
    </MellowCard>
  )
}

export default MemberChannelInfo
