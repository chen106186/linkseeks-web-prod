import { useIntl } from '@linkseeks/i18n'
import React from 'react'
import { useMemo } from 'react'
import FileListRender from '@/components/UploadFiles/FileListRender'
import { useWebIntl } from '@apps/locales'

function useGetDetailCommon({ initialValue }, isCustomer = false) {
  const intl = useIntl()
  const translate = useWebIntl()
  const basicInfo = useMemo(() => {
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
        title: isCustomer
          ? translate('web.resource.member.guishucaigoushangmingcheng')
          : translate('web.resource.member.memberName'),
        value: isCustomer ? initialValue?.upperName : initialValue?.name,
      },
      {
        title: `${intl.formatMessage({
          id: 'member.complaintsAndSuggests.common.hooks.useGetDetailCommon.caseAppendix',
        })}`,
        value: <FileListRender files={initialValue?.attachments} />,
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
        value: <FileListRender files={initialValue?.handleAttachments} />,
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
