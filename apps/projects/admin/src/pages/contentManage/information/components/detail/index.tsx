import React, { useEffect, useState } from 'react'
import { SchemaForm, Submit, FormButtonGroup, createFormActions, FormEffectHooks } from '@apps/formily'
import { Card, Select, Input, Checkbox, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { CustomTags } from '../../../components/Tags'
import CustomEditor from '../../../components/CustomEditor'
import { BraftEditor } from '@apps/components'
import { useInitialValues } from '../../../hooks/useInitialValues'
import inforMationInfoSchema from '../../schema/infomationInfoSchema'
import CustomUpload from '../../../components/WrapCustomUpload'
import useCustomValidator from '../../../hooks/useValidator'
import type { GetManageContentCategoryAllResponse } from '@apps/apis'
import {
  getManageContentCategoryAll,
  getManageContentColumnAll,
  getManageContentInformationGet,
  getManageContentLabelAll,
  postManageContentInformationAdd,
  postManageContentInformationUpdate,
} from '@apps/apis'
import { COLUMN_CATEGORY } from '@/constants/const/content'

const actions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

const { TextArea } = Input

/**
 * 栏目分类
 * 1.市场行情；2.资讯
 */
type ColumnType = 0 | 1 | 2

type ColumnListType = {
  label: string
  value: number
  type: 1 | 2 | (number & {})
}

const InfomationInfo = () => {
  useCustomValidator()
  const { id, preview } = usePageStatus()
  // const [isTop, setIsTop] = useState(1);
  const [labelIds, setLabelIds] = useState<number[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  const [type, setType] = useState<ColumnType>(0)
  const initialValues = useInitialValues({ id: id }, getManageContentInformationGet)
  const [category, setCategory] = useState<GetManageContentCategoryAllResponse>([])
  const [column, setColumn] = useState<ColumnListType[]>([])
  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview
  usePrompt({ when: (isAdd || isEdit) && unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  // 设置form 的某字段的值
  const setFormStatus = (name: string, key: string, value: any) => {
    actions.setFieldState(name, (state) => {
      // @ts-ignore
      state.props['x-component-props'][key] = value
    })
  }

  useEffect(() => {
    async function getColumn() {
      const res = await getManageContentColumnAll()
      const list = res.data.map((item) => ({ label: item.name, value: item.id, type: item.type }))
      setFormStatus('layout.columnId', 'options', list)
      setColumn(list)
    }
    getColumn()
  }, [])

  useEffect(() => {
    async function getLabels() {
      const res = await getManageContentLabelAll()
      const labels = res.data.map((item) => ({ label: item.name, value: item.id }))
      setFormStatus('layout.labelIds', 'dataSource', labels)
    }
    getLabels()
  }, [])

  /**
   * 获取行情分类
   */
  useEffect(() => {
    async function getCategory() {
      const { data, code, message } = await getManageContentCategoryAll()
      if (code !== 1000) return
      const list = data.map((_item) => ({ label: _item.name, value: _item.id, children: _item.list }))
      setFormStatus('layout.categoryLayout.firstCategoryId', 'options', list)
      // sethasGetCategory(true)
      setCategory(data)
    }
    getCategory()
  }, [])

  useEffect(() => {
    if (initialValues === null) {
      return
    }
    const data = initialValues!.data || {}
    const content = data.content
    if (content) {
      const editorState = BraftEditor.createEditorState(content)
      actions.setFieldValue('layout.contentLayout.content', editorState)
    }
    setFormStatus('layout.contentLayout.content', 'readOnly', isView)
    /** @tofix 这里写的不是很好， 这里分类联动应该单独一个组件抽离 */
    if (category) {
      actions.setFieldValue('layout.categoryLayout.firstCategoryName', data.firstCategoryName)
      const secondCategory = category.filter((_row) => _row.id === data.firstCategoryId)[0]?.list || []
      const options = secondCategory.map((_row: any) => ({ label: _row.name, value: _row.id, children: _row.list }))
      setFormStatus('layout.categoryLayout.secondCategoryId', 'options', options)
      // actions.setFieldValue('layout.categoryLayout.secondCategoryId',  data.secondCategoryId);

      const thirdCategory = options.filter((_row) => _row.value === data.secondCategoryId)[0]?.children || []
      const thirdOptions = thirdCategory.map((_row: any) => ({ label: _row.name, value: _row.id, children: _row.list }))
      setFormStatus('layout.categoryLayout.thirdlyCategoryId', 'options', thirdOptions)
      // actions.setFieldValue('layout.categoryLayout.thirdlyCategoryId',  data.thirdlyCategoryId);
    }
    if (column) {
      const targetColumn = column.filter((_item) => _item.value === data.columnId)[0]
      if (targetColumn) {
        actions.setFieldState('layout.columnId', (state) => {
          state.props['description'] = `栏目分类：${COLUMN_CATEGORY[targetColumn?.type] || ''}`
        })
        setType(targetColumn?.type)
      }
    }
    setFormStatus('layout.imageUpload', 'imgUrl', data.imageUrl)
    // setIsTop(data.top);
    setLabelIds(data.labelIds)
    setFormStatus('layout.labelIds', 'seletedTag', data.labelIds)
  }, [initialValues, category, column])

  const handleSubmit = (value) => {
    const content = value.content.toHTML()
    const tempPostData = {
      ...value,
      type: type,
      labelIds: labelIds || [],
      content: content,
    }
    const serviceActions = isAdd ? postManageContentInformationAdd : postManageContentInformationUpdate

    const postData = isAdd ? tempPostData : { ...tempPostData, id: id }
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
      <PageHeaderWrapper title={isAdd ? '新建资讯' : isEdit ? '编辑资讯' : '查看资讯'}>
        <Card>
          <SchemaForm
            value={initialValues?.data}
            onSubmit={handleSubmit}
            schema={inforMationInfoSchema}
            editable={isAdd || isEdit}
            actions={actions}
            components={{
              Input,
              Select,
              Submit,
              TextArea,
              Checkbox,
              CustomUpload,
              CustomTags,
              CustomEditor,
            }}
            effects={($) => {
              onFieldValueChange$('layout.columnId').subscribe(({ value }) => {
                actions.setFieldState('layout.columnId', (state) => {
                  const currentType = state.props['x-component-props']!.options?.filter(
                    (_row) => _row.value === value,
                  )[0]
                  state['props']['description'] = `栏目分类：${currentType && COLUMN_CATEGORY[currentType.type]}`
                  setType(currentType ? currentType.type : 0)
                })
              })
              onFieldInputChange$('layout.categoryLayout.*(firstCategoryId,secondCategoryId)').subscribe(
                ({ value, props, name }) => {
                  const matchName = name.match(/(.*?)Id/)
                  if (matchName?.length !== 2) {
                    return
                  }
                  const target = props['x-component-props']!.options.filter((_row) => _row.value === value)[0]
                  actions.setFieldValue(`layout.categoryLayout.${matchName[1]}Name`, target?.label)

                  const childrenName = name === 'firstCategoryId' ? 'secondCategoryId' : 'thirdlyCategoryId'
                  const optionChildren = target?.children || []
                  const list = optionChildren?.map((_item) => ({
                    label: _item.name,
                    value: _item.id,
                    children: _item.list,
                  }))
                  actions.setFieldState(`layout.categoryLayout.${childrenName}`, (state) => {
                    ;(state.value = ''), (state.props['x-component-props']!['options'] = list)
                  })
                },
              )
            }}
            expressionScope={{
              tagOnChange: (value) => {
                setLabelIds(value)
              },
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
    </div>
  )
}

export default InfomationInfo
