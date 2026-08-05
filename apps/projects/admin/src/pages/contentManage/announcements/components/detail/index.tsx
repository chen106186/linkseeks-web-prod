import React, { useState, useEffect } from 'react'
import { Card, Button, Input, Select } from 'antd'
import { BraftEditor } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { SchemaForm, createFormActions, FormButtonGroup, Submit } from '@apps/formily'
import {
  getManageContentNoticeGet,
  postManageContentNoticeAdd,
  postManageContentNoticeUpdate,
  getManageContentNoticeGetContentNoticeTypeEnum,
} from '@apps/apis'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import CustomUpload from '@/components/NiceForm/components/CustomUpload'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import announceInfoSchema from '../../schema/announceInfoSchema'
import CustomEditor from '../../../components/CustomEditor'
import { useInitialValues } from '../../../hooks/useInitialValues'
import CustomCheckbox from '../../../components/CustomCheckbox'
import { setFormStatus } from '../../../utils/utils'
import useCustomValidator from '../../../hooks/useValidator'

const actions = createFormActions()

const AdvertisementInfo = () => {
  useCustomValidator()
  const { id, preview } = usePageStatus()
  const initialValues: any = useInitialValues({ id: id }, getManageContentNoticeGet)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview
  usePrompt({ when: unsaved && (isAdd || isEdit), message: '您还有未保存的内容，是否确定要离开？' })

  useEffect(() => {
    const data = initialValues?.data || {}
    const content = data?.content
    if (content) {
      const editorState = BraftEditor.createEditorState(content)
      actions.setFieldValue('layout.contentLayout.content', editorState)
    }
    setFormStatus(actions, 'layout.contentLayout.content', 'readOnly', isView)
  }, [initialValues])

  const handleSubmit = (value) => {
    const { content, top, ...rest } = value
    const editorContent = content.toHTML()
    // const { title, columnType, sort, link, imageUrl} = value;
    const serviceActions = isAdd ? postManageContentNoticeAdd : postManageContentNoticeUpdate

    const tempData = { ...rest, content: editorContent, top: top ? 1 : 0 }
    const postData = isAdd ? tempData : { ...tempData, id }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.goBack()
      }
    })
  }

  const handleCancel = () => {
    history.goBack()
  }

  const getColumnType = async () => {
    const res = await getManageContentNoticeGetContentNoticeTypeEnum()

    if (res.code === 1000) {
      const list = res?.data || []
      return {
        columnType: list.map((item) => ({
          ...item,
          value: String(item.value),
        })),
      }
    }
    return {
      columnType: [],
    }
  }

  return (
    <PageHeaderWrapper title={isAdd ? '新建公告' : isEdit ? '编辑公告' : '查看公告'}>
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
          initialValues={initialValues?.data}
          onSubmit={handleSubmit}
          editable={isAdd || isEdit}
          effects={($, ctx) => {
            useAsyncInitSelect(['columnType'], getColumnType)
          }}
        >
          {isAdd || isEdit ? (
            <FormButtonGroup offset={3}>
              <Submit loading={submitLoading}>提交</Submit>
              <Button onClick={handleCancel}>取消</Button>
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
