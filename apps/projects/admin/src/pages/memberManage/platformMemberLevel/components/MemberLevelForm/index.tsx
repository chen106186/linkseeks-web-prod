/*
 * @Description: 新增/修改 平台会员等级
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks, Input } from '@apps/formily'
import { usePrompt } from '@linkseeks/router-core'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getMemberManageLevelRolePage, getMemberManageLevelTypes } from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import schema from './schema'
import { anchorsArr } from './config'
import BasicInfoVirtualFieldItem from './components/BasicInfoVirtualFieldItem'
import type { MemberApplicableRoleValue, MemberApplicableRoleProps } from './components/MemberApplicableRoleFormField'
import MemberApplicableRoleFormField from './components/MemberApplicableRoleFormField'
import styles from './index.less'

const formActions = createFormActions()
const { onFormInit$, onFormInputChange$ } = FormEffectHooks

export type SubmitValueType = {
  /**
   * 会员等级
   */
  level: number
  /**
   * 会员等级标签
   */
  levelTag: string
  /**
   * 会员等级类型
   */
  levelType: number
  /**
   * 升级分值标签
   */
  scoreTag: string
  /**
   * 会员等级说明
   */
  remark: string
  /**
   * 当前会员适用会员角色
   */
  memberApplicableRole: MemberApplicableRoleValue
}

// 暂定
export type SubmitValue = SubmitValueType & {}

interface MemberLevelFormProps {
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

const MemberLevelForm: React.FC<MemberLevelFormProps> = (props) => {
  const { title, value, onSubmit, editable = true, cloudy = false } = props
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const fetchMemberApplicableRole = (): MemberApplicableRoleProps['fetchDataSource'] => async (params) => {
    const res = await getMemberManageLevelRolePage({
      ...params,
      current: `${params.current}`,
      pageSize: `${params.pageSize}`,
    })
    return res.data
  }

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
        anchors={anchorsArr}
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
            TextArea: Input.TextArea,
            BasicInfoVirtualFieldItem,
            MemberApplicableRole: MemberApplicableRoleFormField,
          }}
          effects={($, actions) => {
            const { setFieldState } = actions

            onFormInit$().subscribe(() => {
              if (cloudy) {
                actions.setFieldState('*(memberApplicableRole)', (state) => {
                  state.editable = false
                })
              }

              // 初始会员角色列表请求接口方法
              setFieldState('memberApplicableRole', (state) => {
                state.props['x-component-props'] = state.props['x-component-props'] || {}
                state.props['x-component-props'].fetchDataSource = fetchMemberApplicableRole()
              })
            })

            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })

            useAsyncSelect('levelType', async () => {
              const { data, code } = await getMemberManageLevelTypes()
              if (code === 1000) {
                return data.map((item) => ({ label: item.levelTypeName, value: item.levelType }))
              }
              return []
            })
          }}
          schema={schema}
          editable={!!editable}
        />
      </PageHeaderWrapper>

      {/* <Prompt when={unsaved} message="您还有未保存的内容，是否确定要离开？" /> */}
    </div>
  )
}

export default MemberLevelForm
