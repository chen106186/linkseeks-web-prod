import React, { useState } from 'react'
import { Card, Button, Input, Select } from 'antd'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { SchemaForm, createFormActions, FormButtonGroup, FormEffectHooks, Submit } from '@apps/formily'
import { getManageContentImageGet, postManageContentImageAdd, postManageContentImageUpdate } from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import imageInfoSchema from '../../schema/imageInfoSchema'
import CustomUpload from '../../../components/WrapCustomUpload'
import { useInitialValues } from '../../../hooks/useInitialValues'
import useCustomValidator from '../../../hooks/useValidator'
import { setFormStatus, POSITION, transfer2Options } from '../../../utils/utils'

const { onFieldValueChange$ } = FormEffectHooks
const actions = createFormActions()
// 暂时写死， 所在位置跟使用场景相关联，当选择Web时去除所有App
const WEB_OPTION = transfer2Options(POSITION).filter((item) => !item.label.includes('APP'))
const APP_OPTION = transfer2Options(POSITION).filter((item) => item.label.includes('APP'))

const ImageInfo = () => {
  useCustomValidator()
  const { id, preview } = usePageStatus()
  const initialValues: any = useInitialValues({ id: id }, getManageContentImageGet)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const isEdit = id && !preview
  const isAdd = !id && !preview
  usePrompt({ when: unsaved && (isAdd || isEdit), message: '您还有未保存的内容，是否确定要离开？' })

  const handleSubmit = (value) => {
    const serviceActions = isAdd ? postManageContentImageAdd : postManageContentImageUpdate

    const tempData = value
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

  const ImageInfoEffects = () => () => {
    onFieldValueChange$('layout.useScene').subscribe((state) => {
      if (state.initialValue != state.value) {
        actions.setFieldValue('layout.position', null)
        setFormStatus(actions, 'layout.position', 'options', state.value == 1 ? WEB_OPTION : APP_OPTION)
      }
    })
  }

  return (
    <PageHeaderWrapper title={isAdd ? '新建图片' : isEdit ? '编辑图片' : '查看图片'}>
      <Card>
        <SchemaForm
          schema={imageInfoSchema}
          actions={actions}
          components={{
            Input,
            Select,
            Submit,
            CustomUpload,
          }}
          initialValues={initialValues?.data}
          onSubmit={handleSubmit}
          editable={isAdd || isEdit}
          effects={ImageInfoEffects()}
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

export default ImageInfo
