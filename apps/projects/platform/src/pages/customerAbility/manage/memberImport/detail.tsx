/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 11:43:49
 * @Description: 会员导入-会员详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { IRequestSuccess } from '@/index'
import MemberProfile, { DetailType } from '../../components/MemberProfile'
import { getMemberCustomerAbilitySubDetail } from '@apps/apis'

const ImportDetail: React.FC<{}> = () => {
  const { id, validateId } = usePageStatus()

  const getBasicInfo = (): Promise<IRequestSuccess<DetailType>> => {
    return new Promise((resolve, reject) => {
      getMemberCustomerAbilitySubDetail({
        memberId: id,
        validateId,
      })
        .then(({ code, data: { createTime, verifySteps, currentStep, groups, ...rest } }) => {
          if (code === 1000) {
            const data = {
              ...rest,
              registerTime: createTime,
              outerVerifySteps: verifySteps,
              currentOuterStep: currentStep,
              registerDetails: groups,
            }
            resolve({ data })
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const { data: dataSource, loading } = useHttpRequest<DetailType>(getBasicInfo, { manual: false })

  return <MemberProfile dataSource={dataSource} loading={loading} />
}

export default ImportDetail
