import React, { useState, useEffect } from 'react'
import { SchemaForm, Submit, FormButtonGroup, Reset } from '@apps/formily'
import { Card, Select, Input, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import { validatorAllTrim } from '@/utils/regExp'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import useCustomValidator from '../hooks/useValidator'
import { getManageMemberColumnGet, postManageMemberColumnAdd, postManageMemberColumnUpdate } from '@apps/apis'

interface IOption {
  value: number | string
  label: number | string
}

const sortedList = (() => {
  let res: IOption[] = []
  for (let i = 1; i <= 30; i++) {
    let data: IOption = {
      label: i,
      value: i,
    }
    res.push(data)
  }
  return res
})()

const ColumnInfo = () => {
  const intl = useIntl()
  useCustomValidator()
  const { id, preview } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)
  const { initialValue } = useInitialValue(getManageMemberColumnGet, { id: id })
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
            title: intl.formatMessage({ id: 'content.columns.name' }),
            'x-component': 'Input',
            required: true,
            'x-rules': [
              {
                required: true,
                message: `20${intl.formatMessage({ id: 'common.unit.individual.character' })}, 10${intl.formatMessage({
                  id: 'common.unit.individual.chinese',
                })}`,
              },
              {
                limitByte: true, // 自定义校验规则
                maxByte: 20,
              },
              {
                validator: (value) => value.trim().length === 0,
                message: `${intl.formatMessage({ id: 'content.columns.name' })}${intl.formatMessage({
                  id: 'common.text.notEmpty',
                })}`,
              },
            ],
          },
          type: {
            title: intl.formatMessage({ id: 'content.columns.category' }),
            'x-component': 'Select',
            'x-component-props': {
              options: [
                { label: intl.formatMessage({ id: 'content.columns.market' }), value: 1 },
                { label: intl.formatMessage({ id: 'content.columns.information' }), value: 2 },
              ],
              style: {
                width: '100%',
              },
            },
            required: true,
            'x-rules': [
              {
                required: true,
                message: `${intl.formatMessage({ id: 'common.text.pleaseSelect' })}${intl.formatMessage({
                  id: 'content.columns.category',
                })}`,
              },
            ],
          },
          sort: {
            name: 'sort',
            title: intl.formatMessage({ id: 'content.columns.sort' }),
            'x-component': 'Select',
            required: true,
            'x-rules': {
              required: true,
              message: `${intl.formatMessage({ id: 'common.text.pleaseSelect' })}${intl.formatMessage({
                id: 'content.columns.sort',
              })}`,
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

  const handleSubmit = async (value: { name: string; sort: number; type: number }) => {
    const { name, sort, type } = value
    const serviceActions = isAdd ? postManageMemberColumnAdd : postManageMemberColumnUpdate

    const postData = { id, name, sort, type }
    setSubmitLoading(true)
    setUnsaved(false)

    try {
      const { data, code } = await serviceActions(postData)
      if (code === 1000) {
        history.push('/contentAbility/columnsManagement')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCancel = () => {
    history.push('/contentAbility/columnsManagement')
  }

  return (
    <div>
      <PageHeaderWrapper title={intl.formatMessage({ id: id ? 'content.columns.edit' : 'content.columns.add' })}>
        <Card>
          <SchemaForm
            initialValues={initialValue}
            onSubmit={handleSubmit}
            editable={isAdd || isEdit}
            schema={schema}
            components={{ Input, Select, Submit }}
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

export default ColumnInfo
