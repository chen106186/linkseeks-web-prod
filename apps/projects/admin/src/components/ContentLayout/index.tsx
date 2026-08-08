import React, { useState, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import FormProgress, { HandleType } from '@/components/FormProgress'
import { Button, Form, FormInstance } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { usePrompt } from '@linkseeks/router-core'
import { VISIT_TYPE } from '@/constants'
import { FieldData } from 'rc-field-form/lib/interface'

type PropsType = {
  type: 'add' | 'edit' | 'view'
  btnCode?: string
  title?: string | React.ReactNode
  form: FormInstance<any>
  onSubmit?: (setLoading: Function, handleLeave: Function) => void
  onValuesChange?: (changedValues: any, values: any) => void
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void
  tabLink?: Array<{ label: string; key: string }>
  children?: React.ReactNode
}

export const layout: any = {
  colon: false,
  labelCol: { style: { width: '144px' } },
  labelAlign: 'left',
}

const initTabLink = [
  { label: '流程规则', key: 'processEng' },
  { label: '流程选择', key: 'processSelect' },
  { label: '适用会员', key: 'applyMember' },
]

const ContentLayout = (props: PropsType, ref) => {
  const { tabLink = initTabLink, title, type, form, onSubmit, children, onValuesChange, onFieldsChange } = props
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })
  const progressRef = useRef<HandleType>()

  const handleSubmit = () => {
    onSubmit?.(setLoading, () => setUnsaved(false))
  }

  useImperativeHandle(ref, () => ({
    setProgress() {
      progressRef?.current?.render(form)
    },
  }))

  return (
    <>
      <PageHeaderWrapper
        title={
          <FormProgress
            title={title}
            ref={progressRef}
            disabled={type === VISIT_TYPE.VIEW}
            ignoreConfig={[{ key: 'allMembers', value: 1, ignoreKey: 'members' }]}
          />
        }
        isAnchor
        items={tabLink}
        extra={
          type !== VISIT_TYPE.VIEW && (
            <Button icon={<SaveOutlined />} type="primary" onClick={handleSubmit} loading={loading}>
              保存
            </Button>
          )
        }
      >
        <Form
          form={form}
          {...layout}
          onValuesChange={(changedValues: any, values: any) => {
            setUnsaved(true)
            onValuesChange?.(changedValues, values)
          }}
          onFieldsChange={(changedFields: FieldData[], allFields: FieldData[]) => {
            progressRef?.current?.render(form)
            onFieldsChange?.(changedFields, allFields)
          }}
        >
          {children}
        </Form>
      </PageHeaderWrapper>
    </>
  )
}
export default memo(forwardRef(ContentLayout))
