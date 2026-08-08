import React, { useState, useEffect } from 'react'
import { SchemaForm, Submit, FormButtonGroup, Reset } from '@apps/formily'
import { Card, Select, Input, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import useInitialValue from '@/hooks/useInitialValue'
import useCustomValidator from '../hooks/useValidator'
import { getManageMemberLabelGet, postManageMemberLabelAdd, postManageMemberLabelUpdate } from '@apps/apis'

const { TextArea } = Input

const TagInfo = () => {
  useCustomValidator()
  const intl = useIntl()
  const { id, preview } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)
  const { initialValue } = useInitialValue(getManageMemberLabelGet, { id: id })
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const [unsaved, setUnsaved] = useState(true)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
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
            title: intl.formatMessage({ id: 'content.tag.name' }),
            'x-component': 'Input',
            required: true,
            'x-rules': [
              {
                required: true,
                message: `${intl.formatMessage({ id: 'common.form.input.placeholder' })}${intl.formatMessage({
                  id: 'content.tag.name',
                })}`,
              },
              {
                limitByte: true, // 自定义校验规则
                maxByte: 20,
              },
            ],
          },
          explain: {
            name: 'explain',
            title: intl.formatMessage({ id: 'content.tag.explain' }),
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

  const handleSubmit = (value) => {
    console.log(value)
    const { id, name, explain } = value
    const serviceActions = isAdd ? postManageMemberLabelAdd : postManageMemberLabelUpdate

    let tempData = { name, explain }
    const postData = isAdd ? { ...tempData, id: 0 } : { ...tempData, id }
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData).then((data) => {
      setSubmitLoading(false)
      if (data.code === 1000) {
        history.push('/contentAbility/tagsManagement')
      }
    })
  }

  const handleCancel = () => {
    history.push('/contentAbility/tagsManagement')
  }

  return (
    <div>
      <PageHeaderWrapper
        title={!id ? intl.formatMessage({ id: 'content.tag.add' }) : intl.formatMessage({ id: 'content.tag.edit' })}
      >
        <Card>
          <SchemaForm
            initialValues={initialValue}
            onSubmit={handleSubmit}
            editable={isAdd || isEdit}
            schema={schema}
            components={{ Input, Select, Submit, TextArea }}
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
    </div>
  )
}

export default TagInfo
