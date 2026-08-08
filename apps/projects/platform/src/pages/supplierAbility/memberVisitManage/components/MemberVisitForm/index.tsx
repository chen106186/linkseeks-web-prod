/*
 * @Description: 新增/修改 平台会员等级
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Input, DatePicker } from '@apps/formily'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { getMemberSupplierVisitVisitTypeItems } from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import schema from './schema'
import { anchorsArr } from './config'
import AnchorCardVirtualFieldWrap from './components/AnchorCardVirtualFieldWrap'
import MemberVisitedFieldItem, { SubMemberValue } from './components/SubMemberFieldItem'
import VisitorMemberFieldItem, { VisitorMemberValue } from './components/VisitorMemberFieldItem'
import { useWebIntl } from '@apps/locales'
import styles from './index.less'

const formActions = createFormActions()
const { onFormInit$, onFormInputChange$ } = FormEffectHooks

export type SubmitValueType = {
  /**
   * 拜访主题
   */
  visitTheme: string
  /**
   * 会员名称
   */
  subMember: SubMemberValue
  /**
   * 拜访类型
   */
  visitType: number
  /**
   * 拜访人
   */
  visitorMember: VisitorMemberValue
  /**
   * 拜访级别
   */
  visitLevel: number
  /**
   * 拜访日期
   */
  visitDate: string
  /**
   * 同行人
   */
  peer: string
  /**
   * 备注
   */
  visitRemark: string
  /**
   * 附件
   */
  files?: React.ComponentProps<typeof FormilyUploadFiles>['value']
}

// 暂定
export type SubmitValue = SubmitValueType & {}

interface MemberVisitFormProps {
  /**
   * title
   */
  title: string
  /**
   * 数据id
   */
  value?: SubmitValueType
  /**
   * 点击保存触发事件
   */
  onSubmit?: (value: SubmitValue) => Promise<void>
  /**
   * 是否可编辑的，默认 true
   */
  editable?: boolean
  /**
   * 是否禁用部分不可以编辑的表单项，默认 false
   */
  cloudy?: boolean
}

const MemberVisitForm: React.FC<MemberVisitFormProps> = (props) => {
  const { title, value, onSubmit, editable = true, cloudy = false } = props
  const intl = useIntl()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const translate = useWebIntl()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const handleSubmit = (values: SubmitValueType) => {
    if (onSubmit) {
      setSubmitLoading(true)
      onSubmit(values)
        .then(() => {
          setUnsaved(false)
        })
        .finally(() => {
          setSubmitLoading(false)
        })
    }
  }

  return (
    <div className={styles['role-rule-config-form']}>
      <PageHeaderWrapper
        title={title}
        items={anchorsArr}
        extra={[
          editable ? (
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => formActions.submit()}
            >
              {translate('web.common.save')}
            </Button>
          ) : null,
        ]}
      >
        <NiceForm
          previewPlaceholder=" "
          onSubmit={handleSubmit}
          actions={formActions}
          initialValues={value}
          components={{
            TextArea: Input.TextArea,
            DatePicker,
            FormilyUploadFiles,
            AnchorCardVirtualFieldWrap,
            MemberVisitedFieldItem,
            VisitorMemberFieldItem,
          }}
          effects={($, actions) => {
            const { setFieldState } = actions

            onFormInit$().subscribe(() => {
              if (cloudy) {
                actions.setFieldState('*(memberApplicableRole)', (state) => {
                  state.editable = false
                })
              }
            })

            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })

            useAsyncInitSelect(['visitType', 'visitLevel'], async () => {
              const { data, code } = await getMemberSupplierVisitVisitTypeItems()
              if (code === 1000) {
                return {
                  visitType: data.visitTypes.map((item) => ({ label: item.visitTypeName, value: item.visitType })),
                  visitLevel: data.visitLevels.map((item) => ({ label: item.visitLevelName, value: item.visitLevel })),
                }
              }
              return {}
            })
          }}
          schema={schema}
          editable={!!editable}
        />
      </PageHeaderWrapper>
    </div>
  )
}

export default MemberVisitForm
