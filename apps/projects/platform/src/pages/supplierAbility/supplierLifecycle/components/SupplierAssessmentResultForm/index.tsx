/*
 * @Description: 考评项目表单
 */
import React, { useEffect, useImperativeHandle, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { createAsyncFormActions, FormEffectHooks } from '@apps/formily'
import { UploadFile } from 'antd/lib/upload/interface'
import { Checkbox, Input, Radio } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import MellowCard from '@/components/MellowCard'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import { createSchema } from './schema'
import createRichTextUtils from '../../common/schemas/createRichTextUtils'
import { useWebIntl } from '@apps/locales'

const formActions = createAsyncFormActions()
const { onFormInit$, onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

export type FormSubmitValueType = {
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

export type ARSubmitValueType = {
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

export type ValueType = {
  /**
   * 最终评分分数
   */
  totalScore: string
}

export interface SupplierAssessmentResultFormProps {
  /**
   * 值
   */
  value?: ValueType
  /**
   * submit触发事件
   */
  onSubmit?: (values: ARSubmitValueType) => void | Promise<void>
  /**
   * 点击完成触发事件
   */
  onFinish?: () => void
  /**
   * 是否可编辑的
   */
  editable?: boolean
}

export type SupplierAssessmentResultFormRef = {
  /**
   * 触发表单 submit 事件
   */
  submit: () => void
}

const SupplierAssessmentResultForm: React.ForwardRefRenderFunction<
  SupplierAssessmentResultFormRef,
  SupplierAssessmentResultFormProps
> = (props, ref) => {
  const { value, onSubmit, onFinish, editable } = props
  const translate = useWebIntl()

  const [formValue, setFormValue] = useState<FormSubmitValueType | undefined>({
    notifyMember: true,
    scoringResult: 1,
  } as unknown as FormSubmitValueType)

  const intl = useIntl()

  useEffect(() => {
    if ('value' in props && value) {
      setFormValue({
        ...formValue,
        ...value,
      })
    }
  }, [value])

  const handleSubmit = (values: FormSubmitValueType) => {
    if (onSubmit) {
      const { totalScore, scoringResult, scoringResultContent, notifyMember, resultAttachments } = values
      onSubmit?.({
        submitVO: {
          totalScore: totalScore ? +totalScore : undefined,
          scoringResult: scoringResult,
          scoringResultContent: scoringResultContent,
          notifyMember: notifyMember ? 1 : 0,
          resultAttachments: resultAttachments?.map((item) => ({
            name: item.name,
            url: item.url,
          })),
        },
      })
    }
  }

  useImperativeHandle(ref, () => ({
    submit: () => formActions.submit(),
  }))

  return (
    <MellowCard title={translate('web.resource.member.kaopinjieguo')}>
      <NiceForm
        previewPlaceholder=" "
        value={formValue}
        components={{
          TextArea: Input.TextArea,
          Checkbox,
          RadioGroup: Radio.Group,
          FormilyUploadFiles,
        }}
        expressionScope={{
          ...createRichTextUtils(),
        }}
        effects={($, { setFieldState, getFieldValue }) => {
          // 评分结果 联动 原因
          onFieldValueChange$('scoringResult').subscribe((state) => {
            const { value } = state
            setFieldState('scoringResultContent', (fieldState) => {
              fieldState.required = value === 0
              setTimeout(() => {
                formActions.validate('scoringResultContent')
              }, 0)
            })
          })
        }}
        actions={formActions}
        schema={createSchema()}
        onSubmit={handleSubmit}
      />
    </MellowCard>
  )
}

const SupplierAssessmentResultFormForWard = React.forwardRef<
  SupplierAssessmentResultFormRef,
  SupplierAssessmentResultFormProps
>(SupplierAssessmentResultForm)

export default SupplierAssessmentResultFormForWard
