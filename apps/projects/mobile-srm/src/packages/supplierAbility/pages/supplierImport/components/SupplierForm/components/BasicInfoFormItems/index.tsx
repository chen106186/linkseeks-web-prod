/*
 * @Description: 新增会员Form组件 - 基础信息
 */
import React, { useEffect, useState } from 'react'
import { getMemberMobileImportPageitemsBasic, getMemberMobileImportPageitemsRole } from '@apps/apis'
import MellowCard from '@/components/MellowCard'
import Select, { SelectOptions } from '@/components/Select'
import Form from '@/packages/supplierAbility/components/Form'
import CustomInput from '@/packages/supplierAbility/components/CustomInput'
import './index.scss'

export interface BasicInfoFormItemsProps {}

const BasicInfoFormItems: React.FC<BasicInfoFormItemsProps> = (props: BasicInfoFormItemsProps) => {
  const {} = props

  const [memberTypes, setMemberTypes] = useState<SelectOptions>([])
  const [countryCodes, setCountryCodes] = useState<SelectOptions>([])
  const [memberRoles, setMemberRoles] = useState<SelectOptions>([])

  // 会员类型、注册手机下拉框
  const fetchPageitemsBasic = async () => {
    try {
      const res = await getMemberMobileImportPageitemsBasic()
      if (res.code === 1000) {
        const { memberTypes = [], countryCodes = [] } = res.data || {}
        return {
          memberTypeId: memberTypes.map((item) => ({ label: item.memberTypeName, value: item.memberTypeId })),
          countryCodeId: countryCodes.map((item) => ({ label: item.text, value: item.id })),
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    fetchPageitemsBasic().then((res) => {
      if (res) {
        setMemberTypes(res.memberTypeId)
        setCountryCodes(res.countryCodeId)
      }
    })
  }, [])

  // 会员类型值改变联动
  const handleMemberTypeValueChange = (next: number) => {
    console.log('ValueChange', next)
    // 获取会员角色
    getMemberMobileImportPageitemsRole({
      memberTypeId: `${next}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { data = [] } = res
          const options = data.map((item) => ({ label: item.roleName, value: item.roleId }))
          setMemberRoles(options)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  // 会员类型手动输入联动
  const handleMemberTypeInputChange = (next: number) => {
    console.log('InputChange', next)
  }

  // 会员类型手动输入联动
  const handleMemberTypeChange = (next: number) => {
    console.log('next', next)
    handleMemberTypeValueChange(next)
    handleMemberTypeInputChange(next)
  }

  return (
    <MellowCard
      title="供应商基本信息"
      headStyle={{
        borderBottom: 'none',
      }}
      bodyStyle={{
        paddingTop: 0,
        paddingBottom: 0,
      }}
      ribbon
    >
      <Form.Item label="供应商类型" name="memberTypeId" valuePropName="checked">
        <Select
          title="选择供应商类型"
          placeholder="请选择"
          options={memberTypes}
          contentAlign="right"
          onChange={handleMemberTypeChange}
        />
      </Form.Item>
      <Form.Item label="供应商角色" name="roleId">
        <Select title="选择供应商角色" placeholder="请选择" options={memberRoles} contentAlign="right" />
      </Form.Item>
      <Form.Item label="电话区号" name="countryCodeId">
        <Select title="选择电话区号" placeholder="请选择" options={countryCodes} contentAlign="right" />
      </Form.Item>
      <Form.Item label="注册手机号" name="phone">
        <CustomInput placeholder="点击输入" />
      </Form.Item>
      <Form.Item label="注册邮箱" name="email">
        <CustomInput placeholder="点击输入" />
      </Form.Item>
    </MellowCard>
  )
}

export default BasicInfoFormItems
