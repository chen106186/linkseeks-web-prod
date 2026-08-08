/*
 * @Description: 新增/修改 会员角色规则
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { usePrompt } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import schema from './schema'
import { anchorsArr } from './config'
import { createEffects } from './effects'
import BasicInfoVirtualFieldItem from './components/BasicInfoVirtualFieldItem'
import CurMemberApplicableRoleFormField, {
  CurMemberApplicableRoleValue,
} from './components/CurMemberApplicableRoleFormField'
import SubMemberApplicableRoleFormField, {
  SubMemberApplicableRoleValue,
} from './components/SubMemberApplicableRoleFormField'
import MemberSelectFormField, { MemberSelectValue } from './components/MemberSelectFormField'
import styles from './index.less'

const formActions = createFormActions()
const { onFormInit$, onFormInputChange$ } = FormEffectHooks

export type SubmitValueType = {
  /**
   * 选择的会员
   */
  member: MemberSelectValue
  /**
   * 当前会员适用会员角色
   */
  curMemberApplicableRole: CurMemberApplicableRoleValue
  /**
   * 下属会员适用会员角色
   */
  subMemberApplicableRole: SubMemberApplicableRoleValue
}

// 暂定
export type SubmitValue = SubmitValueType & {}

interface RoleRuleConfigFormProps {
  /**
   * title
   */
  title: string
  /**
   * 数据id
   */
  value?: SubmitValueType
  /**
   * 点击保存触发事件
   */
  onSubmit?: (value: SubmitValue) => Promise<void>
  /**
   * 是否可编辑的，默认 true
   */
  editable?: boolean
  /**
   * 是否禁用部分不可以编辑的表单项，默认 false
   */
  cloudy?: boolean
}

const RoleRuleConfigForm: React.FC<RoleRuleConfigFormProps> = (props) => {
  const { title, value, onSubmit, editable = true, cloudy = false } = props
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const handleSubmit = (values: SubmitValueType) => {
    if (onSubmit) {
      setSubmitLoading(true)
      onSubmit(values)
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
              保存
            </Button>
          ) : null,
        ]}
      >
        <NiceForm
          previewPlaceholder=" "
          onSubmit={handleSubmit}
          actions={formActions}
          initialValues={value}
          components={{
            BasicInfoVirtualFieldItem,
            CurMemberApplicableRole: CurMemberApplicableRoleFormField,
            SubMemberApplicableRole: SubMemberApplicableRoleFormField,
            MemberSelect: MemberSelectFormField,
          }}
          effects={($, actions) => {
            createEffects($, actions)

            onFormInit$().subscribe(() => {
              if (cloudy) {
                actions.setFieldState('*(member)', (state) => {
                  state.props['x-component-props'] = state.props['x-component-props'] || {}
                  state.props['x-component-props'].disabled = true
                })
              }
            })

            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })
          }}
          schema={schema}
          editable={!!editable}
        />
      </PageHeaderWrapper>
    </div>
  )
}

export default RoleRuleConfigForm
