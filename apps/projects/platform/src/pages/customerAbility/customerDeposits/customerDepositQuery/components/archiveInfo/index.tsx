/*
 * @Description: 客户档案信息
 */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Spin, message } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberCustomerAbilityMaintenanceDetailAppraisalPage,
  getMemberCustomerAbilityMaintenanceDetailInspectPage,
  getMemberCustomerAbilityMaintenanceDetailRecord,
  GetMemberCustomerAbilityMaintenanceDetailRecordResponse,
  getMemberCustomerAbilityMaintenanceDetailRectifyPage,
  postMemberCustomerAbilityMaintenanceDetailRecordClassifyUpdate,
} from '@apps/apis'
import { GlobalConfig } from '@/global/config'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { getIncomingInfoAnchorKey } from '../../../../utils'
import MemberDetailsContext from '../../../../memberDetailsContext'
import MemberDocCategoryPro, {
  MemberDocCategoryProProps,
  MemberDocCategoryProRef,
} from '../../../../components/MemberDocCategoryPro'
import MemberDocIncomingInfo from '../../../../components/MemberDocIncomingInfo'
import MemberDocQualification from '../../../../components/MemberDocQualification'
import MemberDocTableList, { ParamsType, ReponseType } from '../../../../components/MemberDocTableList'

export type InspectListItemType = {
  /**
   * 主键id
   */
  id: number
  /**
   * 考察主题
   */
  subject: string
  /**
   * 考察类型枚举1-入库考察2-整改考察3-计划考察4-其他考察
   */
  inspectType: number
  /**
   * 考察类型名称
   */
  inspectTypeName: string
  /**
   * 考察日期，格式为yyyy-MM-dd
   */
  inspectTime: string
  /**
   * 考察评分
   */
  score: string
}

export type AppraisalListItemType = {
  /**
   * 主键id
   */
  id: number
  /**
   * 考评主题
   */
  subject: string
  /**
   * 下级会员名称
   */
  name: string
  /**
   * 考评时间开始，格式为yyyy-MM-dd
   */
  appraisalDayStart: string
  /**
   * 考评时间结束，格式为yyyy-MM-dd
   */
  appraisalDayEnd: string
  /**
   * 考评完成时间，格式为yyyy-MM-dd
   */
  completeDay: string
  /**
   * 总得分
   */
  totalScore: string
}

export type RectifyListItemType = {
  /**
   * 主键id
   */
  id: number
  /**
   * 整改主题
   */
  subject: string
  /**
   * 整改期限开始，格式为yyyy-MM-dd
   */
  rectifyTimeStart: string
  /**
   * 整改期限结束，格式为yyyy-MM-dd
   */
  rectifyTimeEnd: string
  /**
   * 整改结果
   */
  result: string
}

const CustomerArchivesInfo = (props) => {
  const { validateId } = props
  const [archiveInfo, setArchiveInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailRecordResponse>()
  const [loading, setLoading] = useState(false)

  const contenxt = useContext(MemberDetailsContext)

  const categoryFormRef = useRef<MemberDocCategoryProRef | null>(null)

  const intl = useIntl()

  const getArchiveInfo = () => {
    setLoading(true)
    getMemberCustomerAbilityMaintenanceDetailRecord({
      validateId,
    })
      .then((res) => {
        if (res.code === 1000) {
          setArchiveInfo(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const inspectionColumns: EditableColumns<InspectListItemType>[] = [
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.inspect.index' }),
      dataIndex: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.inspect.subject' }),
      dataIndex: 'subject',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.inspect.inspectTypeName' }),
      dataIndex: 'inspectTypeName',
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.inspect.inspectTime' }),
      dataIndex: 'inspectTime',
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.inspect.score' }),
      dataIndex: 'score',
    },
  ]

  const getInspectList = (params: ParamsType): Promise<ReponseType<InspectListItemType>> => {
    return new Promise((resolve, reject) => {
      getMemberCustomerAbilityMaintenanceDetailInspectPage({
        validateId,
        ...params,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const AppraisalColumns: EditableColumns<AppraisalListItemType>[] = [
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.appraisal.index' }),
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.appraisal.subject' }),
      dataIndex: 'subject',
      ellipsis: true,
      render: (text, record) => `${text}-${record.name}`,
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.appraisal.appraisalDayStart' }),
      dataIndex: 'appraisalDayStart',
      render: (text, record) => `${text}`,
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.appraisal.completeDay' }),
      dataIndex: 'completeDay',
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.appraisal.totalScore' }),
      dataIndex: 'totalScore',
    },
  ]

  const getAppraisalList = (params: ParamsType): Promise<ReponseType<AppraisalListItemType>> => {
    return new Promise((resolve, reject) => {
      getMemberCustomerAbilityMaintenanceDetailAppraisalPage({
        validateId,
        ...params,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const RectifyColumns: EditableColumns<RectifyListItemType>[] = [
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.rectify.index' }),
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.rectify.subject' }),
      dataIndex: 'subject',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.rectify.rectifyTimeStart' }),
      dataIndex: 'rectifyTimeStart',
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.rectify.rectifyTimeEnd' }),
      dataIndex: 'rectifyTimeEnd',
    },
    {
      title: intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.rectify.result' }),
      dataIndex: 'result',
    },
  ]

  const getRectifyList = (params: ParamsType): Promise<ReponseType<RectifyListItemType>> => {
    return new Promise((resolve, reject) => {
      getMemberCustomerAbilityMaintenanceDetailRectifyPage({
        validateId,
        ...params,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  useEffect(() => {
    getArchiveInfo()
  }, [])

  useEffect(() => {
    const anchors = [
      {
        key: 'categoryInfo',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.categoryInfo' }),
      },
      ...(archiveInfo?.depositDetails
        ? archiveInfo?.depositDetails?.map((item, index) => ({
            key: getIncomingInfoAnchorKey(index),
            name: item.groupName,
          }))
        : []),
      {
        key: 'qualitiesInfo',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.qualitiesInfo' }),
      },
      {
        key: 'inspectInfo',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.inspectInfo' }),
      },
      {
        key: 'appraisalInfo',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.appraisalInfo' }),
      },
      {
        key: 'rectifyInfo',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.rectifyInfo' }),
      },
    ].filter(Boolean)
    contenxt.onAnchorsReady(anchors)
  }, [archiveInfo])

  const handleFinish = () => {
    categoryFormRef.current?.submit()
  }

  const handleCategorySubmit: MemberDocCategoryProProps['onSubmit'] = (values) =>
    new Promise((resolve, reject) => {
      const payload = {
        validateId: +validateId,
        ...values,
      }
      const msg = message.loading({
        content: intl.formatMessage({ id: 'member.components.MemberDocCategory.edit.message' }),
        duration: 0,
      })
      postMemberCustomerAbilityMaintenanceDetailRecordClassifyUpdate(payload, {
        timeout: 0,
      })
        .then((res) => {
          if (res.code !== 1000) {
            reject()
            return
          }
          resolve()
          getArchiveInfo()
        })
        .catch((err) => {
          reject(err)
          console.warn(err)
        })
        .finally(() => {
          msg()
        })
    })

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        {/* 分类信息 */}
        <Col span={24}>
          <div id="categoryInfo">
            <MemberDocCategoryPro
              value={archiveInfo?.classification as any}
              validateId={validateId}
              onFinish={handleFinish}
              onSubmit={handleCategorySubmit}
              ref={categoryFormRef}
            />
          </div>
        </Col>

        {/* 入库信息 */}
        {archiveInfo?.depositDetails.map((item, index) => (
          <Col span={24} key={index}>
            <div id={getIncomingInfoAnchorKey(index)}>
              <MemberDocIncomingInfo groupData={item} />
            </div>
          </Col>
        ))}

        {/* 资质证明 */}
        <Col span={24}>
          <div id="qualitiesInfo">
            <MemberDocQualification dataSource={archiveInfo?.qualities} />
          </div>
        </Col>

        {/* 考察信息 */}
        <Col span={24}>
          <div id="inspectInfo">
            <MemberDocTableList<InspectListItemType>
              title={intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.inspect' })}
              columns={inspectionColumns}
              fetchList={getInspectList}
            />
          </div>
        </Col>

        {/* 考评信息 */}
        <Col span={24}>
          <div id="appraisalInfo">
            <MemberDocTableList<AppraisalListItemType>
              title={intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.appraisal' })}
              columns={AppraisalColumns}
              fetchList={getAppraisalList}
            />
          </div>
        </Col>

        {/* 整改信息 */}
        {!GlobalConfig.global.siteInfo.enableMultiTenancy && (
          <Col span={24}>
            <div id="rectifyInfo">
              <MemberDocTableList<RectifyListItemType>
                title={intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo.rectify' })}
                columns={RectifyColumns}
                fetchList={getRectifyList}
              />
            </div>
          </Col>
        )}
      </Row>
    </Spin>
  )
}

export default CustomerArchivesInfo
