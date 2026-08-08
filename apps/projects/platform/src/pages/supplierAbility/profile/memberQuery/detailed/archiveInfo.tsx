/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 16:45:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 18:28:03
 * @Description: 会员档案信息
 */
import React, { useEffect, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col, Spin } from 'antd'
import {
  getMemberSupplierAbilityInfoDetailAppraisalPage,
  getMemberSupplierAbilityInfoDetailArchives,
  GetMemberSupplierAbilityInfoDetailArchivesResponse,
  getMemberSupplierAbilityInfoDetailRectifyPage,
  getMemberSupplierAbilityMaintenanceDetailInspectPage,
} from '@apps/apis'
import { GlobalConfig } from '@/global/config'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MemberDocIncomingInfo from '../../../components/MemberDocIncomingInfo'
import MemberDocQualification from '../../../components/MemberDocQualification'
import MemberDocTableList, { ParamsType, ReponseType } from '../../../components/MemberDocTableList'
import { getIncomingInfoAnchorKey } from '../../../utils'

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

const MemberArchiveInfo = (props) => {
  const { validateId } = props
  const [archiveInfo, setArchiveInfo] = useState<GetMemberSupplierAbilityInfoDetailArchivesResponse>()
  const [loading, setLoading] = useState(false)

  const intl = useIntl()

  const getArchiveInfo = () => {
    setLoading(true)
    getMemberSupplierAbilityInfoDetailArchives({
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
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.inspectionColumns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.inspectionColumns.subject' }),
      dataIndex: 'subject',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.inspectionColumns.inspectTypeName' }),
      dataIndex: 'inspectTypeName',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.inspectionColumns.inspectTime' }),
      dataIndex: 'inspectTime',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.inspectionColumns.score' }),
      dataIndex: 'score',
    },
  ]

  const getInspectList = (params: ParamsType): Promise<ReponseType<InspectListItemType>> => {
    return new Promise((resolve, reject) => {
      getMemberSupplierAbilityMaintenanceDetailInspectPage({
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
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.AppraisalColumns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.AppraisalColumns.subject' }),
      dataIndex: 'subject',
      ellipsis: true,
      render: (text, record) => `${text}-${record.name}`,
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.AppraisalColumns.appraisalDayStart' }),
      dataIndex: 'appraisalDayStart',
      render: (text, record) => `${text}`,
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.AppraisalColumns.completeDay' }),
      dataIndex: 'completeDay',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.AppraisalColumns.totalScore' }),
      dataIndex: 'totalScore',
    },
  ]

  const getAppraisalList = (params: ParamsType): Promise<ReponseType<AppraisalListItemType>> => {
    return new Promise((resolve, reject) => {
      getMemberSupplierAbilityInfoDetailAppraisalPage({
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
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.RectifyColumns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.RectifyColumns.subject' }),
      dataIndex: 'subject',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.RectifyColumns.rectifyTimeStart' }),
      dataIndex: 'rectifyTimeStart',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.RectifyColumns.rectifyTimeEnd' }),
      dataIndex: 'rectifyTimeEnd',
    },
    {
      title: intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.RectifyColumns.result' }),
      dataIndex: 'result',
    },
  ]

  const getRectifyList = (params: ParamsType): Promise<ReponseType<RectifyListItemType>> => {
    return new Promise((resolve, reject) => {
      getMemberSupplierAbilityInfoDetailRectifyPage({
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

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
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

        {/* 考评信息 */}
        <Col span={24}>
          <div id="appraisalInfo">
            <MemberDocTableList<AppraisalListItemType>
              title={intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.AppraisalColumns' })}
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
                title={intl.formatMessage({ id: 'member.memberQuery.detailed.archiveInfo.RectifyColumns' })}
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

export default MemberArchiveInfo
