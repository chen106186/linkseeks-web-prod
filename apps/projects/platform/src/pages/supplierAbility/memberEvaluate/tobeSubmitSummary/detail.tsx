import React, { useState, useMemo, useRef } from 'react'
import { Spin, Button, Drawer } from 'antd'
import { SchemaForm, createFormActions } from '@apps/formily'
import { CheckCircleOutlined } from '@ant-design/icons'
import { ArrayTable } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import CustomizeColumn from '@/components/CustomizeColumn'
import AuditProcess from '@/components/AuditProcess'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import { modifyEvaluateScore, evaluateScoreRes } from './schema'
import { projectColumns, recordColumn } from '../columns'
import useGetDetailCommon from '../hooks/useGetDetailCommon'
import useModal from '../hooks/useModal'
import styles from './detail.less'
import theme from '../../../../../config/lingxi.theme.config'
import createRichTextUtils from '@/components/RangeTime/createRichText'
import FormilyCheckbox from '../../components/FormilyCheckBox'
import {
  getMemberSupplierAppraisalWaitSubmitGet,
  GetMemberAppraisalWaitSubmitGetResponse,
  postMemberSupplierAppraisalWaitSubmitSubmit,
} from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import FlowRecords from '@/components/FlowRecords'
import NiceForm from '@/components/NiceForm'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { authUrl } from '@apps/domains'
import { AuthButton, EditAuthButton, AddAuthButton, DetailAuthButton } from '@apps/components'
import SupplierAssessmentProject from '../createEvaluate/components/SupplierAssessmentProject'
import SupplierAssessmentProjectForm, {
  APSubmitValueType,
  SupplierAssessmentProjectFormRef,
} from '../createEvaluate/components/SupplierAssessmentProjectForm'

type EditDataType = {
  appraisalId: number
  appraisalReport: {
    name: string
    url: string
  }[]
  grade: string
  id: number
  scoreWeight: string
  sendAppraisal: 0 | 1
  templates: {
    name: string
    url: string
  }[]
  type: null
  userId: number
}

type SubmitData = {
  totalScore: number
  result: string
  notifyMember: boolean
  resultAttachments: {
    name: string
    url: string
  }[]
}

const formActions = createFormActions()
const resultForm = createFormActions()

const TobeEvaluateDetail = () => {
  const { visible, toggle } = useModal()
  const { visible: resultVisible, toggle: resultToggle } = useModal()
  const { id, lastTypeParams } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue, setInitialValue, refresh } = useInitialValue<
    GetMemberAppraisalWaitSubmitGetResponse,
    { id: string }
  >(getMemberSupplierAppraisalWaitSubmitGet, params)
  const { anchorHeader, basicInfoList, evaluateResultColumn, auditProcess } = useGetDetailCommon({
    blackList: ['result'],
    initialValue: initialValue,
  })
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [editingScoreData, setEditingScoreData] = useState<any>({})

  const [totalScore, setTotalScore] = useState(0)

  const intl = useIntl()

  const isView = useMemo(() => lastTypeParams === '/preview', [lastTypeParams])

  const assessmentProjectFormRef = useRef<SupplierAssessmentProjectFormRef>()

  const withEditProjectColumns = useMemo(() => {
    if (isView) {
      return projectColumns
    }
    const temp = projectColumns.concat({
      title: `${intl.formatMessage({ id: 'member.memberInspection.common.columns.index.operate' })}`,
      render: (text, record) => {
        return (
          <a onClick={() => editScore(record)}>
            {intl.formatMessage({ id: 'member.memberEvaluate.createEvaluate.index.edit' })}
          </a>
        )
      },
    })
    return temp
  }, [projectColumns, isView])

  const editScore = (record: any) => {
    console.log(record)
    setEditingScoreData(record)
    toggle(true)
  }

  const onDrawerCancel = () => {
    toggle(false)
  }

  const onDrawerConfirm = (type: 'edit' | 'result') => {
    if (type === 'edit') {
      formActions.submit()
    } else {
      resultForm.submit()
    }
  }

  const onAssessmentProjectFormSubmit = (value: APSubmitValueType) => {
    setInitialValue({
      ...initialValue,
      items: initialValue.items.map((item, index) => ({ ...item, ...value.items[index] })),
    })
    resultToggle(true)
  }

  const onSubmit = (value: EditDataType) => {
    const { items } = initialValue
    const list = [...items]
    const targetIndex = list.findIndex((_item) => value.id === _item.id)
    if (targetIndex > -1) {
      list[targetIndex] = {
        ...list[targetIndex],
        scoreWeight: +value.scoreWeight,
        grade: +value.grade,
        score: (+value.scoreWeight * +value.grade) / 100,
        templates: value.templates?.map((_row) => {
          return {
            name: _row.name,
            url: _row.url,
          }
        }),
        appraisalReport: value.appraisalReport?.map((_row) => {
          return {
            name: _row.name,
            url: _row.url,
          }
        }),
      }
    }
    const newObject = {
      ...initialValue,
      items: list,
    }
    setInitialValue(newObject)
    toggle(false)
  }

  const resultOnSubmit = async (value: SubmitData) => {
    try {
      setSubmitLoading(true)
      const postData = {
        id: id,
        totalScore,
        items: [...initialValue.items],
        notifyMember: value.notifyMember ? 1 : 0,
        resultAttachments:
          value.resultAttachments?.map((_item) => ({
            name: _item.name,
            url: _item.url,
          })) || [],
        ...value,
      }
      const { code, data } = await postMemberSupplierAppraisalWaitSubmitSubmit(postData as any)
      if (code === 1000) {
        resultToggle(false)
        history.goBack()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${intl.formatMessage({
          id: 'member.memberEvaluate.hooks.useGetDetailCommon.evaluateNumber',
        })}: ${initialValue?.appraisalNo}`}
        items={anchorHeader}
        extra={
          (!isView && (
            // <AuthButton type="custom" code="submit">
            <Button onClick={() => assessmentProjectFormRef.current.submit()} icon={<CheckCircleOutlined />}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.allQuery.detail.evaluateResult',
              })}
            </Button>
            // </AuthButton>
          )) ||
          null
        }
      >
        <AuditProcess {...auditProcess} id="progress" />
        <div id="detail" style={{ margin: `${theme['@margin-md']} 0` }}>
          <CustomizeColumn
            data={basicInfoList}
            title={intl.formatMessage({
              id: 'member.memberInspection.common.schema.add.baseInfo',
            })}
            column={3}
          />
        </div>
        {isView ? (
          <SupplierAssessmentProject data={initialValue?.items} />
        ) : (
          <SupplierAssessmentProjectForm
            ref={assessmentProjectFormRef}
            value={initialValue?.items}
            onSubmit={onAssessmentProjectFormSubmit}
            onComputeTotal={(total) => setTotalScore(parseFloat(total))}
            rater
          />
        )}
        <div id="record" style={{ margin: `${theme['@margin-md']} 0` }}>
          <FlowRecords innerRowkey="id" innerColumns={recordColumn as any} innerDataSource={initialValue?.history} />
        </div>
      </PageHeaderWrapper>
      <Drawer
        title={intl.formatMessage({
          id: 'member.memberEvaluate.tobeSubmitSummary.detail.editEvaluateScore',
        })}
        visible={visible}
        width={1200}
        onClose={onDrawerCancel}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onDrawerCancel} style={{ marginRight: 8 }}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.components.FormilySelectMember.index.cancel',
              })}
            </Button>
            <Button onClick={() => onDrawerConfirm('edit')} type="primary">
              {intl.formatMessage({
                id: 'member.memberEvaluate.tobeEvaluate.detail.confirm',
              })}
            </Button>
          </div>
        }
      >
        <div className={styles.form}>
          <SchemaForm
            onSubmit={onSubmit}
            value={editingScoreData}
            schema={modifyEvaluateScore}
            actions={formActions}
            components={{
              FormilyUploadFiles,
              ArrayTable,
              FormilyCheckbox,
            }}
          />
        </div>
      </Drawer>
      <Drawer
        title={intl.formatMessage({
          id: 'member.memberEvaluate.allQuery.detail.evaluateResult',
        })}
        visible={resultVisible}
        width={800}
        onClose={() => resultToggle(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => resultToggle(false)} style={{ marginRight: 8 }}>
              {intl.formatMessage({
                id: 'member.memberEvaluate.components.FormilySelectMember.index.cancel',
              })}
            </Button>
            <Button loading={submitLoading} onClick={() => onDrawerConfirm('result')} type="primary">
              {intl.formatMessage({
                id: 'member.memberEvaluate.tobeEvaluate.detail.confirm',
              })}
            </Button>
          </div>
        }
      >
        <NiceForm
          onSubmit={resultOnSubmit}
          initialValues={{
            notifyMember: 1,
          }}
          value={{ ...initialValue, totalScore }}
          expressionScope={createRichTextUtils()}
          schema={evaluateScoreRes}
          actions={resultForm}
          components={{
            FormilyUploadFiles,
            ArrayTable,
            FormilyCheckbox,
          }}
        />
      </Drawer>
    </Spin>
  )
}

export default TobeEvaluateDetail
