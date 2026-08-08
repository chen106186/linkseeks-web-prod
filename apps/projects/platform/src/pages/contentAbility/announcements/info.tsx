import React, { useState, useEffect } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { Card, Button } from 'antd'
import { SchemaForm, createFormActions, FormButtonGroup, Submit } from '@apps/formily'
import announceInfoSchema from './schema/announceInfoSchema'
import { Input, Select } from 'antd'
import CustomUpload from '@/components/NiceForm/components/CustomUpload'
import CustomEditor from '../components/CustomEditor'
import useInitialValue from '@/hooks/useInitialValue'
import CustomCheckbox from '../components/CustomCheckbox'
import { BraftEditor } from '@apps/components'
import { setFormStatus } from '../utils/utils'
import useCustomValidator from '../hooks/useValidator'
import styles from '../index.less'
import {
  getManageMemberNoticeGet,
  GetManageMemberNoticeGetResponse,
  postManageMemberNoticeAdd,
  postManageMemberNoticeUpdate,
} from '@apps/apis'

const actions = createFormActions()

const AdvertisementInfo = () => {
  const intl = useIntl()
  useCustomValidator()
  const { id, preview } = usePageStatus()
  const { initialValue }: any = useInitialValue<GetManageMemberNoticeGetResponse, { id: string | string[] }>(
    getManageMemberNoticeGet,
    { id: id },
  )
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview

  useEffect(() => {
    const content = initialValue?.content
    if (content) {
      const editorState = BraftEditor.createEditorState(content)
      actions.setFieldValue('layout.contentLayout.content', editorState)
    }
    setFormStatus(actions, 'layout.contentLayout.content', 'readOnly', isView)
  }, [initialValue])

  const handleSubmit = (value) => {
    console.log(value)
    const { content, top, ...rest } = value
    const editorContent = content.toHTML()
    const serviceActions = isAdd ? postManageMemberNoticeAdd : postManageMemberNoticeUpdate

    let tempData = { ...rest, content: editorContent, top: top ? 1 : 0 }
    const postData = isAdd ? tempData : { ...tempData, id }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.push('/contentAbility/announcements')
      }
    })
  }

  const handleCancel = () => {
    history.push('/contentAbility/announcements')
  }

  return (
    <PageHeaderWrapper
      title={
        isAdd
          ? intl.formatMessage({ id: 'content.notice.add' })
          : isEdit
          ? intl.formatMessage({ id: 'content.notice.edit' })
          : intl.formatMessage({ id: 'content.notice.see' })
      }
    >
      <Card>
        <SchemaForm
          schema={announceInfoSchema}
          actions={actions}
          components={{
            Input,
            Select,
            Submit,
            CustomUpload,
            CustomEditor,
            CustomCheckbox,
          }}
          initialValues={initialValue}
          onSubmit={handleSubmit}
          editable={isAdd || isEdit}
          expressionScope={{
            label: <div className={styles.custom_label}>{intl.formatMessage({ id: 'content.info.column' })}</div>,
          }}
        >
          {isAdd || isEdit ? (
            <FormButtonGroup offset={3}>
              <Submit loading={submitLoading}>{intl.formatMessage({ id: 'common.button.submit' })}</Submit>
              <Button onClick={handleCancel}>{intl.formatMessage({ id: 'common.button.cancel' })}</Button>
            </FormButtonGroup>
          ) : (
            <></>
          )}
        </SchemaForm>
      </Card>
    </PageHeaderWrapper>
  )
}

export default AdvertisementInfo
