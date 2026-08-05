import { FormEffectHooks, FormPath } from '@apps/formily'
import {
  getMemberAbilityMaintenanceRegisterDetailByAllowSelect,
  GetMemberAbilityMaintenanceRegisterDetailByAllowSelectResponse,
} from '@apps/apis'

const { onFieldValueChange$ } = FormEffectHooks

export type OptionsType = {
  fieldName: string
  setRegisterFields: React.Dispatch<
    React.SetStateAction<GetMemberAbilityMaintenanceRegisterDetailByAllowSelectResponse>
  >
}

export const useCreateMemberRegisterBusinessEffects = (context, actions, options: OptionsType) => {
  const { fieldName, setRegisterFields } = options

  // 会员角色改变联动
  onFieldValueChange$(fieldName).subscribe(async (state) => {
    // 置空
    if (!state.value) {
      setRegisterFields([])
      return
    }
    try {
      actions.setFieldState(fieldName, (fieldState) => {
        FormPath.setIn(fieldState, 'loading', true)
      })
      const res = await getMemberAbilityMaintenanceRegisterDetailByAllowSelect({ roleId: state.value })
      if (res.code === 1000) {
        setRegisterFields(res.data)
      }
    } catch (error) {
    } finally {
      actions.setFieldState(fieldName, (fieldState) => {
        FormPath.setIn(fieldState, 'loading', false)
      })
    }
  })
}
