import React, { useState, useMemo } from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getAftersalesReturnGoodsGetDetailPlatform,
  getAftersalesReturnGoodsPageOuterWorkflowRecord,
  postAftersalesPlatformReturnGoodsVerify,
} from '@apps/apis'
import { IProps as FlowRecordsProps } from '@/components/FlowRecords'
import fetchDetailHoc from '../common/hoc/fetchDetailHoc'
import ReturnProfile from '../components/ReturnProfile'
import VerifyModal, { ValueType as VerifyData } from '../components/VerifyModal'

const ReturnVerify: React.FC = () => {
  const { id } = usePageStatus()

  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const ReturnProfilePro = useMemo(
    () =>
      fetchDetailHoc(
        {
          fetchDetail: () =>
            getAftersalesReturnGoodsGetDetailPlatform({
              returnId: id,
            }),
        },
        ReturnProfile,
      ),
    [],
  )

  const fetchOuterHistory: FlowRecordsProps['fetchOuterList'] = (params) => {
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsPageOuterWorkflowRecord({
        current: `${params.current}`,
        pageSize: `${params.pageSize}`,
        dataId: id,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)

    postAftersalesPlatformReturnGoodsVerify(
      {
        applyId: id,
        isPass: value.agree,
        opinion: value.reason,
      },
      {
        timeout: 0,
      },
    )
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        handleVisibleVerifyModal(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <ReturnProfilePro
      fetchOuterHistory={fetchOuterHistory}
      extra={() => (
        <>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVisibleVerifyModal(true)}>
            审核
          </Button>

          <VerifyModal
            visible={visibleVerifyModal}
            onClose={() => handleVisibleVerifyModal(false)}
            submitLoading={submitLoading}
            onSubmit={handleSubmit}
          />
        </>
      )}
    />
  )
}

export default ReturnVerify
