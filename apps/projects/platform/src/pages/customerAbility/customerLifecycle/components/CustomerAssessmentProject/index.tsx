/**
 * @Description: 考评项目
 */
import React, { useEffect, useState, useMemo } from 'react'
import type { ColumnsType } from 'antd/lib/table'
import MellowCard from '@/components/MellowCard'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import type { TagsTableDataType } from '../../../components/TagsTable'
import TagsTable from '../../../components/TagsTable'
import { convertDataToGroups } from '../CustomerAssessmentProjectForm/utils'
import { useWebIntl } from '@apps/locales'

interface CustomerAssessmentProjectProps {
  /**
   * 数据
   */
  data: {
    /**
     * 评分项id
     */
    id: number
    /**
     * 指标分组
     */
    indicatorGrouping: string
    /**
     * 标准指标
     */
    standardIndicator: string
    /**
     * 最小分值
     */
    scoreMin: number
    /**
     * 最大分值
     */
    scoreMax: number
    /**
     * 分值标准
     */
    scoreStandard: string
    /**
     * 评分权重
     */
    weight: number
    /**
     * 评分人id
     */
    userId: number
    /**
     * 评分人姓名
     */
    userName: string
    /**
     * 发送评分人打分0-否1-是
     */
    sendAppraisal: number
    /**
     * 状态0-待打分1-已打分
     */
    status: number
    /**
     * 评分计分
     */
    grade: number
    /**
     * 得分
     */
    score: number
    /**
     * 评分人反馈
     */
    reviewerFeedback: string
    /**
     * 评分记录附件 ,FileVO
     */
    appraisalAttachment: {
      /**
       * 文件名称
       */
      name?: string
      /**
       * 文件Url
       */
      url?: string
    }[]
  }[]
}

const CustomerAssessmentProject: React.FC<CustomerAssessmentProjectProps> = (props) => {
  const { data } = props

  const [tagsTableData, setTagsTableData] = useState<TagsTableDataType<any>>([])
  const translate = useWebIntl()
  useEffect(() => {
    if (data) {
      const indicatorGroups = convertDataToGroups(data)
      setTagsTableData(
        indicatorGroups.map((item, index) => ({
          name: item.groupName,
          key: `${index}`,
          dataSource: item.details,
        })),
      )
    }
  }, [data])

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: translate('web.resource.member.biaozhunzhibiao'),
        dataIndex: 'standardIndicator',
      },
      {
        title: translate('web.resource.member.fenzhifanwei'),
        dataIndex: 'scoreMin',
        render: (text, record) => `${text}~${record.scoreMax}`,
      },
      {
        title: translate('web.resource.commodity.fenzhibiaozhun'),
        dataIndex: 'scoreStandard',
      },
      {
        title: translate('web.resource.member.pingfenren'),
        dataIndex: 'evaluator',
        render: (text) => text?.[0]?.userName || '',
      },
      {
        title: translate('web.resource.member.fasongpingfenrendafen'),
        dataIndex: 'sendAppraisal',
        render: (text) => (text ? translate('web.common.shi') : translate('web.common.fou')),
      },
      {
        title: translate('web.resource.commodity.quanzhong'),
        dataIndex: 'weight',
        render: (text) => (text ? `${text}%` : ''),
      },
      {
        title: translate('web.resource.member.pingfen'),
        dataIndex: 'grade',
      },
      {
        title: translate('web.resource.member.quanzhongdefen'),
        dataIndex: 'score',
      },
      {
        title: translate('web.resource.member.pingfenrenfankui'),
        dataIndex: 'reviewerFeedback',
      },
      {
        title: translate('web.resource.member.fujian'),
        dataIndex: 'files',
        render: (text) => (
          <UploadFiles
            fileList={text || []}
            containerStyle={{
              width: 180,
            }}
            disable
          />
        ),
      },
    ],
    [],
  )

  return (
    <MellowCard title={translate('web.resource.member.kaopinxiangmu')}>
      <TagsTable columns={columns} rowKey="id" data={tagsTableData} />
    </MellowCard>
  )
}

export default CustomerAssessmentProject
