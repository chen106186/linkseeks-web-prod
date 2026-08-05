/*
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks, FormPath, IFieldState, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { I_Indicator, I_IndicatorGroup } from '../../components/TemplateIndicatorSubmitListField'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions, mockId: number) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions

  const validateInputs = (state: IFieldState<any>) => {
    const { name } = state

    const [scoreMin, scoreMax] = [
      getFieldValue(
        FormPath.transform(name, /\d/, ($1, $2) => `templateIndicatorSubmitList.${$1}.details.${$2}.scoreMin`),
      ),
      getFieldValue(
        FormPath.transform(name, /\d/, ($1, $2) => `templateIndicatorSubmitList.${$1}.details.${$2}.scoreMax`),
      ),
    ]

    let isScoreRangeValidated = scoreMin !== null && scoreMax !== null

    setFieldState(
      FormPath.transform(name, /\d/, ($1, $2) => `templateIndicatorSubmitList.${$1}.details.${$2}.scoreMin`),
      (fieldState) => {
        if (isScoreRangeValidated && scoreMin >= scoreMax) {
          fieldState.errors = [`分值最小值需小于分值最大值`]
          isScoreRangeValidated = false
        } else {
          fieldState.errors = []
        }
      },
    )

    if (isScoreRangeValidated) {
      const templateIndicatorSubmitList = getFieldValue(`templateIndicatorSubmitList`)

      let isScoreWeightValidated = true

      let totalScoreWeight = 0

      templateIndicatorSubmitList.forEach((group) => {
        if (!isScoreWeightValidated) {
          return
        }
        group?.details?.forEach((indicator) => {
          if (indicator && indicator.weight !== null) {
            totalScoreWeight += indicator.weight
          } else {
            isScoreWeightValidated = false
            return
          }
        })
      })

      setFieldState(`templateIndicatorSubmitList.*.details.*.weight`, (fieldState) => {
        if (isScoreWeightValidated && totalScoreWeight !== 100) {
          fieldState.errors = [translate('web.resource.member.quanzhongzonghexudengyu')]
        } else {
          fieldState.errors = []
        }
      })
    }
  }

  // 监听抽屉选择标准指标
  onFieldValueChange$('templateIndicatorSubmitListCtl').subscribe((state) => {
    const templateIndicatorGroups = []
    state.value?.forEach((row: I_Indicator) => {
      const existedIndex = templateIndicatorGroups.findIndex(
        (indicator) => indicator.groupName === row.indicatorGrouping,
      )
      if (existedIndex > -1) {
        templateIndicatorGroups[existedIndex].details.push(row)
      } else {
        templateIndicatorGroups.push({
          groupName: row.indicatorGrouping,
          details: [{ ...row }],
        })
      }
    })
    if (templateIndicatorGroups) {
      const tags = templateIndicatorGroups?.map((item: I_IndicatorGroup) => ({
        name: item.groupName,
        key: `${mockId++}`,
      }))
      // 设置 指标明细title
      for (let i = 0; i < tags.length; i++) {
        const item = tags[i]
        setFieldState(`templateIndicatorSubmitList.${i}.details`, (state) => {
          FormPath.setIn(state, 'props.x-component-props.groupName', item.name)
        })
      }
      setFieldState('templateIndicatorSubmitList', (state) => {
        FormPath.setIn(state, 'props.x-component-props.tags', tags)
        FormPath.setIn(state, 'value', templateIndicatorGroups)
        FormPath.setIn(state, 'visible', true)
      })
    }
  })

  onFieldValueChange$('templateIndicatorSubmitList').subscribe((state) => {
    if (state.value?.length) {
      const isNotEmpty = state.value.some((group) => Boolean(group?.details.length))
      setFieldState('templateIndicatorSubmitListCtl', (state) => {
        FormPath.setIn(state, 'errors', isNotEmpty ? [] : ['至少需要一条标准指标'])
      })
    }

    validateInputs(state)
  })

  onFieldInputChange$('templateIndicatorSubmitList.*.details.*.*(scoreMin,scoreMax,weight)').subscribe((state) =>
    validateInputs(state),
  )
}
