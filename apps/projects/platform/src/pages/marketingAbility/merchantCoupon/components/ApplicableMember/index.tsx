/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-02 16:56:32
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-22 14:30:32
 * @Description: 适用用户
 */
import React, { useMemo } from 'react'
import { SchemaForm, SchemaMarkupField as Field } from '@apps/formily'
import MellowCard from '@/components/MellowCard'
import TofuCheckGroup from '../../../components/FormilyFieldItem/TofuCheckGroup'
import MemberCheckboxGroup from '../../../components/FormilyFieldItem/MemberCheckboxGroup'
import { OptionItemType as MemberOptionItemType } from '../../../components/MemberCheckboxGroup'
import ApplicableList from '../../../components/FormilyFieldItem/ApplicableList'
import { useIntl } from '@linkseeks/i18n'

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
     * 适用用户列表
     */
    applicationMemberLevel: ApplicationMemberLevelType[]
  }
}

const ApplicableMember: React.FC<IProps> = (props) => {
  const intl = useIntl()
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
      title={intl.formatMessage({ id: 'merchantCoupon.suitUsers' })}
      bodyStyle={{
        paddingBottom: 0,
      }}
      {...rest}
    >
      <SchemaForm labelAlign="left" labelCol={3} wrapperCol={21} fields={useFields()} editable={false} colon={false}>
        <Field
          type="string"
          enum={applicableMember?.suitableMemberTypes?.map((item) => ({ ...item, label: item.name }))}
          title={intl.formatMessage({ id: 'merchantCoupon.suitUsers' })}
          name="suitableMemberTypes"
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
