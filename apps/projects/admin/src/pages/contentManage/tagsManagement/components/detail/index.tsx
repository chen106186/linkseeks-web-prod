import React, { useState } from 'react'
import { SchemaForm, Submit, FormButtonGroup } from '@apps/formily'
import { Card, Select, Input, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useInitialValues } from '../../../hooks/useInitialValues'
import useCustomValidator from '../../../hooks/useValidator'
import { getManageContentLabelGet, postManageContentLabelAdd, postManageContentLabelUpdate } from '@apps/apis'

const { TextArea } = Input
const schema = {
  type: 'object',
  properties: {
    layout: {
      name: 'layout',
      type: 'boject',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        wrapperCol: 10,
        labelAlign: 'left',
      },
      properties: {
        name: {
          name: 'name',
          title: '标签名称',
          'x-component': 'Input',
          required: true,
          'x-rules': [
            {
              required: true,
              message: '请填写标签名称',
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        explain: {
          name: 'explain',
          title: '标签说明',
          'x-component': 'TextArea',
          'x-component-props': {
            rows: 5,
          },
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 80,
            },
          ],
        },
      },
    },
  },
}

const TagInfo = () => {
  useCustomValidator()
  const { id, preview } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)
  const initialValues = useInitialValues({ id: id }, getManageContentLabelGet)
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const [unsaved, setUnsaved] = useState(true)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })
  const handleSubmit = (value) => {
    const { id: _id, name, explain } = value
    const serviceActions = isAdd ? postManageContentLabelAdd : postManageContentLabelUpdate

    const tempData = { name, explain }
    const postData = isAdd ? { ...tempData, id: 0 } : { ...tempData, id: _id }
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
  return (
    <div>
      <PageHeaderWrapper title={!id ? '新建标签' : '编辑标签'}>
        <Card>
          <SchemaForm
            initialValues={initialValues?.data}
            onSubmit={handleSubmit}
            editable={isAdd || isEdit}
            schema={schema}
            components={{ Input, Select, Submit, TextArea }}
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
    </div>
  )
}

export default TagInfo
