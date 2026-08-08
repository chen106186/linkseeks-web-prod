import React, { useEffect, useMemo, useState } from 'react'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/lib/upload/interface'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Input, ArrayTable, Checkbox, Radio } from '@apps/formily'
import { normalizeFiledata } from '@/utils'
import { authService } from '@apps/services'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import FormilyRangeTime from '@/components/RangeTime/FormilyRangeTime'
import createSchema from './schema'
import { anchorsArr } from './config'
import { createEffects } from './effects'
import createRichTextUtils from '../../common/schemas/createRichTextUtils'
import TagsPaneField from '../../../../components/TagsPaneField'
import AnchorPageItemCard from '../AnchorPageItemCard'
import CustomerSelectField from '../SupplierSelectField'
import CustomerAssessmentProjectField from '../CustomerAssessmentProjectField'
import { convertDataToGroups } from '../CustomerAssessmentProjectForm/utils'
import EvaluationsEvaluatorField, { EvaluatorValueType } from '../EvaluationsEvaluatorField'
import CustomerAssessmentHistoryVirtualField from '../CustomerAssessmentHistoryVirtualField'
import EvaluationsSupplyListVirtualField from '../EvaluationsSupplyListVirtualField'
import EvaluationsAssessmentProjectCtlField, {
  AssessmentProjectCtlValueType,
} from '../EvaluationsAssessmentProjectCtlField'
import EvaluationsStatusTagField from '../EvaluationsStatusTagField'
import moment from 'moment'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const formActions = createFormActions()
const { onFormInit$, onFormInputChange$ } = FormEffectHooks

export type AssessmentProjectItemType = {
  /**
   * 指标分组
   */
  indicatorGrouping: string
  /**
   * 标准指标
   */
  standardIndicator: string
  /**
   * 分值范围
   */
  scoreRange: string
  /**
   * 最小分值
   */
  scoreMin: number
  /**
   * 最大分值
   */
  scoreMax: number
  /**
   * 标准指标说明
   */
  scoreStandard: string
  /**
   * 评分权重
   */
  weight: number
  /**
   * 评分人
   */
  evaluator: EvaluatorValueType
  /**
   * 发送评分人打分0-否1-是
   */
  sendAppraisal: boolean
  /**
   * 评分计分
   */
  grade: string
  /**
   * 得分
   */
  score: string
  /**
   * 评分人反馈
   */
  reviewerFeedback: string
  /**
   * 评分记录附件
   */
  files: UploadFile[]
}

export type FormSubmitValueType = {
  /**
   * 考评主题
   */
  subject: string
  /**
   * 考评开始时间
   */
  appraisalDayStart: string | moment.Moment
  /**
   * 考评结束时间
   */
  appraisalDayEnd: string | moment.Moment
  /**
   * 考评完成时间
   */
  completeDay: string | moment.Moment
  /**
   * 考评结果
   */
  result: string
  /**
   * 附件
   */
  attachments: {
    name: string
    url: string
  }[]
  /**
   * 客户
   */
  name: {
    subMemberId: number
    subRoleId: number
    subMemberName?: string
    name?: string
  }[]
  /**
   * 评分记录控制器
   */
  assessmentProjectCtl?: AssessmentProjectCtlValueType
  /**
   * 评分记录
   */
  assessmentProject?: {
    details: AssessmentProjectItemType[]
  }[]
  /**
   * 总得分
   */
  totalScore: string
  /**
   * 提交审批的状态：0-不通过；1-通过
   */
  scoringResult: number
  /**
   * 考评结果
   */
  scoringResultContent: string
  /**
   * 通知会员考评结果0-否1-是
   */
  notifyMember: boolean
  /**
   * 考评结果附件
   */
  resultAttachments: UploadFile[]
}

export type SubmitCallItemsValueType = Omit<
  AssessmentProjectItemType,
  'scoreRange' | 'evaluator' | 'sendAppraisal' | 'grade' | 'score' | 'files'
> & {
  /**
   * 评分人用户id
   */
  userId: number
  /**
   * 评分人用户名称
   */
  userName?: string
  /**
   * 发送评分人打分0-否1-是
   */
  sendAppraisal: number
  /**
   * 评分计分
   */
  grade: number
  /**
   * 得分
   */
  score: number
  /**
   * 状态0-待打分1-已打分
   */
  status: number
  /**
   * 评分记录附件
   */
  appraisalAttachment: {
    name?: string
    url?: string
  }[]
}

export type SubmitCallValueType = {
  /**
   * 下级会员Id
   */
  subMemberId: number
  /**
   * 下级会员角色Id
   */
  subRoleId: number
  /**
   * 下级会员角色名称
   */
  name?: string
  /**
   * 考评主题
   */
  subject: string
  /**
   * 考评开始时间
   */
  appraisalDayStart: string
  /**
   * 考评结束时间
   */
  appraisalDayEnd: string
  /**
   * 考评完成时间
   */
  completeDay: string
  /**
   * 附件
   */
  attachments: {
    name: string
    url: string
  }[]
  /**
   * 评分项目
   */
  items: SubmitCallItemsValueType[]
  /**
   * 评分结果
   */
  submitVO?: {
    /**
     * 总得分
     */
    totalScore: number
    /**
     * 提交审批的状态：0-不通过；1-通过
     */
    scoringResult: number
    /**
     * 考评结果
     */
    scoringResultContent: string
    /**
     * 通知会员考评结果0-否1-是
     */
    notifyMember: number
    /**
     * 考评结果
     */
    result: string
    /**
     * 考评结果附件
     */
    resultAttachments: {
      name?: string
      url?: string
    }[]
  }
}

interface MemberEvaluationCreationFormProps {
  /**
   * title
   */
  title: string
  /**
   * 数据id
   */
  value?: SubmitCallValueType
  /**
   * 点击保存触发事件
   */
  onSubmit?: (value: SubmitCallValueType) => Promise<void>
  /**
   * 页面模式
   */
  mode?: 'creation' | 'edition' | 'preview'
  /**
   * 是否禁用部分不可以编辑的表单项，默认 false
   */
  cloudy?: boolean
}

const MemberEvaluationCreationForm: React.FC<MemberEvaluationCreationFormProps> = (props) => {
  const { title, value, onSubmit, mode = 'creation', cloudy = false } = props
  const intl = useIntl()
  const translate = useWebIntl()
  const userInfo = useMemo(() => authService.getAuth(), [])

  const [formValue, setFormValue] = useState<FormSubmitValueType | undefined>({
    notifyMember: true,
    scoringResult: 1,
  } as unknown as FormSubmitValueType)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  useEffect(() => {
    if (value) {
      const {
        subMemberId,
        subRoleId,
        name,
        appraisalDayStart,
        appraisalDayEnd,
        completeDay,
        items,
        submitVO,
        ...rest
      } = value
      const indicatorGroups = convertDataToGroups(items)
      // 设置考评项目Ctl的值，会触发 effects 从而设置 assessmentProject 相关值
      const assessmentProjectCtl: AssessmentProjectCtlValueType = indicatorGroups.map((item) => ({
        groupName: item.groupName,
        elements: item.details,
      }))
      setFormValue({
        ...rest,
        appraisalDayStart: moment(appraisalDayStart, 'YYYY-MM-DD'),
        appraisalDayEnd: moment(appraisalDayEnd, 'YYYY-MM-DD'),
        completeDay: mode === 'creation' ? moment(completeDay, 'YYYY-MM-DD') : completeDay,
        name: [
          {
            subMemberId,
            subRoleId,
            subMemberName: name,
          },
        ],
        assessmentProjectCtl: assessmentProjectCtl,
        ...submitVO,
        totalScore: submitVO?.totalScore ? `${submitVO.totalScore}` : '',
        scoringResult: submitVO?.scoringResult !== undefined ? submitVO.scoringResult : 1,
        scoringResultContent: submitVO?.scoringResultContent,
        notifyMember: submitVO?.notifyMember !== undefined ? Boolean(submitVO.notifyMember) : true,
        resultAttachments: submitVO?.resultAttachments
          ? submitVO.resultAttachments.map((item) => normalizeFiledata(item.url))
          : [],
      })
    }
  }, [value])

  const handleSubmit = (values: FormSubmitValueType) => {
    const {
      subject,
      appraisalDayStart,
      appraisalDayEnd,
      completeDay,
      attachments,
      name,
      assessmentProject,
      totalScore,
      scoringResult,
      scoringResultContent,
      notifyMember,
      result,
      resultAttachments,
    } = values

    const items: SubmitCallValueType['items'] = []

    assessmentProject?.forEach((item) => {
      item.details?.forEach((detail) => {
        items.push({
          indicatorGrouping: detail.indicatorGrouping,
          standardIndicator: detail.standardIndicator,
          scoreMin: detail.scoreMin,
          scoreMax: detail.scoreMax,
          scoreStandard: detail.scoreStandard,
          weight: detail.weight,
          userId: detail.evaluator[0]?.userId,
          sendAppraisal: detail.sendAppraisal ? 1 : 0,
          grade: detail.grade ? +detail.grade : undefined,
          score: detail.score ? +detail.score : undefined,
          status: detail.sendAppraisal ? 0 : 1,
          reviewerFeedback: detail.reviewerFeedback,
          appraisalAttachment: detail.files?.map((file) => ({
            name: file.name,
            url: file.url,
          })),
        })
      })
    })

    const someSendAppraisal = assessmentProject.some((item) => item.details.some((detail) => detail.sendAppraisal))

    if (onSubmit) {
      setSubmitLoading(true)
      const mergedValue: SubmitCallValueType = {
        subject,
        appraisalDayStart: moment(appraisalDayStart).format('YYYY-MM-DD'),
        appraisalDayEnd: moment(appraisalDayEnd).format('YYYY-MM-DD'),
        completeDay: moment(completeDay).format('YYYY-MM-DD'),
        attachments,
        subMemberId: name[0]?.subMemberId,
        subRoleId: name[0]?.subRoleId,
        items,
        submitVO: !someSendAppraisal
          ? {
              totalScore: totalScore ? +totalScore : undefined,
              scoringResult: scoringResult,
              scoringResultContent: scoringResultContent,
              notifyMember: notifyMember ? 1 : 0,
              result,
              resultAttachments: resultAttachments?.map((item) => ({
                name: item.name,
                url: item.url,
              })),
            }
          : undefined,
      }
      onSubmit(mergedValue)
        .then(() => {
          setUnsaved(false)
        })
        .finally(() => {
          setSubmitLoading(false)
        })
    }
  }

  return (
    <div className={styles['role-rule-config-form']}>
      <PageHeaderWrapper
        title={title}
        items={anchorsArr}
        extra={[
          mode !== 'preview' ? (
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => formActions.submit()}
            >
              {translate('web.common.save')}
            </Button>
          ) : null,
        ]}
      >
        <NiceForm
          previewPlaceholder=" "
          onSubmit={handleSubmit}
          actions={formActions}
          initialValues={formValue}
          components={{
            TextArea: Input.TextArea,
            ArrayTable,
            Checkbox,
            RadioGroup: Radio.Group,
            FormilyUploadFiles,
            FormilyRangeTime,
            AnchorPageItemCard,
            CustomerSelect: CustomerSelectField,
            CustomerAssessmentProject: CustomerAssessmentProjectField,
            CustomerAssessmentHistory: CustomerAssessmentHistoryVirtualField,
            EvaluationsSupplyList: EvaluationsSupplyListVirtualField,
            EvaluationsEvaluator: EvaluationsEvaluatorField,
            EvaluationsAssessmentProjectCtl: EvaluationsAssessmentProjectCtlField,
            EvaluationsStatusTag: EvaluationsStatusTagField,
            TagsPane: TagsPaneField,
          }}
          expressionScope={{
            ...createRichTextUtils(),
          }}
          effects={($, actions) => {
            createEffects($, actions)

            onFormInit$().subscribe(() => {
              if (mode !== 'creation') {
                actions.setFieldState('*(subject,name,completeDay,attachments)', (state) => {
                  state.editable = false
                })
              }

              if (cloudy) {
                actions.setFieldState(
                  '*(changeRequestSummary,name,assessmentProjectCtl,targetLifecycleStageId,remark)',
                  (state) => {
                    state.editable = false
                  },
                )
                actions.setFieldState('*(assessmentProjectCtl)', (state) => {
                  state.visible = false
                })
              }

              // 设置考评项目 考评人默认当前用户
              actions.setFieldState('assessmentProject.*.details.*.evaluator', (fieldState) => {
                fieldState.value = [
                  {
                    userId: userInfo.userId,
                    userName: userInfo.userName,
                  },
                ]
              })
            })

            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })
          }}
          schema={createSchema(mode)}
          editable={mode !== 'preview'}
        />
      </PageHeaderWrapper>
    </div>
  )
}

export default MemberEvaluationCreationForm
