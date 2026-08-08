/*
 * @Description: 入库分类
 */
import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { useHttpRequest } from '@/hooks/useHttpRequest'
import { postMemberSupplierDepositClassify, getMemberSupplierDepositClassifyDetail } from '@apps/apis'
import { IRequestSuccess } from '@/index'
import MemberProfile, { DetailType } from '../../components/MemberProfile'
import {
  MemberDocCategoryProRef,
  MemberDocCategoryProProps,
  SubmitValueType,
} from '../../components/MemberDocCategoryPro'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'

const SupplierDepositClassifyVerify: React.FC<{}> = () => {
  const { validateId } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)

  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)

  const categoryFormRef = useRef<MemberDocCategoryProRef | null>(null)
  const categoryValue = useRef<SubmitValueType | undefined>(undefined)

  const intl = useIntl()

  const fetchDetail = (): Promise<IRequestSuccess<DetailType>> =>
    getMemberSupplierDepositClassifyDetail({
      validateId,
    })

  const { data: dataSource, loading } = useHttpRequest<DetailType>(fetchDetail, { manual: false })

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleVerifySubmit = (value: VerifyData) => {
    setSubmitLoading(true)
    const payload = {
      validateId,
      ...value,
      ...categoryValue.current,
    }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'member.management.memberPrComingClassify.verify.commiting' }),
      duration: 0,
    })
    postMemberSupplierDepositClassify(payload, {
      timeout: 0,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
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
    categoryFormRef?.current.submit()
  }

  const handleCategorySubmit: MemberDocCategoryProProps['onSubmit'] = (values) => {
    categoryValue.current = values
    handleVisibleVerifyModal(true)
  }

  return (
    <MemberProfile
      dataSource={dataSource}
      loading={loading}
      extra={() => (
        <>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleVerify}>
            {intl.formatMessage({ id: 'member.actions.apply.verify' })}
          </Button>

          <VerifyModal
            visible={visibleVerifyModal}
            onClose={() => handleVisibleVerifyModal(false)}
            submitLoading={submitLoading}
            onSubmit={handleVerifySubmit}
          />
        </>
      )}
      categoryRef={categoryFormRef}
      onCategorySubmit={handleCategorySubmit}
      editableCategory
    />
  )
}

export default SupplierDepositClassifyVerify
