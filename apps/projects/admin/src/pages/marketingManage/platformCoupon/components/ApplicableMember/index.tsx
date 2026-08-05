/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-02 16:56:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-12 15:08:46
 * @Description: 适用用户
 */
import React, { useMemo } from 'react'
import { SchemaForm, SchemaMarkupField as Field } from '@apps/formily'
import MellowCard from '@/components/MellowCard'
import TofuCheckGroup from '../FormilyFieldItem/TofuCheckGroup'
import MemberCheckboxGroup from '../FormilyFieldItem/MemberCheckboxGroup'
import { OptionItemType as MemberOptionItemType } from '../MemberCheckboxGroup'
import ApplicableList from '../FormilyFieldItem/ApplicableList'

export type ApplicationMemberLevelType = Omit<MemberOptionItemType, 'value'> & { id: string }
export type SuitableMemberType = {
  /**
   * 值
   */
  value: number
  /**
   * 名称
   */
  name: string
}

interface IProps {
  /**
   * 适用会员信息
   */
  applicableMember: {
    /**
     * 适用用户
     */
    suitableMemberTypes: SuitableMemberType[]
    /**
     * 适用用户类型
     */
    memberTypes: SuitableMemberType[]
    /**
     * 适用用户列表
     */
    applicationMemberLevel: ApplicationMemberLevelType[]
  }
}

const ApplicableMember: React.FC<IProps> = (props) => {
  const { applicableMember, ...rest } = props

  const useFields = (): any =>
    useMemo(
      () => ({
        TofuCheckGroup,
        MemberCheckboxGroup,
        ApplicableList,
      }),
      [],
    )

  const showApplicationMemberLevel = true

  return (
    <MellowCard
      title="适用用户"
      bodyStyle={{
        paddingBottom: 0,
      }}
      {...rest}
    >
      <SchemaForm labelAlign="left" labelCol={3} wrapperCol={21} fields={useFields()} editable={false} colon={false}>
        <Field
          type="string"
          enum={applicableMember?.suitableMemberTypes?.map((item) => ({ ...item, label: item.name }))}
          title="适用用户"
          name="suitableMemberTypes"
          x-component="TofuCheckGroup"
          x-component-props={{
            ediabled: false,
          }}
        />
        <Field
          type="string"
          enum={applicableMember?.memberTypes?.map((item) => ({ ...item, label: item.name }))}
          title="适用会员类型"
          name="memberTypes"
          x-component="TofuCheckGroup"
          x-component-props={{
            ediabled: false,
          }}
        />
        {showApplicationMemberLevel && (
          <>
            <Field
              type="string"
              enum={applicableMember?.applicationMemberLevel?.map((item) => ({ ...item, value: item.id }))}
              name="applicationMemberLevel"
              x-component="MemberCheckboxGroup"
            />
          </>
        )}
      </SchemaForm>
    </MellowCard>
  )
}

export default ApplicableMember
