import React, { useEffect, useState } from 'react'
import {
  SchemaForm,
  Submit,
  FormButtonGroup,
  Reset,
  createFormActions,
  registerValidationRules,
  FormEffectHooks,
} from '@apps/formily'
import { Card, Select, Input, Checkbox, Button } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import ReturnEle from '@/components/ReturnEle'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
// import CustomUpload from '@/components/NiceForm/components/CustomUpload';
import { CustomTags } from '../components/Tags'
import CustomEditor from '../components/CustomEditor'
import { BraftEditor } from '@apps/components'
import useInitialValue from '@/hooks/useInitialValue'
import infomationInfoSchema from './schema/infomationInfoSchema'
import CustomUpload from '../components/WrapCustomUpload'
import useCustomValidator from '../hooks/useValidator'
import { COLUMN_CATEGORY } from '../constant'
import cx from 'classnames'
import styles from '../index.less'
import {
  getManageMemberCategoryAll,
  getManageMemberColumnAll,
  getManageMemberInformationGet,
  getManageMemberLabelAll,
  postManageMemberInformationAdd,
  postManageMemberInformationUpdate,
} from '@apps/apis'

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
  const intl = useIntl()
  useCustomValidator()
  const { id, preview } = usePageStatus()
  // const [isTop, setIsTop] = useState(1);
  const [labelIds, setLabelIds] = useState<number[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(true)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [type, setType] = useState<ColumnType>(0)
  const { initialValue } = useInitialValue(getManageMemberInformationGet, { id: id })
  const [category, setCategory] = useState<any>([])
  const [column, setColumn] = useState<ColumnListType[]>([])
  const [recommendLabelValue, setRecommendLabelValue] = useState<number>()

  const isEdit = id && !preview
  const isAdd = !id && !preview
  const isView = id && preview

  // 设置form 的某字段的值
  const setFormStatus = (name: string, key: string, value: any) => {
    actions.setFieldState(name, (state) => {
      // @ts-ignore
      state.props['x-component-props'][key] = value
    })
  }

  useEffect(() => {
    async function getColumn() {
      const res = await getManageMemberColumnAll()
      const list = res.data.map((item) => ({ label: item.name, value: item.id, type: item.type }))
      setFormStatus('layout.columnId', 'options', list)
      setColumn(list)
    }
    getColumn()
  }, [])

  useEffect(() => {
    async function getLabels() {
      const res = await getManageMemberLabelAll()
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
      const { data, code, message } = await getManageMemberCategoryAll()
      if (code !== 1000) return
      const list = data.map((_item) => ({ label: _item.name, value: _item.id, children: _item.list }))
      setFormStatus('layout.categoryLayout.firstCategoryId', 'options', list)
      // sethasGetCategory(true)
      setCategory(data)
    }
    getCategory()
  }, [])

  useEffect(() => {
    if (initialValue === null) {
      return
    }
    const data = initialValue || {}
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
          state.props['description'] = `${intl.formatMessage({ id: 'content.columns.category' })}：${
            COLUMN_CATEGORY[targetColumn?.type] || ''
          }`
        })
        setType(targetColumn?.type)
      }
    }
    setFormStatus('layout.imageUpload', 'imgUrl', data.imageUrl)
    // setIsTop(data.top);
    setLabelIds(data.labelIds)
    setFormStatus('layout.labelIds', 'seletedTag', data.labelIds)
  }, [initialValue, category, column])

  const handleSubmit = (value) => {
    const content = value.content.toHTML()
    const tempPostData = {
      ...value,
      type: type,
      labelIds: labelIds || [],
      content: content,
    }
    const serviceActions = isAdd ? postManageMemberInformationAdd : postManageMemberInformationUpdate

    const postData = isAdd ? tempPostData : { ...tempPostData, id: id }
    console.log(`postData`, postData)
    setSubmitLoading(true)
    setUnsaved(false)
    serviceActions(postData)
      .then((data) => {
        if (data.code === 1000) {
          history.push('/contentAbility/infomations')
        } else {
          setSubmitLoading(false)
        }
      })
      .catch(() => {
        setSubmitLoading(false)
      })
  }

  const handleCancel = () => {
    history.push('/contentAbility/infomations')
  }

  return (
    <div>
      <PageHeaderWrapper
        title={
          isAdd
            ? intl.formatMessage({ id: 'content.info.add' })
            : isEdit
            ? intl.formatMessage({ id: 'content.info.edit' })
            : intl.formatMessage({ id: 'content.info.see' })
        }
      >
        <Card>
          <SchemaForm
            value={initialValue}
            onSubmit={handleSubmit}
            schema={infomationInfoSchema}
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
                  state['props']['description'] = `${intl.formatMessage({ id: 'content.columns.category' })}：${
                    currentType && COLUMN_CATEGORY[currentType.type]
                  }`
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
              onFieldValueChange$('recommendLabel').subscribe(({ value }) => {
                console.log(`recommendLabel value`, value)
                setRecommendLabelValue(value)
                actions.setFieldState('imageUrl', (state) => {
                  state.props['x-rules'] = [1, 2, 3, 4, 6].includes(value)
                    ? {
                        required: true,
                        message: `${intl.formatMessage({ id: 'common.form.upload.placeholder' })}${intl.formatMessage({
                          id: 'common.text.image',
                        })}`,
                      }
                    : {}
                })
              })
            }}
            expressionScope={{
              tagOnChange: (value) => {
                setLabelIds(value)
              },
              label: (
                <div
                  className={cx(
                    (isAdd || isEdit) && [1, 2, 3, 4, 6].includes(recommendLabelValue) && styles.custom_label,
                  )}
                >
                  {intl.formatMessage({ id: 'common.text.image' })}
                </div>
              ),
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
    </div>
  )
}

export default InfomationInfo
