import { useMemo, useRef, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import useGetDetailCommon from './common/useGetDetailCommon'
import { Button, Card, Table } from 'antd'
import CustomizeColumn from '@/components/CustomizeColumn'
import { usePageStatus } from '@/hooks/usePageStatus'
import useGetInitialValueDetail from './common/useGetInitialValueDetail'
import {
  getProductSampleDeliverBuyerDetail,
  postProductSampleDeliverBuyerReturnSample,
  postProductSampleDeliverBuyerReceiveSample,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import NiceForm from '@/components/NiceForm'
import type { ISchema } from '@apps/formily'
import { createFormActions } from '@apps/formily'
import { LinkOutlined } from '@ant-design/icons'
import FormilyUploadFiles from '@/components/UploadFiles/FormilyUploadFiles'
import RequisitionerTable from '../../material/materialPendingAdd/components/requisitionerTable'
import type { GetMemberUserPageResponseDetail } from '@apps/apis'
import { authService } from '@apps/services'
import moment from 'moment'
import { formatTimeString } from '@/utils'
import { NavigationIcon } from '@linkseeks/icons'
/**
 * 详情
 */
const Detail = (props: any) => {
  const { site } = props
  const intl = useIntl()
  const { id, isEdit } = usePageStatus()
  const { initialValue } = useGetInitialValueDetail<any, any>({
    id: id,
    api: getProductSampleDeliverBuyerDetail,
  })
  const {
    anchorHeader,
    auditProcess,
    basicInfoList,
    returnSampleInfoList,
    recordColumn,
    giveSampleInfoList,
    sendSampleInfoList,
  } = useGetDetailCommon({ initialValue: initialValue })

  const userInfo = authService.getAuth()
  const logs = useMemo(() => {
    return initialValue?.products
  }, [initialValue])

  const logisticsInfo = useMemo(() => {
    return initialValue?.logisticsInfos?.find((val) => val.type === 2)
  }, [initialValue])

  const RequisRef = useRef<any>({})
  const handleOrder = () => {
    RequisRef.current.setVisible(true)
  }
  const RequisitionerBtn = (
    <div className="connectBtn" onClick={handleOrder}>
      <LinkOutlined style={{ marginRight: 4 }} />
      {intl.formatMessage({ id: 'purchaseRequisition.xuanze', defaultMessage: '选择' })}
    </div>
  )
  const schema: ISchema = {
    type: 'object',
    properties: {
      returnSample: {
        type: 'object',
        'x-component': 'MellowCard',
        'x-component-props': {
          id: 'returnSample',
          title: '退样信息',
        },
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              labelAlign: 'left',
              labelCol: 4,
              wrapperCol: 19,
              grid: true,
              autoRow: true,
              columns: 2,
              responsive: {
                lg: 2,
                m: 1,
                s: 1,
              },
            },
            properties: {
              name: {
                title: '退样人',
                type: 'string',
                'x-component-props': {
                  addonAfter: '{{Requisitioner}}',
                  showSearch: true,
                },
                'x-rules': [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'material.chargeName.required',
                      defaultMessage: '请输入',
                    }),
                  },
                ],
                default: userInfo.userName,
              },
              logisticsNo: {
                title: '物流单号',
                type: 'string',
                'x-component-props': {
                  maxLength: 30,
                },
              },
              phone: {
                title: '联系电话',
                type: 'string',
                'x-component-props': {
                  maxLength: 30,
                },
                'x-rules': [
                  {
                    required: true,
                    message: '请输入联系电话',
                  },
                ],
                default: userInfo?.account,
              },
              remark: {
                title: '备注',
                type: 'string',
                'x-component-props': {
                  maxLength: 200,
                },
              },
              estimatedDeliveryTime: {
                title: '预计退样送达时间',
                type: 'date',
                'x-component-props': {
                  placeholder: '请输入预计退样送达时间',
                  disabledDate: (current) => current < moment().startOf('day'),
                },
                'x-rules': [
                  {
                    required: true,
                    message: '请输入预计退样送达时间',
                  },
                ],
                default: moment(new Date()),
              },
              attachments: {
                title: '附件',
                type: 'string',
                'x-component': 'FormilyUploadFiles',
                'x-component-props': {
                  buttonText: intl.formatMessage({ id: 'eightD.shangchuan', defaultMessage: '上传' }),
                  fileContainerClassName: 'uploadFilesList',
                  canDownload: true,
                },
                description: intl.formatMessage({
                  id: 'member.memberVisitManage.files.description',
                  defaultMessage: '一次上传一个文件，每个附件大小不能超过 20M',
                }),
              },
            },
          },
        },
      },
    },
  }
  const [formActions] = useState(createFormActions())
  const [submitLoading, setSubmitLoading] = useState(false)
  const selSample = (values: GetMemberUserPageResponseDetail) => {
    formActions.setFieldValue('name', values.name)
    formActions.setFieldValue('phone', values.phone)
  }
  const handleSubmit = async (value?) => {
    setSubmitLoading(true)
    const fn_ = !!site ? postProductSampleDeliverBuyerReceiveSample : postProductSampleDeliverBuyerReturnSample
    fn_({
      ...value,
      id,
      estimatedDeliveryTime: value?.estimatedDeliveryTime
        ? formatTimeString(value?.estimatedDeliveryTime, 'YYYY-MM-DD')
        : undefined,
    }).then((res) => {
      setSubmitLoading(false)
      if (res.code === 1000) {
        history.back()
      }
    })
  }

  return (
    <PageHeaderWrapper
      title={`${initialValue?.summary} | ${initialValue?.deliveryNo}`}
      items={anchorHeader as { key: string; label: string }[]}
      extra={
        (isEdit || site) && (
          <Button
            type="primary"
            icon={<NavigationIcon />}
            loading={submitLoading}
            onClick={() => (!!site ? handleSubmit() : formActions.submit())}
          >
            {intl.formatMessage({ id: 'afterService.common.commit', defaultMessage: '提交' })}
          </Button>
        )
      }
    >
      <AuditProcess {...auditProcess} id="process" style={{ marginBottom: '16px' }} />
      <CustomizeColumn
        id="basic"
        data={basicInfoList}
        title={intl.formatMessage({ id: 'material.basic.title', defaultMessage: '基本信息' })}
        column={2}
        style={{ marginBottom: '16px' }}
      />
      <CustomizeColumn
        id="giveSample"
        data={giveSampleInfoList}
        title={'送样信息'}
        column={2}
        style={{ marginBottom: '16px' }}
      />
      <div id="giveSampleMaterial" style={{ marginBottom: '16px' }}>
        <Card title={initialValue?.scenes == 2 ? '送样物料' : '送样商品'}>
          <Table columns={recordColumn} dataSource={logs} rowKey="id" />
        </Card>
      </div>
      <CustomizeColumn
        id="sendSample"
        data={sendSampleInfoList}
        title={'寄样信息'}
        column={2}
        style={{ marginBottom: '16px' }}
      />
      {!site &&
        (!isEdit ? (
          <CustomizeColumn id="returnSample" data={returnSampleInfoList} title={'退样信息'} column={2} />
        ) : (
          <NiceForm
            previewPlaceholder=" "
            schema={schema}
            actions={formActions}
            onSubmit={handleSubmit}
            initialValues={logisticsInfo}
            components={{
              FormilyUploadFiles,
            }}
            expressionScope={{
              Requisitioner: RequisitionerBtn,
            }}
          />
        ))}
      <RequisitionerTable currentRef={RequisRef} schemaAction={formActions} title={'选择退样人'} callBack={selSample} />
    </PageHeaderWrapper>
  )
}

export default Detail
