/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-27 16:38:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:49:10
 * @Description: 入库信息form
 */
import React, { useImperativeHandle } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Radio, Checkbox, ArrayTable } from '@apps/formily'
import { createAsyncFormActions, FormEffectHooks } from '@apps/formily'
import { ValidateNodeResult } from '@apps/formily'
import themeConfig from '@apps/config/lingxi.theme.config'
import NiceForm from '@/components/NiceForm'
import { schemaPro, GroupItem } from './schema'
import AreaSelect from '../AreaSelect'

export type DepositValueType = { [key: string]: any }

interface IProps {
  /**
   * 资料组
   */
  groups: GroupItem[]
  /**
   * 表单值改变触发事件
   */
  onInputChange?: (values: DepositValueType) => void
}

export interface DepositRefHandle {
  validate: () => Promise<Promise<ValidateNodeResult>>
}

const formActions = createAsyncFormActions()
const { onFormInputChange$ } = FormEffectHooks

const MemberDocIncomingInfoForm: React.ForwardRefRenderFunction<DepositRefHandle, IProps> = (props, ref) => {
  const { groups, onInputChange, ...rest } = props

  const intl = useIntl()

  useImperativeHandle(ref, () => ({
    validate: () => formActions.validate('*'),
  }))

  return (
    <NiceForm
      previewPlaceholder="' '"
      components={{
        RadioGroup: Radio.Group,
        CheckboxGroup: Checkbox.Group,
        AreaSelect,
        ArrayTable,
      }}
      effects={() => {
        onFormInputChange$().subscribe((state) => {
          onInputChange?.(state.values)
        })
      }}
      actions={formActions}
      schema={schemaPro(groups)}
      style={{
        paddingLeft: themeConfig['@margin-xs'],
        paddingRight: themeConfig['@margin-xs'],
      }}
    />
  )
}

const MemberDocIncomingInfoFormForWard = React.forwardRef<DepositRefHandle, IProps>(MemberDocIncomingInfoForm)

export default MemberDocIncomingInfoFormForWard
