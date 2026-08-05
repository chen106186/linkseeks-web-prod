/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-27 10:36:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 11:31:17
 * @Description: 渠道信息form
 */
import React, { useEffect, useImperativeHandle } from 'react'
import { createAsyncFormActions, FormEffectHooks, FormPath, ValidateNodeResult } from '@apps/formily'
import { useIntl } from '@linkseeks/i18n'
import MellowCard from '@/components/MellowCard'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'
// import { getMemberSupplierDepositVerifyProvince, getMemberSupplierDepositVerifyCity } from '@apps/apis'

const formActions = createAsyncFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInputChange$ } = FormEffectHooks

export type AreaCodesType = {
  /**
   * 省编码
   */
  provinceCode: string
  /**
   * 市编码
   */
  cityCode: string
}

export type ChannelValueType = {
  /**
   * 渠道类型Id，当会员是渠道会员时必填
   */
  channelTypeId: number
  /**
   * 上级会员Id，当会员是渠道会员时要大于等于0
   */
  upperRelationId: number
  /**
   * 上级会员Id，当会员是渠道会员时要大于等于0
   */
  areaCodes: AreaCodesType[]
  /**
   * 渠道描述
   */
  remark: string
}

export interface ChannelRefHandle {
  validate: () => Promise<Promise<ValidateNodeResult>>
}

interface IProps {
  /**
   * 渠道信息
   */
  channelInfo: {
    /**
     * 上级会员列表
     */
    upperMembers: {
      /**
       * 上级会员关系Id
       */
      upperRelationId: number
      /**
       * 上级会员公司名称+角色名称
       */
      name: string
    }[]
    /**
     * 渠道类型
     */
    channelTypes: {
      /**
       * 渠道类型Id
       */
      channelTypeId: number
      /**
       * 渠道类型名称
       */
      channelTypeName: string
    }[]
  }
  /**
   * 渠道信息值
   */
  channelValue: {
    /**
     * 已经选择的上级会员关系Id
     */
    upperRelationId: number
    /**
     * 渠道类型
     */
    channelTypeId: number
    /**
     * 渠道信息-渠道级别
     */
    channelLevel: string
    /**
     * 代理城市编码列表
     */
    areaCodes: AreaCodesType[]
    /**
     * 渠道信息-渠道描述
     */
    remark: string
  }
  /**
   * 表单值改变触发事件
   */
  onInputChange?: (values: ChannelValueType) => void
}

const MemberChannelInfoForm: React.ForwardRefRenderFunction<ChannelRefHandle, IProps> = (props, ref) => {
  const { onInputChange, channelInfo, channelValue, ...rest } = props

  const intl = useIntl()

  useEffect(() => {
    if (!channelInfo) {
      return
    }
    let { upperMembers, channelTypes } = channelInfo
    upperMembers = upperMembers || []
    channelTypes = channelTypes || []
    const channelType = channelTypes.map((item) => ({ label: item.channelTypeName, value: item.channelTypeId }))

    // 渠道上级id，如果没有也是返回只有一项的数组
    if (upperMembers.length === 1 && !upperMembers[0].upperRelationId) {
      formActions.setFieldState('upperRelationId', (state) => {
        FormPath.setIn(state, 'display', false)
      })
    } else {
      const upperMembersOptions = upperMembers.map((item) => ({ label: item.name, value: item.upperRelationId }))
      formActions.setFieldState('upperRelationId', (state) => {
        FormPath.setIn(state, 'props.enum', upperMembersOptions)
      })
    }

    formActions.setFieldState('channelTypeId', (state) => {
      FormPath.setIn(state, 'props.enum', channelType)
    })
  }, [channelInfo])

  useEffect(() => {
    if (!channelValue) {
      return
    }
    const { channelLevel } = channelValue

    if (channelLevel !== undefined && !channelLevel) {
      formActions.setFieldState('INVESTIGATE_INFO', (state) => {
        FormPath.setIn(state, 'visible', false)
      })
    }
  }, [channelValue])

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()

    // 渠道上级改变时，请求出对应的省级数据
    onFieldInputChange$('upperRelationId').subscribe((fieldState) => {
      // 清空渠道原来数据
      linkage.value('areaCodes', [])
    })

    // 渠道上级改变时，请求出对应的省级数据
    // onFieldValueChange$('upperRelationId').subscribe((fieldState) => {
    //   if (fieldState.value === undefined) {
    //     return
    //   }

    //   getMemberSupplierDepositVerifyProvince({
    //     upperRelationId: fieldState.value,
    //   })
    //     .then((res) => {
    //       if (res.code === 1000) {
    //         const { data = [] } = res
    //         const options = data.map((item) => ({ label: item.name, value: item.code }))
    //         formActions.setFieldState('areaCodes.*.provinceCode', (state) => {
    //           FormPath.setIn(state, 'props.enum', options)
    //         })
    //       }
    //     })
    //     .catch((err) => {
    //       console.warn(err)
    //     })
    // })

    // 省级改变时，，请求出对应的市级数据
    onFieldInputChange$('areaCodes.*.provinceCode').subscribe((fieldState) => {
      formActions.setFieldState(
        FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
        (state) => {
          FormPath.setIn(state, 'value', undefined)
        },
      )
    })

    // 省级改变时，，请求出对应的市级数据
    // onFieldValueChange$('areaCodes.*.provinceCode').subscribe(async (fieldState) => {
    //   if (fieldState.value === undefined) {
    //     return
    //   }
    //   const upperRelationValue = await formActions.getFieldValue('upperRelationId')

    //   formActions.setFieldState(
    //     FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
    //     (state) => {
    //       FormPath.setIn(state, 'props.x-props.hasFeedback', true)
    //       FormPath.setIn(state, 'loading', true)
    //     },
    //   )

    //   getMemberSupplierDepositVerifyCity({
    //     upperRelationId: upperRelationValue,
    //     provinceCode: fieldState.value,
    //   })
    //     .then((res) => {
    //       if (res.code === 1000) {
    //         const { data = [] } = res
    //         const options = data.map((item) => ({ label: item.name, value: item.code }))
    //         formActions.setFieldState(
    //           FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
    //           (state) => {
    //             FormPath.setIn(state, 'props.enum', options)
    //           },
    //         )
    //       }
    //     })
    //     .catch((err) => {
    //       console.warn(err)
    //     })
    //     .finally(() => {
    //       formActions.setFieldState(
    //         FormPath.transform(fieldState.name, /\d/, ($1) => `areaCodes.${$1}.cityCode`),
    //         (state) => {
    //           FormPath.setIn(state, 'loading', false)
    //         },
    //       )
    //     })
    // })
  }

  useImperativeHandle(ref, () => ({
    validate: () => formActions.validate('*'),
  }))

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'member.components.MemberChannelInfoForm.title' })}
      bodyStyle={{
        paddingBottom: 0,
      }}
      {...rest}
    >
      <NiceForm
        previewPlaceholder="' '"
        initialValues={channelValue}
        effects={($, { setFieldState }) => {
          useBusinessEffects()

          onFormInputChange$().subscribe((state) => {
            onInputChange?.(state.values)
          })
        }}
        actions={formActions}
        schema={schema}
      />
    </MellowCard>
  )
}

const MemberChannelInfoFormForWard = React.forwardRef<ChannelRefHandle, IProps>(MemberChannelInfoForm)

export default MemberChannelInfoFormForWard
