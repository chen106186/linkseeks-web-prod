/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-09 11:09:36
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:35:31
 * @Description: 会员详情信息
 */
import MemberDocCategory from '../MemberDocCategory'

import type { Ref } from 'react'
import React from 'react'
import { Row, Col, Spin } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { MEMBER_TYPE_CHANNEL_CORPORATE, MEMBER_TYPE_CHANNEL_INDIVIDUAL } from '@/constants/member'
import { PageHeaderWrapper } from '@apps/components'
import AvatarWrap from '@/components/AvatarWrap'
import AuditProcess from '@/components/AuditProcess'
import FlowRecords from '@/components/FlowRecords'
import CustomizeColumn from '@/components/CustomizeColumn'
import type { DetailType, AreaCodeType } from './interface'
import { MEMBER_OUTER_COLUMNS, MEMBER_INNER_COLUMNS } from '../../constant'
import { renderFieldTypeContent, getIncomingInfoAnchorKey } from '../../utils'
import MemberBasicInfo from '../MemberBasicInfo'
import MemberChannelInfo from '../MemberChannelInfo'
import MemberDocIncomingInfo from '../MemberDocIncomingInfo'
import MemberInvestigateInfo from '../MemberInvestigateInfo'
import MemberDocQualification from '../MemberDocQualification'
import type { ChannelValueType, ChannelRefHandle } from '../MemberChannelInfoForm'
import MemberChannelInfoForm from '../MemberChannelInfoForm'
import type { DepositValueType, DepositRefHandle } from '../MemberDocIncomingInfoForm'
import MemberDocIncomingInfoForm from '../MemberDocIncomingInfoForm'
import type { QualitiesSubmitValueType, QualitiesRefHandle } from '../MemberQualitiesForm'
import MemberQualitiesForm from '../MemberQualitiesForm'
import type { MemberDocCategoryProProps, MemberDocCategoryProRef } from '../MemberDocCategoryPro'
import MemberDocCategoryPro from '../MemberDocCategoryPro'

export * from './interface'

interface IProps {
  /**
   * 数据，待定
   */
  dataSource: DetailType
  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 拓展区域
   */
  extra?: (info: DetailType) => React.ReactNode
  /**
   * 是否展示渠道信息，默认 true
   */
  showChannelInfo?: boolean
  /**
   * 是否入库信息的 new 标签，默认 false
   */
  showNew?: boolean
  /**
   * 是否可编辑渠道信息，默认 false
   */
  editableChannel?: boolean
  /**
   * 渠道信息表单修改触发事件
   */
  onChannelInfoChange?: (values: ChannelValueType) => void
  /**
   * 渠道信息ref
   */
  channelRef?: Ref<ChannelRefHandle>
  /**
   * 是否可编辑入库信息，默认 false
   */
  editableDeposit?: boolean
  /**
   * 入库信息表单修改触发事件
   */
  onDepositChange?: (values: DepositValueType) => void
  /**
   * 入库信息ref
   */
  depositRef?: Ref<DepositRefHandle>
  /**
   * 是否可编辑资质证明，默认 false
   */
  editableQualities?: boolean
  /**
   * 资质证明表单修改触发事件
   */
  onQualitiesChange?: (values: QualitiesSubmitValueType[]) => void
  /**
   * 资质证明ref
   */
  qualitiesRef?: Ref<QualitiesRefHandle>
  /**
   * 是否可编辑分类信息，默认 false
   */
  editableCategory?: boolean
  /**
   * 分类信息ref
   */
  categoryRef?: Ref<MemberDocCategoryProRef>
  /**
   * 分类信息提交事件
   */
  onCategorySubmit?: MemberDocCategoryProProps['onSubmit']
}

const MemberProfile: React.FC<IProps> = (props) => {
  const {
    dataSource,
    loading,
    extra,
    showChannelInfo = true,
    showNew = false,
    editableChannel = false,
    onChannelInfoChange,
    channelRef,
    editableDeposit = false,
    onDepositChange,
    depositRef,
    editableQualities,
    onQualitiesChange,
    qualitiesRef,
    editableCategory,
    categoryRef,
    onCategorySubmit,
  } = props

  const intl = useIntl()

  const depositDetails = dataSource?.depositDetails || []

  const anchorsArr = [
    {
      key: 'verifySteps',
      label: intl.formatMessage({ id: 'member.components.MemberProfile.verifySteps' }),
    },
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'member.components.MemberProfile.basicInfo' }),
    },
    showChannelInfo &&
    (dataSource?.memberTypeEnum === MEMBER_TYPE_CHANNEL_CORPORATE ||
      dataSource?.memberTypeEnum === MEMBER_TYPE_CHANNEL_INDIVIDUAL)
      ? {
          key: 'channelInfo',
          label: intl.formatMessage({ id: 'member.components.MemberProfile.channelInfo' }),
        }
      : null,
    ...(dataSource && dataSource.registerDetails
      ? dataSource.registerDetails.map((item, index) => ({
          key: `group${index}`,
          label: item.groupName,
        }))
      : []),
    ...depositDetails.map((item, index) => ({
      key: getIncomingInfoAnchorKey(index),
      label: item.groupName,
    })),
    (dataSource && dataSource.qualities && dataSource.qualities.length) || editableQualities
      ? {
          key: 'qualificationInfo',
          label: intl.formatMessage({ id: 'member.components.MemberProfile.qualificationInfo' }),
        }
      : null,
    dataSource && dataSource.inspection && dataSource.inspection.inspectDay
      ? {
          key: 'investigateInfo',
          label: intl.formatMessage({ id: 'member.components.MemberProfile.investigateInfo' }),
        }
      : null,
    (dataSource && dataSource.classification && dataSource.classification.code) || editableCategory
      ? {
          key: 'classifyInfo',
          label: intl.formatMessage({ id: 'member.components.MemberProfile.classifyInfo' }),
        }
      : null,
    {
      key: 'flowRecords',
      label: intl.formatMessage({ id: 'member.components.MemberProfile.flowRecords' }),
    },
  ].filter(Boolean)

  const handleChannelInfoChange = (values: ChannelValueType) => {
    onChannelInfoChange?.(values)
  }

  const handleDepositChange = (values: DepositValueType) => {
    onDepositChange?.(values)
  }

  const handleQualitiesChange = (values: QualitiesSubmitValueType[]) => {
    onQualitiesChange?.(values)
  }

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={
          <AvatarWrap
            info={{
              name: dataSource?.name,
            }}
            extra={dataSource?.levelTag}
          />
        }
        items={
          anchorsArr as {
            key: string
            label: string
          }[]
        }
        extra={extra ? extra(dataSource) : null}
      >
        <Row gutter={[16, 16]}>
          {/* 会员审核流程 */}
          <Col span={24}>
            <div id="verifySteps">
              <AuditProcess
                outerVerifySteps={dataSource?.outerVerifySteps}
                outerVerifyCurrent={dataSource?.outerVerifySteps?.findIndex(
                  (item) => item.step === dataSource?.currentOuterStep,
                )}
                innerVerifySteps={dataSource?.innerVerifySteps}
                innerVerifyCurrent={dataSource?.innerVerifySteps?.findIndex(
                  (item) => item.step === dataSource?.currentInnerStep,
                )}
              />
            </div>
          </Col>

          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <MemberBasicInfo
                dataSource={{
                  memberId: dataSource?.memberId,
                  memberTypeName: dataSource?.memberTypeName,
                  account: dataSource?.account,
                  name: dataSource?.name,
                  roleName: dataSource?.roleName,
                  phone: dataSource?.phone,
                  innerStatus: dataSource?.innerStatus,
                  innerStatusName: dataSource?.innerStatusName,
                  outerStatus: dataSource?.outerStatus,
                  outerStatusName: dataSource?.outerStatusName,
                  levelTag: dataSource?.levelTag,
                  email: dataSource?.email,
                  createTime: dataSource?.registerTime,
                }}
              />
            </div>
          </Col>

          {/* 渠道信息 */}
          {showChannelInfo &&
          !editableChannel &&
          (dataSource?.memberTypeEnum === MEMBER_TYPE_CHANNEL_CORPORATE ||
            dataSource?.memberTypeEnum === MEMBER_TYPE_CHANNEL_INDIVIDUAL) ? (
            <Col span={24}>
              <div id="channelInfo">
                <MemberChannelInfo
                  dataSource={{
                    level: dataSource?.channelLevelTag,
                    type: dataSource?.channelTypeName,
                    areas: dataSource?.areaCodes as string[],
                    desc: dataSource?.remark,
                  }}
                />
              </div>
            </Col>
          ) : null}

          {/* 渠道信息，可编辑的 */}
          {showChannelInfo &&
          editableChannel &&
          (dataSource?.memberTypeEnum === MEMBER_TYPE_CHANNEL_CORPORATE ||
            dataSource?.memberTypeEnum === MEMBER_TYPE_CHANNEL_INDIVIDUAL) ? (
            <Col span={24}>
              <div id="channelInfo">
                <MemberChannelInfoForm
                  channelInfo={{
                    upperMembers: dataSource?.upperMembers,
                    channelTypes: dataSource?.channelTypes,
                  }}
                  channelValue={{
                    upperRelationId: dataSource?.upperRelationId,
                    channelTypeId: dataSource?.channelTypeId,
                    channelLevel: dataSource?.channelLevelTag,
                    areaCodes: dataSource?.areaCodes as AreaCodeType[],
                    remark: dataSource?.remark,
                  }}
                  onInputChange={handleChannelInfoChange}
                  ref={channelRef}
                />
              </div>
            </Col>
          ) : null}

          {/* 其他注册信息 */}
          {dataSource && dataSource.registerDetails
            ? dataSource.registerDetails.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Col span={24} key={`group${index}`}>
                  <div id={`group${index}`}>
                    <CustomizeColumn
                      title={item.groupName}
                      data={item.elements.map((ele) => ({
                        title: ele.fieldLocalName,
                        value: renderFieldTypeContent(
                          ele.fieldType,
                          ele.fieldType === 'list' ? ele.registers : ele.fieldValue,
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

          {/* 入库信息 */}
          {depositDetails.length > 0 && !editableDeposit
            ? depositDetails.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Col span={24} key={index}>
                  <div id={getIncomingInfoAnchorKey(index)}>
                    <MemberDocIncomingInfo groupData={item} showNew={showNew} />
                  </div>
                </Col>
              ))
            : null}

          {/* 入库信息，可编辑的 */}
          {dataSource?.depositDetails?.length > 0 && editableDeposit ? (
            <MemberDocIncomingInfoForm
              groups={dataSource?.depositDetails}
              ref={depositRef}
              onInputChange={handleDepositChange}
            />
          ) : null}

          {/* 资质证明 */}
          {dataSource && dataSource.qualities && dataSource.qualities.length && !editableQualities ? (
            <Col span={24}>
              <div id="qualificationInfo">
                <MemberDocQualification dataSource={dataSource?.qualities} showNew={showNew} />
              </div>
            </Col>
          ) : null}

          {/* 资质证明，可编辑的 */}
          {editableQualities ? (
            <Col span={24}>
              <div id="qualificationInfo">
                <MemberQualitiesForm
                  value={dataSource?.qualities}
                  onInputChange={handleQualitiesChange}
                  ref={qualitiesRef}
                />
              </div>
            </Col>
          ) : null}

          {/* 考察信息 */}
          {dataSource && dataSource.inspection && dataSource.inspection.inspectDay ? (
            <Col span={24}>
              <div id="investigateInfo">
                <MemberInvestigateInfo dataSource={dataSource?.inspection} />
              </div>
            </Col>
          ) : null}

          {/* 分类信息 */}
          {(dataSource && dataSource.classification && dataSource.classification.code) || editableCategory ? (
            <Col span={24}>
              <div id="classifyInfo">
                <MemberDocCategoryPro
                  value={dataSource?.classification}
                  editable={editableCategory}
                  isVerify={editableCategory ? 1 : 0}
                  partnerTypes={
                    dataSource && dataSource.partnerTypes
                      ? dataSource.partnerTypes
                          .map((item) => ({ label: item.text, value: item.id }))
                          .filter((item) => item.value)
                      : []
                  }
                  onSubmit={onCategorySubmit}
                  ref={categoryRef}
                />
              </div>
            </Col>
          ) : null}

          {/* 流转记录 */}
          <Col span={24}>
            <div id="flowRecords">
              <FlowRecords
                outerColumns={MEMBER_OUTER_COLUMNS}
                innerColumns={MEMBER_INNER_COLUMNS}
                outerRowkey="id"
                innerRowkey="id"
                outerDataSource={dataSource?.outerHistory}
                innerDataSource={dataSource?.innerHistory}
              />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberProfile
