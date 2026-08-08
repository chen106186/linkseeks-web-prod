import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { useMemo } from 'react'
import FileListRender from '@/components/UploadFiles/FileListRender'

function useGetDetailCommon({ initialValue }) {
  const intl = useIntl()
  const basicInfo = useMemo(() => {
    const isUpperMember = typeof initialValue?.upperName !== 'undefined'
    return [
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTopic' })}`,
        value: initialValue?.subject,
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.businessType' })}`,
        value: initialValue?.typeName,
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseTime' })}`,
        value: initialValue?.eventTime,
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseDesc' })}`,
        value: initialValue?.eventDesc,
      },
      {
        title: isUpperMember
          ? `${intl.formatMessage({ id: 'supplier.supplierEvaluate.hooks.useGetDetailCommon.uppersupplierName' })}`
          : `${intl.formatMessage({ id: 'supplier.supplierInspection.common.columns.index.supplierName' })}`,
        value: isUpperMember ? initialValue?.upperName : initialValue?.name,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseAppendix',
        })}`,
        value: (
          // <div>
          //   {
          //     initialValue?.attachments?.map((_row) => {
          //       return (
          //         <a key={_row.url} href={_row.href}>{_row.name}</a>
          //       )
          //     })
          //   }
          // </div>
          <FileListRender files={initialValue?.attachments} />
        ),
      },
      {
        title: `${intl.formatMessage({
          id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseSuggest',
        })}`,
        value: initialValue?.eventSuggest,
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.proposer' })}`,
        span: 2,
        value: initialValue?.byUserName,
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.caseClass' })}`,
        value: initialValue?.classifyName,
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.proposePhone' })}`,
        value: initialValue?.byUserPhone,
      },
    ]
  }, [initialValue])

  const resultInfo = useMemo(() => {
    return [
      {
        title: `${intl.formatMessage({
          id: 'member.complaintsAndSuggests.common.hooks.useGetAnchorHeader.dealResult',
        })}`,
        value: initialValue?.handleResult,
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.dealMan' })}`,
        value: initialValue?.handleUserName,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.deakAppendix',
        })}`,
        value: (
          // <div>
          //   {
          //     initialValue?.handleAttachments.map((_row) => {
          //       return (
          //         <a key={_row.url} href={_row.href}>{_row.name}</a>
          //       )
          //     })
          //   }
          // </div>
          <FileListRender files={initialValue?.handleAttachments} />
        ),
      },
      {
        title: `${intl.formatMessage({ id: 'member.complaintsAndSuggests.common.columns.index.dealTime' })}`,
        value: initialValue?.handleTime,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.dealPhone',
        })}`,
        value: initialValue?.handleUserPhone,
      },
    ]
  }, [initialValue])

  return { basicInfo, resultInfo }
}

export default useGetDetailCommon
