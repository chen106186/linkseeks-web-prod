/*
 * @Description: 联动逻辑相关
 */
import { authService } from '@apps/services'
import { FormEffectHooks, FormPath, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { AssessmentProjectCtlValueType } from '../../ModifiesAssessmentProjectCtlField'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions

  // 供应商 联动 当前阶段
  onFieldValueChange$('subMember').subscribe((state) => {
    const { value } = state
    const member = value?.[0]
    setFieldValue('currentLifecycleStageName', member?.currentLifecycleStageName)
    setFieldValue('currentLifecycleStageId', member?.currentLifecycleStageId)

    // 联动 变更申请单摘要
    let changeRequestSummaryInputed = true
    getFieldState('changeRequestSummary', (fieldState) => {
      changeRequestSummaryInputed = fieldState.inputed
    })
    const targetLifecycleStageName = getFieldValue('targetLifecycleStageName')
    if (member && !changeRequestSummaryInputed && targetLifecycleStageName) {
      setFieldValue(
        'changeRequestSummary',
        `${member.subMemberName}${member.currentLifecycleStageName}转${targetLifecycleStageName}变更申请单`,
      )
    }

    // 联动考评历史
    if (member) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setFieldState('ASSESSMENT_HISTORY_LIST', (state) => {
        FormPath.setIn(state, 'props.x-component-props.subMemberId', member.subMemberId)
        FormPath.setIn(state, 'props.x-component-props.subRoleId', member.subRoleId)
      })
    }
  })

  // 待变更目标阶段 联动 待变更目标阶段名称
  onFieldInputChange$('targetLifecycleStageId').subscribe((state) => {
    const { value, props } = state
    const current = props.enum?.find((item) => item.value === value)
    if (!current) {
      return
    }
    setFieldValue('targetLifecycleStageName', current.label)
    // 联动 变更申请单摘要
    let changeRequestSummaryInputed = true
    getFieldState('changeRequestSummary', (fieldState) => {
      changeRequestSummaryInputed = fieldState.inputed
    })
    const [member] = getFieldValue('subMember') || []
    if (!changeRequestSummaryInputed && member) {
      setFieldValue(
        'changeRequestSummary',
        `${member.subMemberName}${member.currentLifecycleStageName}转${current.label}变更申请单`,
      )
    }
  })

  // 考评项目控制器 联动 考评项目
  onFieldValueChange$('assessmentProjectCtl').subscribe((state) => {
    const { value }: { value: AssessmentProjectCtlValueType } = state
    const userInfo = authService.getAuth()

    const tags = value?.map((item, index) => ({
      key: index,
      name: item.groupName,
    }))
    const newValue = value?.map((item) => ({
      details: item.elements?.map((groupItem) => ({
        ...groupItem,
        indicatorGrouping: groupItem.indicatorGrouping,
        standardIndicator: groupItem.standardIndicator,
        scoreRange: `${groupItem.scoreMin}~${groupItem.scoreMax}`,
        scoreMin: groupItem.scoreMin,
        scoreMax: groupItem.scoreMax,
        scoreStandard: groupItem.scoreStandard,
        weight: groupItem.weight,
        evaluator: groupItem.evaluator
          ? groupItem.evaluator
          : [
              {
                userId: userInfo.userId,
                userName: userInfo.userName,
              },
            ],
      })),
    }))
    if (value) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setFieldState('assessmentProject', (state) => {
        FormPath.setIn(state, 'props.x-component-props.tags', tags)
        FormPath.setIn(state, 'value', newValue)
        FormPath.setIn(state, 'visible', true)
      })
    }
  })

  // 考评项目靠人打分 联动 考评结果
  onFieldValueChange$('assessmentProject.*.details.*.sendAppraisal').subscribe(() => {
    const assessmentProjectValue = getFieldValue('assessmentProject')
    const someSendAppraisal = assessmentProjectValue.some((item) => item.details.some((detail) => detail.sendAppraisal))
    setTimeout(() => {
      setFieldState('ASSESSMENT_RESULT', (state) => {
        FormPath.setIn(state, 'visible', !someSendAppraisal)
      })
    }, 0)
  })

  // 考评计分 联动 自身校验规则
  onFieldInputChange$('assessmentProject.*.details.*.grade').subscribe((state) => {
    const { name, value } = state

    const scoreRange = getFieldValue(
      FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.scoreRange`),
    )
    const scoreWeight = getFieldValue(
      FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.weight`),
    )
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
      const assessmentProjectValue = getFieldValue('assessmentProject')
      // 设置最终评分得分
      setFieldState('totalScore', (fieldState) => {
        fieldState.value = assessmentProjectValue
          .reduce((pre, now) => now.details.reduce((pre2, now2) => +(now2.score || 0) + pre2, 0) + pre, 0)
          .toFixed(2)
      })
    }
  })

  // 靠人打分 联动 评分、权重得分、评分人反馈
  onFieldValueChange$('assessmentProject.*.details.*.sendAppraisal').subscribe((state) => {
    const { name, value } = state
    setFieldState(
      FormPath.transform(
        name,
        /\d/,
        ($1, $2) => `assessmentProject.${$1}.details.${$2}.*(grade,score,reviewerFeedback,files)`,
      ),
      (fieldState) => {
        fieldState.visible = !value
      },
    )
  })

  // 靠人打分 联动 考评人
  onFieldInputChange$('assessmentProject.*.details.*.sendAppraisal').subscribe((state) => {
    const { name, value } = state
    const userInfo = authService.getAuth()

    // 取消勾选填入当前登录用户的数据
    if (!value) {
      setFieldState(
        FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.evaluator`),
        (fieldState) => {
          fieldState.value = [
            {
              userId: userInfo.userId,
              userName: userInfo.userName,
            },
          ]
          fieldState.editable = true
        },
      )
    }
    setFieldState(
      FormPath.transform(name, /\d/, ($1, $2) => `assessmentProject.${$1}.details.${$2}.evaluator`),
      (fieldState) => {
        fieldState.editable = value
      },
    )
  })

  // 评分结果 联动 原因
  onFieldValueChange$('scoringResult').subscribe((state) => {
    const { value } = state
    setFieldState('scoringResultContent', (fieldState) => {
      fieldState.required = value === 0
      setTimeout(() => {
        actions.validate('scoringResultContent')
      }, 0)
    })
  })
}
