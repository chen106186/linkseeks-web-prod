/*
 * @Description: 待审核入库资料详情
 */
import React from 'react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { getMemberSupplierDepositVerifyDetail, GetMemberDepositVerifyDetailResponse } from '@apps/apis'
import { IRequestSuccess } from '@/index'
import MemberProfile from '../../components/MemberProfile'

const SupplierDepositDataDetails: React.FC<{}> = () => {
  const { validateId } = usePageStatus()

  const getDetailsData = (): Promise<IRequestSuccess<GetMemberDepositVerifyDetailResponse>> => {
    return new Promise((resolve, reject) => {
      getMemberSupplierDepositVerifyDetail({
        validateId,
      }).then((res) => {
        if (res.code === 1000) {
          res.data.depositDetails = res.data.depositDetailTexts
        }
        resolve(res)
      })
    })
  }

  const { data: dataSource, loading } = useHttpRequest(getDetailsData, { manual: false })

  return <MemberProfile dataSource={dataSource} loading={loading} showChannelInfo={false} />
}

export default SupplierDepositDataDetails
