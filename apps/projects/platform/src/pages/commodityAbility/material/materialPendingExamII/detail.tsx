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
  postProductMaterielMaterielExamine2,
} from '@apps/apis'
import type { SubmitDataTypes } from '@/components/ExamVerify'
import ExamVerify from '@/components/ExamVerify'
import { useIntl } from '@linkseeks/i18n'
import { wl_extraFn } from '../components/wl_extras'
import { useWebIntl } from '@apps/locales'

/**
 * 详情
 */
const Detail = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const { wl_extra, get_urls } = wl_extraFn(intl)
  const { before, extra } = wl_extra(true)
  const { before: beforePdf, extra: extraPdf } = wl_extra(true)
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
    initialValue: initialValue,
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
    const { code } = await postProductMaterielMaterielExamine2({
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
      title={translate('web.resource.commodity.daishenhewuliaoerji')}
      items={
        anchorHeader as {
          key: string
          label: string
        }[]
      }
      extra={
        <Button onClick={() => setVisible(true)} type={'primary'}>
          {translate('web.common.approved')}
        </Button>
      }
    >
      <Space direction="vertical" style={{ display: 'flex' }} size={16}>
        <AuditProcess {...auditProcess} id="progress" />
        <CustomizeColumn
          {...wl_extra(true)}
          id="basic"
          data={basicInfoList}
          title={intl.formatMessage({ id: 'material.basic.title', defaultMessage: '基本信息' })}
          column={2}
        />
        <CustomizeColumn
          {...wl_extra(true)}
          id="properties"
          data={properties}
          title={intl.formatMessage({ id: 'material.props.title', defaultMessage: '属性信息' })}
          column={2}
        />
        <CustomizeColumn
          {...wl_extra(true)}
          id="output"
          data={outputInfoList}
          title={intl.formatMessage({ id: 'material.output.title', defaultMessage: '产地配送' })}
          column={2}
        />
        <CustomizeColumn
          {...wl_extra(true)}
          id="unitConversion"
          data={unitInfoList}
          title={intl.formatMessage({
            id: 'material.unitConversion.title',
            defaultMessage: '单位换算',
          })}
          column={2}
        />
        <CustomizeColumn
          {...wl_extra(true)}
          id="contactInfo"
          data={contactInfoList}
          title={intl.formatMessage({ id: 'material.contact.title', defaultMessage: '联系信息' })}
          column={2}
        />
        <Card
          title={intl.formatMessage({ id: 'material.images.title', defaultMessage: '物料图片' })}
          bodyStyle={{ paddingTop: '0' }}
          extra={extra}
          id="images"
        >
          <ImageList
            imageUrls={initialValue?.materielPic}
            old_urls={initialValue?.materielVersionResponse?.materiel?.materielPic}
            before={before}
          />
        </Card>
        <Card
          id="files"
          title={intl.formatMessage({ id: 'material.enclosure.title', defaultMessage: '附件' })}
          extra={extraPdf}
        >
          <Table columns={tableColumn(beforePdf)} dataSource={urls} />
        </Card>
        <Card id="log" title={intl.formatMessage({ id: 'material.log.title', defaultMessage: '流转记录' })}>
          <Table columns={recordColumn} dataSource={logs} rowKey="id" />
        </Card>
      </Space>
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
