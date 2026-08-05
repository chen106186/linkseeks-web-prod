/**
 * @Description 待提交变更申请单 - 添加
 */
import React, { useMemo, useState } from 'react'
import { message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import { postMemberSupplierLifecycleWaitAddAdd } from '@apps/apis'
import SupplierModifiesForm, { SubmitCallValueType } from './components/SupplierModifiesForm'
import { useWebIntl } from '@apps/locales'

type ModifiesPartialType = {
  /**
   * 下级会员Id
   */
  subMemberId: string
  /**
   * 下级会员角色Id
   */
  subRoleId: string
  /**
   * 下级会员角色名称
   */
  subMemberName: string
  /**
   * 当前生命周期名称
   */
  lifeCycleStageName: string
  /**
   * 当前生命周期
   */
  lifeCycleStageId: string
}

const AddSupplierModifies: React.FC<any> = (props) => {
  const query = useQuery()
  const translate = useWebIntl()

  const modifiesDetails = useMemo(
    () =>
      query.subMemberId && query.subRoleId && query.subMemberName && query.lifeCycleStageName && query.lifeCycleStageId
        ? {
            subMemberId: +query.subMemberId,
            subRoleId: +query.subRoleId,
            subMemberName: query.subMemberName,
            currentLifecycleStageName: query.lifeCycleStageName,
            currentLifecycleStageId: +query.lifeCycleStageId,
          }
        : undefined,
    [],
  )

  const handleSubmit = (value: SubmitCallValueType): Promise<void> =>
    new Promise((resolve, reject) => {
      const msg = message.loading({
        content: translate('web.common.addloadingpleasewaiting'),
        duration: 0,
      })
      postMemberSupplierLifecycleWaitAddAdd(value)
        .then((res) => {
          if (res.code === 1000) {
            resolve()
            setTimeout(() => {
              history.goBack()
            }, 800)
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          msg()
        })
    })

  return (
    <SupplierModifiesForm
      title={translate('web.resource.member.xinzengbiangengshenqingdan')}
      onSubmit={handleSubmit}
      value={modifiesDetails as unknown as SubmitCallValueType}
    />
  )
}

export default AddSupplierModifies
