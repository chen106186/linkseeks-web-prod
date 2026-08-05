/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-27 17:29:37
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:38:50
 * @Description: 资质证明form
 */
import React, { useMemo, useImperativeHandle } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { createAsyncFormActions, FormEffectHooks, ValidateNodeResult } from '@apps/formily'
import { DatePicker, Checkbox } from '@apps/formily'
import { normalizeFiledata } from '@/utils'
import NiceForm from '@/components/NiceForm'
import MellowCard from '@/components/MellowCard'
import { schema } from './schema'
import { useBusinessEffects } from '../QualitiesUploadFormItem/effects'
import QualitiesUpload from '../QualitiesUpload'
import QualitiesUploadFormItem from '../QualitiesUploadFormItem'

export type FileType = {
  /**
   * 文件名
   */
  name: string
  /**
   * 状态
   */
  status: string
  /**
   * 缩略图
   */
  thumbUrl?: string
  /**
   * uid
   */
  uid: string
  /**
   * 地址
   */
  url: string
}

export type QualitiesSubmitValueType = {
  /**
   * 文件
   */
  file: FileType[]
  /**
   * 到期日
   */
  expireDay: string
  /**
   * 有效期
   */
  permanent: number[]
}

export type ValueType = {
  /**
   * 文件name
   */
  name: string
  /**
   * 文件url
   */
  url: string
  /**
   * 到期日
   */
  expireDay: string
  /**
   * 有效期
   */
  permanent: number
}

interface IProps {
  /**
   * 值
   */
  value: ValueType[]
  /**
   * 表单值改变触发事件
   */
  onInputChange?: (values: QualitiesSubmitValueType[]) => void
}

export interface QualitiesRefHandle {
  validate: () => Promise<Promise<ValidateNodeResult>>
}

const formActions = createAsyncFormActions()
const { onFormInputChange$ } = FormEffectHooks

const MemberQualitiesForm: React.ForwardRefRenderFunction<QualitiesRefHandle, IProps> = (props, ref) => {
  const { value = [], onInputChange, ...rest } = props

  const intl = useIntl()

  useImperativeHandle(ref, () => ({
    validate: () => formActions.validate('*'),
  }))

  const initialValues = useMemo(
    () => ({
      qualities: value.map((item) => ({
        file: item.url ? [normalizeFiledata(item.url)] : [],
        expireDay: item.expireDay,
        permanent: item.permanent === 1 ? [item.permanent] : [],
      })),
    }),
    [value],
  )

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'member.components.MemberQualitiesForm.title' })}
      bodyStyle={{
        paddingBottom: 0,
      }}
      {...rest}
    >
      <NiceForm
        previewPlaceholder=" "
        initialValues={initialValues}
        components={{
          DatePicker,
          Checkbox,
          CheckboxGroup: Checkbox.Group,
          QualitiesUpload,
          QualitiesUploadFormItem,
        }}
        effects={(context, actions) => {
          useBusinessEffects(context, actions, 'qualities')

          onFormInputChange$().subscribe((state) => {
            onInputChange?.(state.values.qualities)
          })
        }}
        actions={formActions}
        schema={schema}
      />
    </MellowCard>
  )
}

const MemberQualitiesFormForWard = React.forwardRef<QualitiesRefHandle, IProps>(MemberQualitiesForm)

export default MemberQualitiesFormForWard
