/*
 * @Description: 客户评分模板 > 客户标准指标定义
 */
import React, { useEffect, useState } from 'react'
import { Button, Card, message, Spin } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions, FormPath } from '@apps/formily'
import { ArrayTable } from '@apps/formily'

import NiceForm from '@/components/NiceForm'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import TagsPaneField, { TagsPaneFieldProps } from '../../components/TagsPaneField'
import MemberScoringIndicatorSubmitListField, {
  I_IndicatorGroup,
} from '../components/MemberScoringIndicatorSubmitListField'

import { memberTargetDefinitionFormSchema } from './schema'
import { createEffects } from './effects'

import styles from './index.less'

import { getMemberCustomerScoringIndicatorPage, postMemberCustomerScoringIndicatorSubmit } from '@apps/apis'
import { useWebIntl } from '@apps/locales'

interface I_FormData {
  memberScoringIndicatorSubmitList: Array<{
    details: I_IndicatorGroup['elements']
  }>
}

const formActions = createFormActions()

let mockId = Number.MIN_SAFE_INTEGER

const MemberEvaluationTargetDefinition: React.FC<{}> = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [areTagsEditable, setAreTagsEditable] = useState(false)
  const [formSchema] = useState<any>(() => ({ ...memberTargetDefinitionFormSchema }))
  const [formValue, setFormValue] = useState<I_FormData>()

  const translate = useWebIntl()
  /** 查询 标准指标详情 */
  const getScoringIndicatorSubmitList = async () => {
    setIsSpinning(true)
    const res = await getMemberCustomerScoringIndicatorPage()
    if (res.code === 1000 && Array.isArray(res.data)) {
      const providedTags =
        res.data?.map((item: I_IndicatorGroup) => ({
          name: item.groupName,
          key: `${mockId++}`,
        })) || []
      setFormValue({
        memberScoringIndicatorSubmitList: res.data?.map((item: I_IndicatorGroup) => ({
          details: item.elements,
        })),
      })
      formActions.setFieldState('memberScoringIndicatorSubmitList', (state) => {
        FormPath.setIn(state, 'props.x-component-props.tags', providedTags)
      })
      // 设置 指标明细title
      for (let i = 0; i < providedTags.length; i++) {
        const item = providedTags[i]
        formActions.setFieldState(`memberScoringIndicatorSubmitList.${i}.details`, (state) => {
          FormPath.setIn(state, 'props.x-component-props.groupName', item.name)
        })
      }
      setIsSpinning(false)
    }
  }

  const onFormSubmit = async (formData: I_FormData) => {
    try {
      setIsSubmitting(true)
      const { memberScoringIndicatorSubmitList } = formData
      const _memberScoringIndicatorSubmitList = []
      memberScoringIndicatorSubmitList.forEach((scoringIndicator) => {
        scoringIndicator.details.forEach((element) => {
          const indicatorItem = { ...element }
          // 负数为虚拟id，作key值使用，提交需去掉
          if (indicatorItem?.id < 0) {
            indicatorItem.id = undefined
          }
          _memberScoringIndicatorSubmitList.push(indicatorItem)
        })
      })
      const res = await postMemberCustomerScoringIndicatorSubmit(
        {
          memberScoringIndicatorSubmitList: _memberScoringIndicatorSubmitList,
        },
        { ctlType: 'none' },
      )
      if (res.code === 1000) {
        message.success(translate('web.resource.member.yichenggongbaocunbiaozhunzhibiao'))
        // getScoringIndicatorSubmitList()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // tags改变回调
  const handleTagsPaneTagsChange: TagsPaneFieldProps['onTagsChange'] = (newTags, type) => {
    if (type === 'add') {
      const last = newTags[newTags.length - 1]
      // 设置 指标明细 title
      formActions.setFieldState(`memberScoringIndicatorSubmitList.${newTags.length - 1}.details`, (state) => {
        FormPath.setIn(state, 'value', [])
        FormPath.setIn(state, 'props.x-component-props.groupName', last.name)
      })
    }
  }

  const handleBeforeConfirm = (tagName: string) => {
    if (tagName.length > 12) {
      message.warn(translate('web.resource.member.tip_zhibiaofenzu'))
      return false
    }
    return true
  }

  // 确认生成标签前判断
  const handleTagsManagement = () => {
    const nextFlag = !areTagsEditable
    setAreTagsEditable(nextFlag)
  }

  const TagsExtra = (
    <>
      <Button type="link" onClick={handleTagsManagement}>
        {areTagsEditable ? translate('web.resource.member.baocunbianji') : translate('web.resource.member.guanlifenzu')}
      </Button>
    </>
  )

  useEffect(() => {
    getScoringIndicatorSubmitList()
  }, [])

  return (
    <PageHeaderWrapper className={styles['target_definition']}>
      <Card>
        <Spin spinning={isSpinning}>
          <NiceForm
            previewPlaceholder=" "
            value={formValue}
            schema={formSchema}
            actions={formActions}
            onSubmit={onFormSubmit}
            components={{
              ArrayTable,
              TagsPane: TagsPaneField,
              MemberScoringIndicatorSubmitList: MemberScoringIndicatorSubmitListField,
            }}
            expressionScope={{
              TagsExtra,
              areTagsEditable,
              handleBeforeConfirm,
              handleTagsPaneTagsChange,
            }}
            effects={($, ctx) => {
              createEffects(ctx, formActions, mockId)
            }}
          />
          {/* 客户标准指标-新增编辑权限 */}
          <EditAuthButton>
            <Button
              type="primary"
              loading={isSubmitting}
              style={{ marginTop: 16 }}
              onClick={() => formActions.submit()}
            >
              {translate('web.common.save')}
            </Button>
          </EditAuthButton>
        </Spin>
      </Card>
    </PageHeaderWrapper>
  )
}

export default MemberEvaluationTargetDefinition
