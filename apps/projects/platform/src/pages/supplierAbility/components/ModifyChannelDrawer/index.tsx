/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-07 13:47:02
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 11:34:40
 * @Description: 修改渠道信息 抽屉
 */
import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Drawer, Button } from 'antd'
import { DatePicker } from '@apps/formily'
import { createFormActions, createAsyncFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import NiceForm from '@/components/NiceForm'
import { schema } from './schema'
import // getMemberSupplierAbilityMaintenanceDetailBasicChannelProvince,
// getMemberSupplierAbilityMaintenanceDetailBasicChannelCity,
'@apps/apis'

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

export type ValueType = {
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

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * Form 确认事件
   */
  onSubmit: (values: ValueType) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
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
   * 确认按钮 loading
   */
  submitLoading: boolean
}

const formActions = createAsyncFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInputChange$ } = FormEffectHooks

const VerifyComingDataDrawer: React.FC<IProps> = (props: IProps) => {
  const { visible, onSubmit, onClose, channelInfo, channelValue, submitLoading } = props

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

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values: ValueType) => {
    if (onSubmit) {
      const { upperRelationId, ...rest } = values
      onSubmit({ upperRelationId: upperRelationId || 0, ...rest })
    }
  }

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

    //   getMemberSupplierAbilityMaintenanceDetailBasicChannelProvince({
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

    //   getMemberSupplierAbilityMaintenanceDetailBasicChannelCity({
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

  return (
    <Drawer
      title={intl.formatMessage({ id: 'member.components.ModifyChannelDrawer.title' })}
      width={600}
      onClose={handleClose}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={handleClose} style={{ marginRight: 16 }}>
            {intl.formatMessage({ id: 'member.actions.cancel' })}
          </Button>
          <Button onClick={() => formActions.submit()} type="primary" loading={submitLoading}>
            {intl.formatMessage({ id: 'member.actions.confirm' })}
          </Button>
        </div>
      }
    >
      <NiceForm
        previewPlaceholder="' '"
        initialValues={channelValue}
        components={{
          DatePicker,
        }}
        effects={($, { setFieldState }) => {
          useBusinessEffects()
        }}
        actions={formActions}
        schema={schema}
        onSubmit={(values) => handleSubmit(values)}
      />
    </Drawer>
  )
}

export default VerifyComingDataDrawer
