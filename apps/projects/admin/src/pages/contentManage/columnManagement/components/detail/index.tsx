import React, { useState, useEffect } from 'react'
import { SchemaForm, Submit, FormButtonGroup } from '@apps/formily'
import { Card, Select, Input, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import useCustomValidator from '../../../hooks/useValidator'
import { getManageContentColumnGet, postManageContentColumnAdd, postManageContentColumnUpdate } from '@apps/apis'

interface IOption {
  value: number | string
  label: number | string
}

const sortedList = (() => {
  const res: IOption[] = []
  for (let i = 1; i <= 30; i++) {
    const data: IOption = {
      label: i,
      value: i,
    }
    res.push(data)
  }
  return res
})()

const schema = {
  type: 'object',
  properties: {
    layout: {
      name: 'layout',
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 3,
        wrapperCol: 10,
        labelAlign: 'left',
      },
      properties: {
        name: {
          name: 'name',
          title: '栏目名称',
          'x-component': 'Input',
          required: true,
          'x-rules': [
            {
              required: true,
              message: '最长20个字符，10个汉字',
            },
            {
              limitByte: true, // 自定义校验规则
              maxByte: 20,
            },
          ],
        },
        type: {
          title: '栏目分类',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              { label: '市场行情', value: 1 },
              { label: '资讯', value: 2 },
            ],
            style: {
              width: '100%',
            },
          },
          required: true,
          'x-rules': [
            {
              required: true,
              message: '请选择栏目分类',
            },
          ],
        },
        sort: {
          name: 'sort',
          title: '栏目排序',
          'x-component': 'Select',
          required: true,
          'x-rules': {
            required: true,
            message: '请选择栏目排序',
          },
          'x-component-props': {
            options: sortedList,
            style: {
              width: '100%',
            },
          },
        },
      },
    },
  },
}

const useInitialValues = (id) => {
  const [state, setState] = useState({})
  useEffect(() => {
    if (id) {
      getManageContentColumnGet({ id: id }).then((data) => {
        setState(data)
      })
    }
  }, [id])
  return state
}

const ColumnInfo = () => {
  useCustomValidator()
  const { id, preview } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)
  const initialValues = useInitialValues(id)
  const [unsaved, setUnsaved] = useState(true)
  const isEdit = id && !preview
  const isAdd = !id && !preview
  usePrompt({ when: unsaved && (isAdd || isEdit), message: '您还有未保存的内容，是否确定要离开？' })

  const handleSubmit = async (value: { name: string; sort: number; type: number }) => {
    const { name, sort, type } = value
    const serviceActions = isAdd ? postManageContentColumnAdd : postManageContentColumnUpdate

    const postData = { id, name, sort, type }
    setSubmitLoading(true)
    setUnsaved(false)

    try {
      const { code } = await serviceActions(postData)
      if (code === 1000) {
        history.goBack()
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCancel = () => {
    history.goBack()
  }

  return (
    <div>
      <PageHeaderWrapper title={!id ? '新建栏目' : '编辑栏目'}>
        <Card>
          <SchemaForm
            initialValues={initialValues?.data}
            onSubmit={handleSubmit}
            editable={isAdd || isEdit}
            schema={schema}
            components={{ Input, Select, Submit }}
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

export default ColumnInfo
