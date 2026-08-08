/*
 * @Description: 审核入库资料
 */
import React, { useState, useRef } from 'react'
import { Button, Space, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { postMemberSupplierDepositVerify, getMemberSupplierDepositVerifyDetail } from '@apps/apis'
import { normalizeFiledata } from '@/utils'
import { IRequestSuccess } from '@/index'
import VerifyComingDataDrawer, { ValueType as VerifyData } from './components/VerifyComingDataDrawer'
import MemberProfile, { DetailType } from '../../components/MemberProfile'
import { ChannelValueType, ChannelRefHandle } from '../../components/MemberChannelInfoForm'
import { DepositValueType, DepositRefHandle } from '../../components/MemberDocIncomingInfoForm'
import { QualitiesSubmitValueType, QualitiesRefHandle } from '../../components/MemberQualitiesForm'

const SupplierDepositDataVerify: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [visibleVerifyDrawer, setVisibleVerifyDrawer] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const depositFormRef = useRef<DepositRefHandle | null>(null)
  const channelFormRef = useRef<ChannelRefHandle | null>(null)
  const qualitiesFormRef = useRef<QualitiesRefHandle | null>(null)
  const channelInfoRef = useRef<ChannelValueType | null>(null)
  const depositInfoRef = useRef<DepositValueType | null>(null)
  const qualitiesRef = useRef<QualitiesSubmitValueType[] | null>([])

  const fetchDetail = (): Promise<IRequestSuccess<DetailType>> => {
    return new Promise((resolve, reject) => {
      getMemberSupplierDepositVerifyDetail({
        validateId,
      })
        .then((res) => {
          if (res.data && res.data.upperMembers) {
            const newUpperMembers = [...(res.data.upperMembers || [])]

            // 手动添加一个选项
            if (newUpperMembers.findIndex((item) => item.upperRelationId === 0) === -1) {
              newUpperMembers.unshift({
                upperRelationId: 0,
                name: intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.verify.upperMember.null' }),
              })
            }
            res.data.upperMembers = newUpperMembers
          }
          if (res.code === 1000) {
            // 要手动将旧数据带过去
            const depositDetails = {}
            res.data.depositDetails.forEach((item) => {
              if (item.elements) {
                for (let j = 0; j < item.elements.length; j++) {
                  const ele = item.elements[j]
                  if (ele.fieldType !== 'list') {
                    depositDetails[ele.fieldName] = ele.fieldValue
                  }
                  if (ele.fieldType === 'list') {
                    depositDetails[ele.fieldName] = ele.registers?.map((element) => {
                      let obj = {}
                      element.forEach((val) => {
                        obj[val.fieldName] = val.fieldValue
                      })
                      return obj
                    })
                  }
                }
              }
            })
            depositInfoRef.current = depositDetails
            qualitiesRef.current = res.data.qualities.map((item) => ({
              file: item.url ? [normalizeFiledata(item.url)] : [],
              expireDay: item.expireDay,
              permanent: item.permanent === 1 ? [item.permanent] : [],
            }))
          }
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const { data: dataSource, loading } = useHttpRequest<DetailType>(fetchDetail, { manual: false })

  const intl = useIntl()

  const handleVisibleVerifyDrawer = (flag?) => {
    setVisibleVerifyDrawer(!!flag)
  }

  const handleVerifySubmit = (value: VerifyData) => {
    setSubmitLoading(true)
    const payload = {
      validateId,
      ...value,
      ...(channelInfoRef.current || {}),
      depositDetails: depositInfoRef.current,
      qualities: qualitiesRef.current
        .filter((item) => item.file && item.file[0] && item.file[0].status === 'done')
        .map((item) => ({
          url: item.file && item.file[0] ? item.file[0].url : '',
          name: item.file && item.file[0] ? item.file[0].name : '',
          expireDay: item.expireDay || '',
          permanent: item.permanent && item.permanent[0] ? item.permanent[0] : 0,
        })),
    }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.verify.commiting' }),
      duration: 0,
    })
    postMemberSupplierDepositVerify(payload, {
      timeout: 0,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        handleVisibleVerifyDrawer(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        msg()
        setSubmitLoading(false)
      })
  }

  const handleVerify = () => {
    const promises = [
      channelFormRef?.current?.validate().catch(() => {
        message.warning(
          intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.verify.channel.required' }),
        )
        return Promise.reject()
      }),
      depositFormRef?.current?.validate().catch(() => {
        message.warning(
          intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.verify.deposit.required' }),
        )
        return Promise.reject()
      }),
      qualitiesFormRef?.current?.validate().catch(() => {
        message.warning(
          intl.formatMessage({ id: 'member.management.memberPrVerifyComingData.verify.qualities.required' }),
        )
        return Promise.reject()
      }),
    ]
    Promise.all(promises).then(() => {
      handleVisibleVerifyDrawer(true)
    })
  }

  const handleChannelInfoChange = (values: ChannelValueType) => {
    channelInfoRef.current = values
  }

  const handleDepositChange = (values: DepositValueType) => {
    depositInfoRef.current = values
  }

  const handleQualitiesChange = (values: QualitiesSubmitValueType[]) => {
    qualitiesRef.current = values
  }

  return (
    <>
      <MemberProfile
        dataSource={dataSource}
        loading={loading}
        extra={() => (
          <>
            <Space>
              <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleVerify}>
                {intl.formatMessage({ id: 'member.actions.apply.verify' })}
              </Button>
            </Space>

            <VerifyComingDataDrawer
              visible={visibleVerifyDrawer}
              onClose={() => handleVisibleVerifyDrawer(false)}
              onSubmit={handleVerifySubmit}
              submitLoading={submitLoading}
            />
          </>
        )}
        onChannelInfoChange={handleChannelInfoChange}
        onDepositChange={handleDepositChange}
        onQualitiesChange={handleQualitiesChange}
        depositRef={depositFormRef}
        channelRef={channelFormRef}
        qualitiesRef={qualitiesFormRef}
        showChannelInfo
        editableChannel
        editableDeposit
        editableQualities
      />
    </>
  )
}

export default SupplierDepositDataVerify
