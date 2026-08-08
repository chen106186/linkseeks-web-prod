/*
 * @Description: 新增会员Form组件 - 渠道信息
 */
import React, { useEffect, useState } from 'react'
import { getMemberMobileImportPageitemsChannel, getMemberMobileImportPageitemsProvince } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Select, { SelectOptions } from '@/components/Select'
import Form from '@/packages/supplierAbility/components/Form'
import CustomInput from '@/packages/supplierAbility/components/CustomInput'
import { FormInstance } from '@/packages/supplierAbility/components/Form/FormStore'
import './index.scss'

export interface ChannelInfoFormItemsProps {
  /**
   * 会员类型ID
   */
  memberTypeId?: number
  /**
   * form实例
   */
  form: FormInstance
  /**
   * 渠道信息获取完毕后的回调
   */
  onFetchCallback?: (provided: boolean) => void
}

const ChannelInfoFormItems: React.FC<ChannelInfoFormItemsProps> = (props: ChannelInfoFormItemsProps) => {
  const { memberTypeId, form, onFetchCallback } = props

  const [upperMembers, setUpperMembers] = useState<SelectOptions>([])
  const [channelTypes, setChannelTypes] = useState<SelectOptions>([])
  const [memberRoles, setMemberRoles] = useState<SelectOptions>([])
  const [hideUpperRelationId, setHideUpperRelationId] = useState(false)

  // 获取渠道数据相关
  const fetchPageitemsChannel = async (typeId?: number) => {
    try {
      if (!typeId) {
        return null
      }
      const res = await getMemberMobileImportPageitemsChannel({
        memberTypeId: `${typeId}`,
      })
      if (res.code === 1000) {
        const { channelLevelTag = '', channelTypes, upperMembers } = res.data || {}
        return {
          channelTypes: channelTypes.map((item) => ({ label: item.channelTypeName, value: item.channelTypeId })),
          upperMembers: upperMembers.map((item) => ({ label: item.name, value: item.upperRelationId })),
          channelLevelTag,
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  // 上级渠道值改变联动
  const handleUpperRelationValueChange = (next: number) => {
    console.log('ValueChange', next)
    if (next === undefined) {
      return
    }

    getMemberMobileImportPageitemsProvince({
      upperRelationId: `${next}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { data = [] } = res
          const options = data.map((item) => ({ label: item.name, value: item.code }))
          console.log('optionsoptions', options)
          // formActions.setFieldState('areas.*.provinceCode', state => {
          //   FormPath.setIn(state, 'props.enum', options);
          // });
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  // 上级渠道手动输入联动
  const handleUpperRelationInputChange = (next: number) => {
    console.log('InputChange', next)
  }

  // 上级渠道手动输入联动
  const handleUpperRelationChange = (next: number) => {
    console.log('next', next)
    handleUpperRelationValueChange(next)
    handleUpperRelationInputChange(next)
  }

  useEffect(() => {
    fetchPageitemsChannel(memberTypeId).then((res) => {
      if (res) {
        const { channelLevelTag } = res
        // 渠道上级id，如果没有也是返回只有一项的数组
        if (res.upperMembers.length === 1 && !res.upperMembers[0].value) {
          setHideUpperRelationId(true)
          // set 一下值，触发 valueChange 事件
          form.setFieldsValue({
            upperRelationId: 0,
          })
          handleUpperRelationValueChange(0)
        } else {
          setUpperMembers(res.upperMembers)
        }
        setChannelTypes(res.channelTypes)
        form.setFieldsValue({
          channelLevel: channelLevelTag,
        })
        onFetchCallback?.(!!channelLevelTag)
      }
    })
  }, [memberTypeId])

  return (
    <MellowCard
      title="渠道信息"
      headStyle={{
        borderBottom: 'none',
      }}
      bodyStyle={{
        paddingTop: 0,
        paddingBottom: 0,
      }}
      ribbon
    >
      {!hideUpperRelationId ? (
        <Form.Item label="上级渠道" name="upperRelationId">
          <Select
            title="选择上级渠道"
            placeholder="请选择"
            options={upperMembers}
            contentAlign="right"
            onChange={handleUpperRelationChange}
          />
        </Form.Item>
      ) : null}
      <Form.Item label="渠道级别" name="channelLevel">
        <CustomInput editable={false} />
      </Form.Item>
      <Form.Item label="渠道类型" name="channelTypeId">
        <Select title="选择渠道类型" placeholder="请选择" options={channelTypes} contentAlign="right" />
      </Form.Item>
      <Form.Item label="渠道描述" name="remark">
        <CustomInput placeholder="(选填)请输入" />
      </Form.Item>
    </MellowCard>
  )
}

export default ChannelInfoFormItems
