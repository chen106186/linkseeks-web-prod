/*
 * @Description: 考评项目表单
 */
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { UploadFile } from 'antd/lib/upload/interface'
import NiceForm from '@/components/NiceForm'
import MellowCard from '@/components/MellowCard'
import { createAsyncFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { ArrayTable, Checkbox } from '@apps/formily'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import TagsPaneField from '../../../components/TagsPaneField'
import ModifiesEvaluatorField, { EvaluatorValueType } from '../ModifiesEvaluatorField'
import { createSchema } from './schema'
import { convertDataToGroups } from './utils'
import { useWebIntl } from '@apps/locales'

const formActions = createAsyncFormActions()
const { onFormInit$, onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

export type AssessmentProjectItemType = {
  /**
   * 项目id
   */
  id?: number
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
   * 评分记录
   */
  assessmentProject?: {
    details: AssessmentProjectItemType[]
  }[]
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

export type APSubmitValueType = {
  /**
   * 评分项目
   */
  items: SubmitCallItemsValueType[]
}

export type ValueType = APSubmitValueType['items']

export interface CustomerAssessmentProjectFormProps {
  /**
   * 值
   */
  value?: ValueType
  /**
   * submit触发事件
   */
  onSubmit?: (values: APSubmitValueType) => void | Promise<void>
  /**
   * 是否评分人评分
   */
  rater: boolean
  /**
   * 是否汇总的，默认 false
   */
  summay?: boolean
  /**
   * 最终分数计算回调
   */
  onComputeTotal?: (total: string) => void
}

export type CustomerAssessmentProjectFormRef = {
  /**
   * 触发表单 submit 事件
   */
  submit: () => void
}

const CustomerAssessmentProjectForm: React.ForwardRefRenderFunction<
  CustomerAssessmentProjectFormRef,
  CustomerAssessmentProjectFormProps
> = (props, ref) => {
  const { value, onSubmit, rater, summay = false, onComputeTotal } = props

  const [formValue, setFormValue] = useState<FormSubmitValueType | undefined>(undefined)

  const translate = useWebIntl()

  useEffect(() => {
    if ('value' in props && value) {
      const indicatorGroups = convertDataToGroups(value)
      const tags = indicatorGroups.map((item, index) => ({
        key: `${index}`,
        name: item.groupName,
      }))
      const assessmentProject: FormSubmitValueType['assessmentProject'] = indicatorGroups.map((item) => ({
        details: item.details,
      }))
      setFormValue({
        assessmentProject,
      })
      formActions.setFieldState('assessmentProject', (state) => {
        FormPath.setIn(state, 'props.x-component-props.tags', tags)
        FormPath.setIn(state, 'visible', true)
      })
    }
  }, [value])

  const handleSubmit = (values: FormSubmitValueType) => {
    if (onSubmit) {
      const { assessmentProject } = values
      const items = []

      assessmentProject?.forEach((item) => {
        item.details?.forEach((detail) => {
          items.push({
            id: detail.id,
            grade: detail.grade ? +detail.grade : undefined,
            score: detail.score ? +detail.score : undefined,
            reviewerFeedback: detail.reviewerFeedback,
            appraisalAttachment: detail.files?.map((file) => ({
              name: file.name,
              url: file.url,
            })),
          })
        })
      })
      onSubmit?.({
        items,
      })
    }
  }

  useImperativeHandle(ref, () => ({
    submit: () => formActions.submit(),
  }))

  return (
    <MellowCard title={translate('web.resource.member.kaopinxiangmu')}>
      <NiceForm
        previewPlaceholder=" "
        value={formValue}
        components={{
          ArrayTable,
          Checkbox,
          FormilyUploadFiles,
          ModifiesEvaluator: ModifiesEvaluatorField,
          TagsPane: TagsPaneField,
        }}
        effects={($, { setFieldState, getFieldValue }) => {
          // 考评计分 联动 自身校验规则
          onFieldValueChange$('assessmentProject.*.details.*.grade').subscribe(async (state) => {
            const { name, value } = state

            const scoreRange = await getFieldValue(
              FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.scoreRange`),
            )
            const scoreWeight = await getFieldValue(
              FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.weight`),
            )
            if (!scoreRange) {
              return
            }
            const [scoreMin, scoreMax] = scoreRange.split('~')

            let scoreLegal = true

            setFieldState(
              FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.grade`),
              (fieldState) => {
                if (+value > scoreMax || +value < scoreMin) {
                  fieldState.errors = [translate('web.resource.member.pingfenyingzaifanweinei', { range: scoreRange })]
                  scoreLegal = false
                } else {
                  fieldState.errors = []
                }
              },
            )
            // 设置权重得分
            if (scoreWeight && scoreLegal) {
              setFieldState(
                FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.score`),
                (fieldState) => {
                  fieldState.value = ((scoreWeight / 100) * +value).toFixed(1)
                },
              )
              const assessmentProjectValue = await getFieldValue('assessmentProject')
              // 设置最终评分得分
              // setFieldState(
              //   'totalScore',
              //   fieldState => {
              //     fieldState.value = assessmentProjectValue.reduce(
              //       (pre, now) => (
              //         now.details.reduce(
              //           (pre2, now2) => +(now2.score || 0) + pre2,
              //           0,
              //         ) + pre
              //       ),
              //       0,
              //     ).toFixed(2);
              //   }
              // );
              const total = assessmentProjectValue
                .reduce((pre, now) => now.details.reduce((pre2, now2) => +(now2.score || 0) + pre2, 0) + pre, 0)
                .toFixed(2)
              onComputeTotal?.(total)
            }
          })
        }}
        actions={formActions}
        schema={createSchema(rater, !!summay)}
        onSubmit={handleSubmit}
      />
    </MellowCard>
  )
}

const CustomerAssessmentProjectFormForWard = React.forwardRef<
  CustomerAssessmentProjectFormRef,
  CustomerAssessmentProjectFormProps
>(CustomerAssessmentProjectForm)

export default CustomerAssessmentProjectFormForWard
