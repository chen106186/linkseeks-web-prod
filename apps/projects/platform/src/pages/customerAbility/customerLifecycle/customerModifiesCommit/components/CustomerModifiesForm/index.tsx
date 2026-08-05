/*
 * @Description: 新增/修改 平台会员等级
 */
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
import createSchema from './schema'
import { anchorsArr } from './config'
import { createEffects } from './effects'
import createRichTextUtils from '../../../common/schemas/createRichTextUtils'
import TagsPaneField from '../../../../components/TagsPaneField'
import AnchorPageItemCard from '../AnchorPageItemCard'
import CustomerSelectField from '../CustomerSelectField'
import CustomerAssessmentProjectField from '../../../components/CustomerAssessmentProjectField'
import { convertDataToGroups } from '../../../components/CustomerAssessmentProjectForm/utils'
import ModifiesEvaluatorField, { EvaluatorValueType } from '../../../components/ModifiesEvaluatorField'
import CustomerAssessmentHistoryVirtualField from '../CustomerAssessmentHistoryVirtualField'
import ModifiesSupplyListVirtualField from '../ModifiesSupplyListVirtualField'
import ModifiesAssessmentProjectCtlField, { AssessmentProjectCtlValueType } from '../ModifiesAssessmentProjectCtlField'
import ModifiesStatusTagField from '../ModifiesStatusTagField'
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
   * 变更申请单摘要
   */
  changeRequestSummary: string
  /**
   * 待变更目标阶段
   */
  targetLifecycleStageId: number
  /**
   * 客户
   */
  subMember: {
    subMemberId: number
    subRoleId: number
    subMemberName: string
    onlyId?: string
    currentLifecycleStageName: string
    currentLifecycleStageId: number
  }[]
  /**
   * 当前阶段
   */
  currentLifecycleStage?: number
  /**
   * 当前阶段id
   */
  currentLifecycleStageId?: number
  /**
   * 备注
   */
  remark: string
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
  subMemberName?: string
  /**
   * 当前生命周期
   */
  currentLifecycleStageId: number
  /**
   * 当前生命周期名称
   */
  currentLifecycleStageName?: string
  /**
   * 目标生命周期
   */
  targetLifecycleStageId: number
  /**
   * 变更申请单摘要
   */
  changeRequestSummary: string
  /**
   * 备注
   */
  remark: string
  /**
   * 评分项目
   */
  items: SubmitCallItemsValueType[]
  /**
   * 评分结果
   */
  submitVO: {
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
     * 考评结果附件
     */
    resultAttachments: {
      name?: string
      url?: string
    }[]
  }
}
interface CustomerModifiesFormProps {
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
   * 是否可编辑的，默认 true
   */
  editable?: boolean
  /**
   * 是否禁用部分不可以编辑的表单项，默认 false
   */
  cloudy?: boolean
}

const CustomerModifiesForm: React.FC<CustomerModifiesFormProps> = (props) => {
  const { title, value, onSubmit, editable = true, cloudy = false } = props
  const userInfo = useMemo(() => authService.getAuth(), [])
  const intl = useIntl()

  const [formValue, setFormValue] = useState<FormSubmitValueType | undefined>({
    notifyMember: true,
    scoringResult: 1,
  } as unknown as FormSubmitValueType)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const translate = useWebIntl()

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
        subMemberName,
        currentLifecycleStageName,
        currentLifecycleStageId,
        items,
        submitVO,
        ...rest
      } = value
      const indicatorGroups = convertDataToGroups(items)
      // 设置考评项目Ctl的值，会触发 effects 从而设置 assessmentProject 相关值
      const assessmentProjectCtl: AssessmentProjectCtlValueType = indicatorGroups.length
        ? indicatorGroups.map((item) => ({
            groupName: item.groupName,
            elements: item.details,
          }))
        : undefined
      // const assessmentProject: FormSubmitValueType['assessmentProject'] = indicatorGroups.map((item) => ({
      //   details: item.details,
      // }));
      setFormValue({
        ...rest,
        subMember: [
          {
            subMemberId,
            subRoleId,
            subMemberName,
            onlyId: `${subMemberId}+${subRoleId}`,
            currentLifecycleStageName,
            currentLifecycleStageId,
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
      subMember,
      currentLifecycleStageId,
      targetLifecycleStageId,
      changeRequestSummary,
      remark,
      assessmentProject,
      totalScore,
      scoringResult,
      scoringResultContent,
      notifyMember,
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
        subMemberId: subMember[0]?.subMemberId,
        subRoleId: subMember[0]?.subRoleId,
        currentLifecycleStageId,
        targetLifecycleStageId,
        changeRequestSummary,
        remark,
        items,
        submitVO: !someSendAppraisal
          ? {
              totalScore: totalScore ? +totalScore : undefined,
              scoringResult: scoringResult,
              scoringResultContent: scoringResultContent,
              notifyMember: notifyMember ? 1 : 0,
              resultAttachments: resultAttachments?.map((item) => ({
                name: item.name,
                url: item.url,
              })),
            }
          : undefined,
      }
      console.log('mergedValuemergedValue', mergedValue)
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
          editable ? (
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
            AnchorPageItemCard,
            CustomerSelect: CustomerSelectField,
            CustomerAssessmentProject: CustomerAssessmentProjectField,
            CustomerAssessmentHistory: CustomerAssessmentHistoryVirtualField,
            ModifiesSupplyList: ModifiesSupplyListVirtualField,
            ModifiesEvaluator: ModifiesEvaluatorField,
            ModifiesAssessmentProjectCtl: ModifiesAssessmentProjectCtlField,
            ModifiesStatusTag: ModifiesStatusTagField,
            TagsPane: TagsPaneField,
          }}
          expressionScope={{
            // renderAssessmentProjectRemove,
            ...createRichTextUtils(),
          }}
          effects={($, actions) => {
            createEffects($, actions)

            onFormInit$().subscribe(() => {
              if (cloudy) {
                actions.setFieldState(
                  '*(changeRequestSummary,subMember,assessmentProjectCtl,targetLifecycleStageId,remark)',
                  (state) => {
                    state.editable = false
                  },
                )
                actions.setFieldState('*(assessmentProjectCtl)', (state) => {
                  state.visible = false
                })
              }
            })

            // 设置考评项目 考评人默认当前用户
            actions.setFieldState('assessmentProject.*.details.*.evaluator', (fieldState) => {
              fieldState.value = [
                {
                  userId: userInfo.userId,
                  userName: userInfo.userName,
                },
              ]
            })

            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })
          }}
          schema={createSchema(editable)}
          editable={!!editable}
        />
      </PageHeaderWrapper>
    </div>
  )
}

export default CustomerModifiesForm
