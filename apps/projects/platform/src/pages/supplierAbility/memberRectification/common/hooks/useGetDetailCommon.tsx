import { useIntl } from '@linkseeks/i18n'
import { GetMemberRectifyWaitAddGetResponse } from '@apps/apis'
import React from 'react'
import { useMemo } from 'react'
import FileListRender from '@/components/UploadFiles/FileListRender'

type Info = {
  reportDigest?: string
  agreeResult?: 0 | 1
  resultRemark?: string
  reportAttachments?: {
    name: string
    url: string
  }[]
}

function useGetDetailCommon({ initialValue }: { initialValue: GetMemberRectifyWaitAddGetResponse & Info }) {
  const intl = useIntl()
  const basicInfo = useMemo(() => {
    return [
      {
        title: `${intl.formatMessage({ id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyNo' })}`,
        value: initialValue?.rectifyNo,
      },
      {
        title:
          initialValue && typeof (initialValue as any).upperMemberName !== 'undefined'
            ? `${intl.formatMessage({ id: 'supplier.supplierEvaluate.hooks.useGetDetailCommon.uppersupplierName' })}`
            : `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
        value: initialValue?.name || (initialValue as any)?.upperMemberName,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyRequire',
        })}`,
        value: initialValue?.require,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyTopic',
        })}`,
        value: initialValue?.subject,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyDeadline',
        })}`,
        value: (
          <div>
            {initialValue?.rectifyDayStart} {intl.formatMessage({ id: 'common.text.to' })} {initialValue?.rectifyDayEnd}
          </div>
        ),
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyFile',
        })}`,
        value: <FileListRender files={initialValue?.attachments} />,
      },
      {
        title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.outState' })}`,
        value: <div>{initialValue && initialValue?.outerStatusName}</div>,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyReason',
        })}`,
        value: initialValue?.reason,
      },
    ]
  }, [initialValue])

  const editInfo = useMemo(() => {
    return [
      {
        title: `${intl.formatMessage({ id: 'member.memberRectification.common.hooks.useGetDetailCommon.summary' })}`,
        value: initialValue?.reportDigest,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyReportFile',
        })}`,
        value: <FileListRender files={initialValue?.reportAttachments} />,
      },
    ]
  }, [initialValue])

  const resultInfo = useMemo(() => {
    return [
      {
        title: `${intl.formatMessage({ id: 'member.memberRectification.common.columns.queryColumns.rectifyResult' })}`,
        value: initialValue?.agreeResult
          ? `${intl.formatMessage({ id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyPass' })}`
          : `${intl.formatMessage({ id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyUnPass' })}`,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.memberRectification.common.hooks.useGetDetailCommon.resultReason',
        })}`,
        value: initialValue?.resultRemark,
      },
    ]
  }, [initialValue])

  return { basicInfo, editInfo, resultInfo }
}

export default useGetDetailCommon
