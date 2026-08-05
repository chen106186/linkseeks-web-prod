import { message } from 'antd'
import { FormEffectHooks, IFormExtendsEffectSelector, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getMemberPlatformRoleRuleSelectMember } from '@apps/apis'
import { postMemberPlatformRoleRuleRolePage } from '@apps/apis'
import { MemberApplicableRoleProps } from '../components/CurMemberApplicableRoleFormField'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

const fetchMemberApplicableRole = (): MemberApplicableRoleProps['fetchDataSource'] => async (params) => {
  const res = await postMemberPlatformRoleRuleRolePage(
    {
      ...params,
      current: params.current,
      pageSize: params.pageSize,
    },
    {
      ctlType: 'none',
    },
  )
  if (res.code !== 1000 && res.message) {
    message.warning(res.message)
  }
  return res.data
}

export const useBusinessEffects = (
  context: IFormExtendsEffectSelector,
  actions: ISchemaFormActions | ISchemaFormAsyncActions,
) => {
  const { setFieldValue, setFieldState } = actions
  const linkage = useLinkageUtils()

  // 选择会员触发联动
  onFieldInputChange$('member').subscribe((fieldState) => {
    const { value } = fieldState

    // 清空 当前会员适用会员角色、下属会员适用会员角色
    setFieldValue('*(curMemberApplicableRole,subMemberApplicableRole)', [], true)

    if (value && value.length) {
      const memberId = value[0].memberId
      getMemberPlatformRoleRuleSelectMember({
        memberId: `${memberId}`,
      }).then((res) => {
        if (res.code === 1000) {
          setFieldValue(
            'curMemberApplicableRole',
            res.data.roleList
              ? res.data.roleList.map((item) => ({
                  roleId: item.roleId,
                  roleName: item.roleName,
                  roleTypeEnum: item.roleTypeEnum,
                  roleTypeName: item.roleTypeName,
                  memberType: item.memberType,
                  memberTypeName: item.memberTypeName,
                  roleTag: item.roleTag,
                  roleTagName: item.roleTagName,
                }))
              : [],
          )
        }
      })
    }
  })

  // 选择会员触发联动
  onFieldValueChange$('member').subscribe((fieldState) => {
    const { value } = fieldState
    if (value && value.length) {
      setFieldState('curMemberApplicableRole', (state) => {
        state.props['x-component-props'] = state.props['x-component-props'] || {}
        state.props['x-component-props'].fetchDataSource = fetchMemberApplicableRole()
      })

      setFieldState('subMemberApplicableRole', (state) => {
        state.props['x-component-props'] = state.props['x-component-props'] || {}
        state.props['x-component-props'].fetchDataSource = fetchMemberApplicableRole()
      })
    }
  })
}
