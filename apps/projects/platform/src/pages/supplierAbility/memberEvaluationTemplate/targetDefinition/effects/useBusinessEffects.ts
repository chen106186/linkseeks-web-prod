/*
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks, FormPath, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions, mockId: number) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions

  onFieldInputChange$('memberScoringIndicatorSubmitList.*.details.*.*(scoreMin,scoreMax)').subscribe((state) => {
    const { name, value } = state

    const [scoreMin, scoreMax] = [
      getFieldValue(
        FormPath.transform(name, /\d/, ($1, $2) => `memberScoringIndicatorSubmitList.${$1}.details.${$2}.scoreMin`),
      ),
      getFieldValue(
        FormPath.transform(name, /\d/, ($1, $2) => `memberScoringIndicatorSubmitList.${$1}.details.${$2}.scoreMax`),
      ),
    ]

    let isScoreRangeValidated = scoreMin !== null && scoreMax !== null

    setFieldState(
      FormPath.transform(name, /\d/, ($1, $2) => `memberScoringIndicatorSubmitList.${$1}.details.${$2}.scoreMin`),
      (fieldState) => {
        if (isScoreRangeValidated && scoreMin >= scoreMax) {
          fieldState.errors = [`分值最小值需小于分值最大值`]
          isScoreRangeValidated = false
        } else {
          fieldState.errors = []
        }
      },
    )
  })
}
