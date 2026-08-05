import { useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import useGetDetailCommon from '../common/useGetDetailCommon'
import { Card, Table } from 'antd'
import CustomizeColumn from '@/components/CustomizeColumn'
import ImageList from '../components/imageList'
import { usePageStatus } from '@/hooks/usePageStatus'
import useGetInitialValueDetail from '../common/useGetInitialValueDetail'
import type {
  GetProductMaterielGetMaterielProcessDetailResponse,
  GetProductGoodsGetGoodsResponse,
  GetProductMaterielGetMaterInnerLogListResponse,
} from '@apps/apis'
import { getProductMaterielGetMaterielProcessDetail, getProductMaterielGetMaterInnerLogList } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { PENDING_ADD_MATERIAL, PENDING_SUBMIT_EXAM } from '@/constants/material'
import { wl_extraFn } from '../components/wl_extras'
/**
 * 详情
 */
const Detail = () => {
  const intl = useIntl()
  const { wl_extra, get_urls } = wl_extraFn(intl)
  const { id } = usePageStatus()
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
    tableColumn,
    recordColumn,
    properties,
    outputInfoList,
    unitInfoList,
    contactInfoList,
  } = useGetDetailCommon<GetProductMaterielGetMaterielResponse | null>({ initialValue: initialValue })

  const { before, extra } = wl_extra(true)
  const { before: beforePdf, extra: extraPdf } = wl_extra(true)

  const urls = useMemo(() => {
    return get_urls(initialValue, beforePdf)
  }, [get_urls, initialValue, beforePdf])

  const logs = useMemo(() => {
    return record
  }, [record])
  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'table.purchase.wuliaoxiangqing', defaultMessage: '物料详情' })}
      items={
        anchorHeader as {
          key: string
          label: string
        }[]
      }
      // extra={headExtra && headExtra(detailInfo, returnAddress, exchangeAddress)}
    >
      {initialValue?.interiorState !== PENDING_SUBMIT_EXAM && initialValue?.interiorState !== PENDING_ADD_MATERIAL ? (
        <AuditProcess {...auditProcess} id="progress" style={{ marginBottom: '16px' }} />
      ) : null}
      <CustomizeColumn
        {...wl_extra(true)}
        id="basic"
        data={basicInfoList}
        title={intl.formatMessage({ id: 'material.basic.title', defaultMessage: '基本信息' })}
        column={2}
        style={{ marginBottom: '16px' }}
      />
      <CustomizeColumn
        {...wl_extra(true)}
        id="properties"
        data={properties}
        title={intl.formatMessage({ id: 'material.props.title', defaultMessage: '属性信息' })}
        column={2}
        style={{ marginBottom: '16px' }}
      />
      <CustomizeColumn
        {...wl_extra(true)}
        id="output"
        data={outputInfoList}
        title={intl.formatMessage({ id: 'material.output.title', defaultMessage: '产地配送' })}
        column={2}
        style={{ marginBottom: '16px' }}
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
        style={{ marginBottom: '16px' }}
      />
      <CustomizeColumn
        {...wl_extra(true)}
        id="contactInfo"
        data={contactInfoList}
        title={intl.formatMessage({ id: 'material.contact.title', defaultMessage: '联系信息' })}
        column={2}
        style={{ marginBottom: '16px' }}
      />
      <div style={{ marginBottom: '16px' }} id="images">
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
      <div style={{ marginBottom: '16px' }} id="files">
        <Card title={intl.formatMessage({ id: 'material.enclosure.title', defaultMessage: '附件' })} extra={extraPdf}>
          <Table columns={tableColumn(beforePdf)} dataSource={urls} />
        </Card>
      </div>
      <div id="log">
        <Card title={intl.formatMessage({ id: 'material.log.title', defaultMessage: '流转记录' })}>
          <Table columns={recordColumn} dataSource={logs} rowKey="id" />
        </Card>
      </div>
    </PageHeaderWrapper>
  )
}

export default Detail
