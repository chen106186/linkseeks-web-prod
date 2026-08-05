import { useMemo, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import useGetDetailCommon from '../common/useGetDetailCommon'
import { Button, Card, Space, Table } from 'antd'
import CustomizeColumn from '@/components/CustomizeColumn'
import ImageList from '../components/imageList'
import { usePageStatus } from '@/hooks/usePageStatus'
import useGetInitialValueDetail from '../common/useGetInitialValueDetail'
import type {
  GetProductMaterielGetMaterielProcessDetailResponse,
  GetProductMaterielGetMaterInnerLogListResponse,
} from '@apps/apis'
import {
  getProductMaterielGetMaterielProcessDetail,
  getProductMaterielGetMaterInnerLogList,
  postProductMaterielMaterielExamineChange2,
} from '@apps/apis'
import type { SubmitDataTypes } from '@/components/ExamVerify'
import ExamVerify from '@/components/ExamVerify'
import { useIntl } from '@linkseeks/i18n'
import { wl_extraFn } from '../components/wl_extras'

/**
 * 详情
 */
const Detail = () => {
  const intl = useIntl()
  const { wl_extra, get_urls } = wl_extraFn(intl)
  const { before, extra } = wl_extra()
  const { before: beforePdf, extra: extraPdf } = wl_extra()
  const { before: before_sx, extra: extra_sx } = wl_extra()
  const { before: before_dwhs, extra: extra_dwhs } = wl_extra()
  const { id } = usePageStatus()
  const [visible, setVisible] = useState<boolean>(false)
  const { initialValue, record } = useGetInitialValueDetail<
    GetProductMaterielGetMaterielProcessDetailResponse,
    GetProductMaterielGetMaterInnerLogListResponse
  >({
    id: id,
    api: getProductMaterielGetMaterielProcessDetail,
    logApi: getProductMaterielGetMaterInnerLogList,
  })
  const {
    anchorHeader,
    auditProcess,
    basicInfoList,
    outputInfoList,
    unitInfoList,
    contactInfoList,
    tableColumn,
    recordColumn,
    properties,
  } = useGetDetailCommon<GetProductMaterielGetMaterielProcessDetailResponse | null>({
    initialValue,
    before_sx,
    before_dwhs,
  })
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const urls = useMemo(() => {
    return get_urls(initialValue, beforePdf)
  }, [get_urls, initialValue, beforePdf])

  const logs = useMemo(() => {
    return record
  }, [record])

  const onExamVerifySubmit = async (value: SubmitDataTypes) => {
    setSubmitLoading(true)
    const { code } = await postProductMaterielMaterielExamineChange2({
      id: +id,
      state: value.status,
      auditOpinion: value.reason,
    })
    setSubmitLoading(false)
    if (code === 1000) {
      history.back()
    }
  }

  const defaultExamValue = {
    status: 1,
  }

  return (
    <PageHeaderWrapper
      title={'物料详情'}
      items={
        anchorHeader as {
          key: string
          label: string
        }[]
      }
      extra={<Button onClick={() => setVisible(true)}>审核</Button>}
    >
      <AuditProcess {...auditProcess} id="progress" />
      <Space>
        <CustomizeColumn
          {...wl_extra()}
          id="basic"
          data={basicInfoList}
          title={intl.formatMessage({ id: 'material.basic.title', defaultMessage: '基本信息' })}
          column={2}
        />
      </Space>
      <Space>
        <CustomizeColumn
          extra={extra_sx}
          id="properties"
          data={properties}
          title={intl.formatMessage({ id: 'material.props.title', defaultMessage: '属性信息' })}
          column={2}
        />
      </Space>
      <Space>
        <CustomizeColumn
          {...wl_extra()}
          id="output"
          data={outputInfoList}
          title={intl.formatMessage({ id: 'material.output.title', defaultMessage: '产地配送' })}
          column={2}
        />
      </Space>
      <Space>
        <CustomizeColumn
          extra={extra_dwhs}
          id="unitConversion"
          data={unitInfoList}
          title={intl.formatMessage({
            id: 'material.unitConversion.title',
            defaultMessage: '单位换算',
          })}
          column={2}
        />
      </Space>
      <Space>
        <CustomizeColumn
          {...wl_extra()}
          id="contactInfo"
          data={contactInfoList}
          title={intl.formatMessage({ id: 'material.contact.title', defaultMessage: '联系信息' })}
          column={2}
        />
      </Space>
      <div style={{ marginTop: '16px' }} id="images">
        <Card
          title={intl.formatMessage({ id: 'material.images.title', defaultMessage: '物料图片' })}
          bodyStyle={{ paddingTop: '0' }}
          extra={extra}
        >
          <ImageList
            imageUrls={initialValue?.materielPic}
            old_urls={initialValue?.materielVersionResponse?.materiel?.materielPic}
            before={before}
          />
        </Card>
      </div>
      <div style={{ marginTop: '16px' }} id="files">
        <Card title={intl.formatMessage({ id: 'material.enclosure.title', defaultMessage: '附件' })} extra={extraPdf}>
          <Table columns={tableColumn(beforePdf)} dataSource={urls} />
        </Card>
      </div>
      <div style={{ marginTop: '16px' }} id="log">
        <Card title={intl.formatMessage({ id: 'material.log.title', defaultMessage: '流转记录' })}>
          <Table columns={recordColumn} dataSource={logs} rowKey="id" />
        </Card>
      </div>
      <ExamVerify
        visible={visible}
        title={intl.formatMessage({
          id: 'material.examII.modal.title',
          defaultMessage: '二级审核',
        })}
        onSubmit={onExamVerifySubmit}
        onCancel={() => setVisible(false)}
        showLabel={false}
        value={defaultExamValue}
        comfirmLoading={submitLoading}
      />
    </PageHeaderWrapper>
  )
}

export default Detail
