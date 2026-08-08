/*
 * @Description: 供应商评分模板 > 供应商评分模板配置 > 新增供应商评分模板
 */
import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'

import { Button, Spin, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormPath } from '@apps/formily'
import { Select, ArrayTable } from '@apps/formily'

import NiceForm from '@/components/NiceForm'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import TagsPaneField, { TagsPaneFieldProps } from '../../components/TagsPaneField'
import TemplateIndicatorSubmitListCtlField from '../components/TemplateIndicatorSubmitListCtlField'
import TemplateIndicatorSubmitListField, {
  I_Indicator,
  I_IndicatorGroup,
} from '../components/TemplateIndicatorSubmitListField'

import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import { FormDetailContext } from '@/formSchema/context'
import { usePageStatus } from '@/hooks/usePageStatus'
import { memberEvaluationTemplateFormSchema } from './schema'
import { createEffects } from './effects'
import { useWebIntl } from '@apps/locales'
import {
  getMemberSupplierScoringTemplateDetail,
  getMemberSupplierScoringTemplateTypeList,
  postMemberSupplierScoringTemplateAdd,
  postMemberSupplierScoringTemplateUpdate,
  PostMemberSupplierScoringTemplateAddRequest,
  PostMemberSupplierScoringTemplateUpdateRequest,
} from '@apps/apis'

interface I_FormData {
  id: number
  templateName: string
  templateType: number
  templateDescribe: string
  templateIndicatorSubmitListCtl?: Array<{
    groupName?: string
    details: Array<I_Indicator>
  }>
  templateIndicatorSubmitList: Array<{
    groupName?: string
    details: Array<I_Indicator>
  }>
}

const formActions = createFormActions()

let mockId = Number.MIN_SAFE_INTEGER

const MemberEvaluationTemplateEdition: React.FC<any> = (props) => {
  const { pathname } = useLocation()
  const translate = useWebIntl()
  const backLink = pathname.split('/').slice(0, -1).join('/') /** 返回到 供应商评分模板配置 页 */

  const { formContext } = useFormDetail()
  const { id, preview } = usePageStatus()

  const [isEditMode] = useState(Number(preview) !== 1)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [areTagsEditable, setAreTagsEditable] = useState(false)
  const [formSchema] = useState<any>(() => ({ ...memberEvaluationTemplateFormSchema }))
  const [formValue, setFormValue] = useState<I_FormData>()

  const providerValue = {
    formContext,
    schemaActions: formActions,
  }

  /** 新增 评分模板 */
  const postEvaluationTemplateCreation = async (params: PostMemberSupplierScoringTemplateAddRequest) => {
    const res = await postMemberSupplierScoringTemplateAdd(params, { ctlType: 'none' })
    if (res.code === 1000) {
      message.success(`${translate('web.resource.member.yichenggongxinzengpinfenmuban')}：${params.templateName}`)
      history.goBack()
    }
  }

  /** 编辑 评分模板 */
  const postEvaluationTemplateEdition = async (params: PostMemberSupplierScoringTemplateUpdateRequest) => {
    const res = await postMemberSupplierScoringTemplateUpdate(params, { ctlType: 'none' })
    if (res.code === 1000) {
      message.success(`${translate('web.resource.member.yichenggongxiugaipinfenmuban')}：${params.templateName}`)
      history.goBack()
    }
  }

  /** 查询 评分模板详情 */
  const getEvaluationTemplateDetail = async (templateId: string) => {
    try {
      setIsSpinning(true)
      const res = await getMemberSupplierScoringTemplateDetail({ templateId })
      if (res.code === 1000) {
        const { templateIndicatorGroups } = res.data
        const templateIndicatorSubmitListCtl = []
        const tags =
          templateIndicatorGroups?.map((item: I_IndicatorGroup) => {
            item.elements.forEach((element) => templateIndicatorSubmitListCtl.push(element))
            return {
              name: item.groupName,
              key: `${mockId++}`,
            }
          }) || []
        setFormValue({
          ...res.data,
          templateIndicatorSubmitList: templateIndicatorGroups?.map((item: I_IndicatorGroup) => ({
            details: item.elements,
          })),
          templateIndicatorSubmitListCtl,
        })
        // 设置 指标明细title
        for (let i = 0; i < tags.length; i++) {
          const item = tags[i]
          formActions.setFieldState(`templateIndicatorSubmitList.${i}.details`, (state) => {
            FormPath.setIn(state, 'props.x-component-props.groupName', item.name)
          })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSpinning(false)
    }
  }

  /** 查询 评分模板详情 */
  const getEvaluationTemplateTypeEnum = (): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
      getMemberSupplierScoringTemplateTypeList()
        .then((res) => {
          if (res.code === 1000) {
            const options = res.data
              ? res.data.map(({ code, message }) => ({
                  label: message,
                  value: code,
                }))
              : []
            resolve(options)
          }
          reject()
        })
        .catch(reject)
    })
  }

  const onFormSubmit = async (formData: I_FormData) => {
    try {
      setIsSubmitting(true)
      const _templateIndicatorSubmitList = []
      formData.templateIndicatorSubmitList.forEach((group) => {
        group.details.forEach((element) => {
          const indicatorItem = { ...element }
          _templateIndicatorSubmitList.push(indicatorItem)
        })
      })
      const mergedFormData = {
        ...formData,
        templateIndicatorSubmitList: _templateIndicatorSubmitList,
      }
      if (id && Number(id) > 0) {
        await postEvaluationTemplateEdition(mergedFormData)
      } else {
        await postEvaluationTemplateCreation(mergedFormData)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // tags改变回调
  const handleTagsPaneTagsChange: TagsPaneFieldProps['onTagsChange'] = (newTags, type) => {
    const last = newTags[newTags.length - 1]
    switch (type) {
      case 'add':
        formActions.setFieldState(`templateIndicatorSubmitList.${newTags.length - 1}.details`, (state) => {
          FormPath.setIn(state, 'value', [])
          FormPath.setIn(state, 'props.x-component-props.groupName', last.name)
        })
        break
    }
    formActions.setFieldState(`templateIndicatorSubmitList`, (state) => {
      FormPath.setIn(state, 'props.x-component-props.tags', newTags)
      FormPath.setIn(state, 'visible', Boolean(newTags.length))
    })
    formActions.setFieldState('templateIndicatorSubmitListCtl', (state) => {
      FormPath.setIn(
        state,
        'errors',
        newTags.length ? [] : [translate('web.resource.member.qingxuanzebiaozhunzhibiao')],
      )
    })
  }

  // 确认生成标签前判断
  const handleTagsManagement = () => {
    const nextFlag = !areTagsEditable
    setAreTagsEditable(nextFlag)
  }

  const TagsExtra = (
    <>
      {isEditMode && (
        <Button type="link" onClick={handleTagsManagement}>
          {areTagsEditable
            ? translate('web.resource.member.baocunbianji')
            : translate('web.resource.member.guanlifenzu')}
        </Button>
      )}
    </>
  )

  useEffect(() => {
    if (id && Number(id) > 0) {
      getEvaluationTemplateDetail(id)
    }
  }, [])

  useEffect(() => {
    setFormValue({
      ...formValue,
      templateIndicatorSubmitList: formValue?.templateIndicatorSubmitListCtl,
    })
  }, [formValue?.templateIndicatorSubmitListCtl])

  return (
    <Spin spinning={isSpinning}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={`${
            !id
              ? translate('web.common.add')
              : isEditMode
              ? translate('web.common.edit')
              : translate('web.common.preview')
          }${translate('web.resource.member.gongyingshangpinfenmuban')}`}
          schema={formSchema}
          backLink={backLink}
          extraRight={
            isEditMode
              ? [
                  <Button
                    key="1"
                    type="primary"
                    loading={isSubmitting}
                    icon={<SaveOutlined />}
                    onClick={() => formActions.submit()}
                  >
                    {translate('web.common.save')}
                  </Button>,
                ]
              : undefined
          }
        />
        <FormDetailWrapper>
          <NiceForm
            previewPlaceholder=" "
            value={formValue}
            schema={formSchema}
            actions={formActions}
            editable={isEditMode}
            onSubmit={onFormSubmit}
            components={{
              Select,
              ArrayTable,
              TagsPane: TagsPaneField,
              TemplateIndicatorSubmitList: TemplateIndicatorSubmitListField,
              TemplateIndicatorSubmitListCtl: TemplateIndicatorSubmitListCtlField,
            }}
            expressionScope={{
              TagsExtra,
              areTagsEditable,
              handleTagsPaneTagsChange,
            }}
            effects={($, ctx) => {
              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(ctx)
              useAsyncSelect('templateType', getEvaluationTemplateTypeEnum, ['label', 'value'])
              createEffects(ctx, formActions, mockId)
            }}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>
    </Spin>
  )
}

export default MemberEvaluationTemplateEdition
