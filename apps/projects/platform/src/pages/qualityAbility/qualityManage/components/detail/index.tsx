import React, { Fragment, useEffect, useState } from 'react'
import { Badge, Button, message, Typography } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import { useQuery, useLocation } from '@linkseeks/router-core'
import type { ColumnType } from 'antd/lib/table'
import { LinkOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import BasicLayout from '@/components/DetailLayout/components/basicLayout'
import QualityMaterial from '@/components/DetailLayout/components/listLayout'
import Attachment from '@/components/DetailLayout/components/generalLayout'
import RecordLyout from '@/components/DetailLayout/components/listLayout'
import type { DetectionType } from './components/detectionDrawer'
import DetectionDrawer from './components/detectionDrawer'
import SaleAfter from './components/saleAfter'
import { getOrderQualityDetail, getOrderQualityGetInnerLog } from '@apps/apis'
import { isEmpty } from 'lodash'
import { ORDERRESOURCE } from '../../b2b/add'
import { downloadFileByNameAndUrl } from '@apps/utils'

enum AFTER_SALE_TYPE {
  /** 换货 */
  EXCHANGE = 1,
  /** 退货 */
  RETURN,
  /** 维修 */
  MAINTAIN,
}

enum TYPE {
  /** 生成B2B质检单 */
  B2B = 1,
  /** 生成SRM质检单 */
  SRM,
}

const count = 0
/** 未生成售后单 */
const NOSUCESS = 1
/** 已生成 */
const SUCESS = 2

const tagStyle = {
  [NOSUCESS]: {
    width: '44px',
    height: '16px',
    color: '#5C626A',
    fontSize: '12px',
    backgroundColor: '#F4F5F7',
    borderRadius: '4px',
    textAlign: 'center',
    lineHeight: '16px',
  },
  [SUCESS]: {
    width: '44px',
    height: '16px',
    color: '#00A98F',
    fontSize: '12px',
    backgroundColor: '#EBF9F6',
    borderRadius: '4px',
    textAlign: 'center',
    lineHeight: '16px',
  },
}

const QualityManageDetail = () => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const intl = useIntl()
  const [PATH] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [dataSource, setDataSource] = useState<any>()
  const [basicEffect, setBasicEffect] = useState<any>([])
  const [fileEffect, setFileEffect] = useState<any>([])
  const [detection, setDetection] = useState<DetectionType>()
  const [visible, setVisible] = useState<boolean>(false)
  const [saleVisible, setSaleVisible] = useState<boolean>(false)
  const [isbatch, setIsbatch] = useState<boolean>(false)
  const [rowkeys, setRowKeys] = useState<any[]>([])
  const [saleid, setSaleid] = useState<number>()
  const [showDataSource] = useState([
    { id: 1, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName1' }) },
    { id: 2, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName2' }) },
    { id: 3, name: intl.formatMessage({ id: 'purchaseOrder.showDataSourceName3' }) },
  ])
  const [checkedId, setCheckedId] = useState<number>()

  /** 获取基本信息 */
  const handleBasicEffect = (data: any) => {
    setBasicEffect([
      {
        col: [
          {
            label: intl.formatMessage({
              id: 'quality.zhijiandanbianhao',
              defaultMessage: '质检单编号',
            }),
            extra: data?.qualityNo,
          },
          {
            label: intl.formatMessage({
              id: 'quality.zhijiandanzhaiyao',
              defaultMessage: '质检单摘要',
            }),
            extra: data?.digest,
          },
          {
            label: intl.formatMessage({ id: 'quality.zhijianleixing', defaultMessage: '质检类型' }),
            extra: data?.qualityTypeName,
          },
          {
            label: intl.formatMessage({ id: 'quality.gongyingshang', defaultMessage: '供应商' }),
            extra: data?.vendorMemberName,
          },
          {
            label: intl.formatMessage({ id: 'quality.zhijianriqi', defaultMessage: '质检日期' }),
            extra: `${data?.startTime}~${data?.endTime}`,
          },
        ],
      },
      {
        col: [
          {
            label: intl.formatMessage({ id: 'quality.zhijianren', defaultMessage: '质检人' }),
            extra: data?.qualityInspector,
          },
          {
            label: intl.formatMessage({ id: 'quality.beizhu', defaultMessage: '备注' }),
            extra: data?.remark,
          },
          ...(data?.orderResource === ORDERRESOURCE.SEND
            ? [
                {
                  label: '送样需求单号',
                  extra: (
                    <Link to={`/commodityAbility/deliverManagement/requestSheetQuery/detail?id=${data?.receiveId}`}>
                      {data?.receiveNo}
                    </Link>
                  ),
                },
              ]
            : [
                {
                  label: intl.formatMessage({
                    id: 'quality.shouhuodanhao',
                    defaultMessage: '收货单号',
                  }),
                  extra: (
                    <Link to={`/orderAbility/receivingNote/deliveryNoteManage/detail?id=${data?.receiveId}`}>
                      {data?.receiveNo}
                    </Link>
                  ),
                },
              ]),
          {
            label: intl.formatMessage({ id: 'quality.waibuzhuangtai', defaultMessage: '外部状态' }),
            extra: <Badge color={data?.outerStatus !== 1 ? 'green' : 'blue'} text={data?.outerStatusName} />,
          },
        ],
      },
    ])
  }
  const toogle = (bool: boolean) => {
    setVisible(bool)
  }
  const handledetection = (record) => {
    const params: DetectionType = {
      qualityNo: dataSource?.qualityNo,
      vendorMemberName: dataSource?.vendorMemberName,
      inspectionType: record?.inspectionType,
      inspectionTypeName: record?.inspectionTypeName,
      submissionCount: record?.submissionCount,
      samplesCount: record?.samplesCount,
      concessionToReceiveCount: record?.concessionToReceiveCount,
      batchJudgmentType: record?.batchJudgmentType,
      acceptanceCount: record?.acceptanceCount,
      rejectCount: record?.rejectCount,
      qualityOrderProductBadRecordDetailVOS: record?.qualityOrderProductBadRecordDetailVOS,
      qualityOrderProductTestRecordDetailVOS: record?.qualityOrderProductTestRecordDetailVOS,
    }
    setDetection(params)
    toogle(true)
  }

  /** 生成售后单 */
  const handleGenerateSale = (batch?: boolean, record?: any) => {
    setIsbatch(batch)
    if (!batch) {
      setSaleid(record?.id)
    }
    setSaleVisible(true)
  }

  /** 查看售后单 */
  const handleCheckAfter = (record) => {
    switch (record?.afterSaleType) {
      case AFTER_SALE_TYPE.EXCHANGE:
        history.push(`/afterAbility/exchangeApplication/exchangeQuery/detail?id=${record?.afterSalesId}`)
        break
      case AFTER_SALE_TYPE.RETURN:
        history.push(`/afterAbility/returnApplication/returnQuery/detail?id=${record?.afterSalesId}`)
        break
      case AFTER_SALE_TYPE.MAINTAIN:
        history.push(`/afterAbility/repairApplication/repairQuery/detail?id=${record?.afterSalesId}`)
        break
    }
  }

  const showAfterBtn = (record) => {
    return record?.orderNo && record?.rejectCount && record?.afterSalesStatus === NOSUCESS ? true : false
  }

  /** 质检物料/商品表头 */
  const columns: ColumnType<any>[] = [
    ...(dataSource?.type === TYPE.SRM
      ? [
          {
            title: intl.formatMessage({ id: 'quality.wuliaobianhao', defaultMessage: '物料编号' }),
            key: 'skuId',
            dataIndex: 'skuId',
            width: 96,
            ellipsis: true,
          },
          {
            title: intl.formatMessage({
              id: 'quality.wuliaomingcheng',
              defaultMessage: '物料名称',
            }),
            key: 'productName',
            dataIndex: 'productName',
            ellipsis: true,
            width: 200,
          },
          {
            title: intl.formatMessage({ id: 'quality.guigexinghao', defaultMessage: '规格型号' }),
            key: 'type',
            dataIndex: 'type',
            width: 128,
            ellipsis: true,
          },
        ]
      : [
          {
            title: intl.formatMessage({ id: 'quality.shangpinID', defaultMessage: '商品 ID' }),
            key: 'skuId',
            dataIndex: 'skuId',
            width: 96,
            ellipsis: true,
          },
          {
            title: intl.formatMessage({
              id: 'quality.shangpinmingcheng',
              defaultMessage: '商品名称',
            }),
            key: 'productName',
            dataIndex: 'productName',
            ellipsis: true,
            width: 200,
          },
        ]),
    {
      title: intl.formatMessage({ id: 'quality.pinlei', defaultMessage: '品类' }),
      key: 'category',
      dataIndex: 'category',
      width: 96,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.pinpai', defaultMessage: '品牌' }),
      key: 'brand',
      dataIndex: 'brand',
      width: 88,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.danwei', defaultMessage: '单位' }),
      key: 'unit',
      dataIndex: 'unit',
      width: 64,
      ellipsis: true,
    },
    ...(dataSource?.orderResource !== ORDERRESOURCE.SEND
      ? [
          {
            title: intl.formatMessage({ id: 'quality.dingdanhao', defaultMessage: '订单号' }),
            key: 'orderNo',
            dataIndex: 'orderNo',
            width: 96,
            ellipsis: true,
          },
        ]
      : []),
    {
      title:
        dataSource?.orderResource !== ORDERRESOURCE.SEND
          ? intl.formatMessage({ id: 'quality.shouhuoshuliang', defaultMessage: '收货数量' })
          : '送样数量',
      key: 'receiveCount',
      dataIndex: 'receiveCount',
      width: 96,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.jianyanfangshi', defaultMessage: '检验方式' }),
      key: 'inspectionTypeName',
      dataIndex: 'inspectionTypeName',
      width: 96,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.songjianshuliang', defaultMessage: '送检数量' }),
      key: 'submissionCount',
      dataIndex: 'submissionCount',
      width: 88,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.chouyangshuliang', defaultMessage: '抽样数量' }),
      key: 'samplesCount',
      dataIndex: 'samplesCount',
      width: 88,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.picipanding', defaultMessage: '批次判定' }),
      key: 'batchJudgmentTypeName',
      dataIndex: 'batchJudgmentTypeName',
      width: 104,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.yunshoushuliang', defaultMessage: '允收数量' }),
      key: 'acceptanceCount',
      dataIndex: 'acceptanceCount',
      width: 96,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'quality.rangbujieshoushuliang',
        defaultMessage: '让步接收数量',
      }),
      key: 'concessionToReceiveCount',
      dataIndex: 'concessionToReceiveCount',
      width: 140,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'quality.jushoushuliang', defaultMessage: '拒收数量' }),
      key: 'rejectCount',
      dataIndex: 'rejectCount',
      width: 96,
      ellipsis: true,
    },
    ...(PATH === 'edit'
      ? [
          {
            title: intl.formatMessage({
              id: 'quality.shouhouzhuangtai',
              defaultMessage: '售后状态',
            }),
            key: 'afterSalesStatusName',
            dataIndex: 'afterSalesStatusName',
            width: 96,
            ellipsis: true,
            render: (_text, record) => <div style={tagStyle[record.afterSalesStatus]}>{_text}</div>,
          },
        ]
      : []),
    ...(PATH === 'detail' && dataSource?.type === TYPE.B2B
      ? [
          {
            title: intl.formatMessage({
              id: 'quality.shouhouzhuangtai',
              defaultMessage: '售后状态',
            }),
            key: 'afterSalesStatusName',
            dataIndex: 'afterSalesStatusName',
            width: 96,
            ellipsis: true,
            render: (_text, record) => <div style={tagStyle[record.afterSalesStatus]}>{_text}</div>,
          },
          {
            title: intl.formatMessage({ id: 'quality.shouhoudanhao', defaultMessage: '售后单号' }),
            key: 'afterSalesNo',
            dataIndex: 'afterSalesNo',
            width: 96,
            ellipsis: true,
            render: (_text, record) => (
              <>
                {dataSource?.type === TYPE.B2B && record?.afterSalesStatus === SUCESS && record?.afterSalesId ? (
                  <Button style={{ padding: 0 }} type="link" onClick={() => handleCheckAfter(record)}>
                    {_text}
                  </Button>
                ) : (
                  _text
                )}
              </>
            ),
          },
        ]
      : []),
    {
      title: intl.formatMessage({ id: 'quality.caozuo', defaultMessage: '操作' }),
      key: 'operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: dataSource?.type === TYPE.B2B ? 180 : 160,
      render: (_text, record) => (
        <>
          <Button type="link" onClick={() => handledetection(record)}>
            {intl.formatMessage({ id: 'quality.jianyanjilu', defaultMessage: '检验记录' })}
          </Button>
          {PATH === 'edit' &&
            dataSource?.type === TYPE.B2B &&
            record?.afterSalesStatus === SUCESS &&
            record?.afterSalesId && (
              <Button type="link" onClick={() => handleCheckAfter(record)}>
                {intl.formatMessage({
                  id: 'quality.zhakanshouhoudan',
                  defaultMessage: '查看售后单',
                })}
              </Button>
            )}
          {PATH === 'edit' && showAfterBtn(record) && (
            <>
              <Button type="link" onClick={() => handleGenerateSale(false, record)}>
                {intl.formatMessage({
                  id: 'quality.shengchengshouhoudan',
                  defaultMessage: '生成售后单',
                })}
              </Button>
            </>
          )}
        </>
      ),
    },
  ]
  /** 流转记录表头 */
  const recordLyoutColumns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'quality.xuhao', defaultMessage: '序号' }),
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'quality.caozuoren', defaultMessage: '操作人' }),
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'quality.bumen', defaultMessage: '部门' }),
      key: 'department',
      dataIndex: 'department',
    },
    {
      title: intl.formatMessage({ id: 'quality.zhiwei', defaultMessage: '职位' }),
      key: 'position',
      dataIndex: 'position',
    },
    {
      title: intl.formatMessage({ id: 'quality.zhuangtai', defaultMessage: '状态' }),
      key: 'statusName',
      dataIndex: 'statusName',
    },
    {
      title: intl.formatMessage({ id: 'quality.caozuo', defaultMessage: '操作' }),
      key: 'operation',
      dataIndex: 'operation',
    },
    {
      title: intl.formatMessage({ id: 'quality.caozuoshijian', defaultMessage: '操作时间' }),
      key: 'createTime',
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'quality.beizhu', defaultMessage: '备注' }),
      key: 'auditOpinion',
      dataIndex: 'auditOpinion',
    },
  ]
  /** 附件 */
  const handleFileEffect = (data: any) => {
    if (data) {
      setFileEffect([
        {
          col: [
            {
              extra: (
                <>
                  {data.map((item: any, index: number) => (
                    <Typography.Link
                      style={{ display: 'block', paddingBottom: '8px' }}
                      key={`link_${index + 1}`}
                      onClick={() => downloadFileByNameAndUrl(item.url, item.name)}
                    >
                      <LinkOutlined style={{ marginRight: '8px' }} />
                      {item.name}
                    </Typography.Link>
                  ))}
                </>
              ),
            },
          ],
        },
      ])
    }
  }

  const handleInnerLog = async () => {
    return new Promise((resolve) => {
      getOrderQualityGetInnerLog({ id: id?.toString() }).then((res: any) => {
        const data = {
          totalCount: res.data?.length,
          data: res.data,
        }
        resolve(data)
      })
    })
  }

  useEffect(() => {
    getOrderQualityDetail({ id: id?.toString() }).then((res) => {
      if (res.code !== 1000) {
        return
      }
      const { data } = res
      handleBasicEffect({
        orderResource: data?.orderResource,
        qualityNo: data?.qualityNo,
        digest: data?.digest,
        qualityTypeName: data?.qualityTypeName,
        vendorMemberName: data?.vendorMemberName,
        startTime: data?.startTime,
        endTime: data?.endTime,
        qualityInspector: data?.qualityInspector,
        remark: data?.remark,
        receiveId: data?.receiveId,
        receiveNo: data?.receiveNo,
        outerStatusName: data?.outerStatusName,
      })
      setDataSource(data)
      handleFileEffect(data?.urls)
    })
  }, [])

  const handleClose = () => {
    setDetection({} as DetectionType)
    toogle(false)
  }

  const controllerBtns = (
    <Button disabled={isEmpty(rowkeys)} type="default" onClick={() => handleGenerateSale(true)}>
      {intl.formatMessage({
        id: 'quality.piliangshengchengshouhoudan',
        defaultMessage: '批量生成售后单',
      })}
    </Button>
  )

  /** 生成售后单按钮事件 */
  const handleOk = () => {
    if (checkedId) {
      const qualityOrderProductVOS = isbatch
        ? dataSource?.qualityOrderProductVOS.filter((_item) => rowkeys.find((item) => item === _item?.id))
        : [dataSource?.qualityOrderProductVOS.find((item) => item?.id === saleid)]
      const saledata = {
        supplierMemberId: dataSource?.vendorMemberId,
        supplierRoleId: dataSource?.vendorRoleId,
        supplierMemberName: dataSource?.vendorMemberName,
        sourceType: 1, // 来源类型0.默认1.质检单
        sourceId: id, // 质检单id,
        qualityOrderProductVOS,
      }
      const orderType = qualityOrderProductVOS.map((_item) => _item?.orderType)
      if (!orderType.every((_item) => _item === orderType[count])) {
        message.warning(
          intl.formatMessage({
            id: 'quality.dingdanleixingbutongwu',
            defaultMessage: '订单类型不同,无法生成售后单！',
          }),
        )
        return
      }
      localStorage.setItem('GENERATE_QUALITY_AFTERSALE', JSON.stringify(saledata))
      switch (checkedId) {
        case AFTER_SALE_TYPE.EXCHANGE:
          history.push(`/afterAbility/exchangeApplication/exchangePrSubmit/add?orderType=${orderType[count]}`)
          break
        case AFTER_SALE_TYPE.RETURN:
          history.push(`/afterAbility/returnApplication/returnPrSubmit/add?orderType=${orderType[count]}`)
          break
        case AFTER_SALE_TYPE.MAINTAIN:
          history.push(`/afterAbility/repairApplication/repairPrSubmit/add?orderType=${orderType[count]}`)
          break
      }
    } else {
      message.error(intl.formatMessage({ id: 'purchaseOrder.error' }))
    }
  }

  return (
    <PageHeaderWrapper
      title={dataSource?.digest}
      subTitle={dataSource?.qualityNo}
      items={[
        {
          label: intl.formatMessage({ id: 'quality.jibenxinxi', defaultMessage: '基本信息' }),
          key: 'basicInfo',
        },
        {
          label:
            dataSource?.type === TYPE.SRM
              ? intl.formatMessage({ id: 'quality.zhijianwuliao', defaultMessage: '质检物料' })
              : intl.formatMessage({ id: 'quality.zhijianshangpin', defaultMessage: '质检商品' }),
          key: 'qualityMaterial',
        },
        {
          label: intl.formatMessage({ id: 'quality.fujian', defaultMessage: '附件' }),
          key: 'attachment',
        },
        {
          label: intl.formatMessage({ id: 'quality.liuzhuanjilu', defaultMessage: '流转记录' }),
          key: 'recordLyout',
        },
      ]}
    >
      <Fragment>
        {/* 基本信息 */}
        <BasicLayout id="basicInfo" effect={basicEffect} span={12} />
        {/* 质检物料 */}
        <QualityMaterial
          title={
            dataSource?.type === TYPE.SRM
              ? intl.formatMessage({ id: 'quality.zhijianwuliao', defaultMessage: '质检物料' })
              : intl.formatMessage({ id: 'quality.zhijianshangpin', defaultMessage: '质检商品' })
          }
          anchor="qualityMaterial"
          selectedRow={PATH === 'detail' ? false : true}
          columns={columns}
          getCheckboxProps={(record) => ({ disabled: !showAfterBtn(record) })}
          dataSource={dataSource?.qualityOrderProductVOS || []}
          controllerBtns={PATH !== 'detail' && controllerBtns}
          fetchRowkeys={(e) => setRowKeys(e)}
        />
        {/* 附件 */}
        <Attachment
          anchor="attachment"
          title={intl.formatMessage({ id: 'quality.fujian', defaultMessage: '附件' })}
          effect={fileEffect}
        />
        {/* 流转记录 */}
        <RecordLyout
          anchor="recordLyout"
          title={intl.formatMessage({ id: 'quality.liuzhuanjilu', defaultMessage: '流转记录' })}
          columns={recordLyoutColumns}
          fetchTableData={handleInnerLog}
        />
        {/* 检验记录弹窗 */}
        <DetectionDrawer detection={detection} visible={visible} onClose={handleClose} />
        {/* 选择售后类型 */}
        <SaleAfter
          visible={saleVisible}
          showDataSource={showDataSource}
          currentSelectedKey={checkedId}
          onOk={handleOk}
          onCancel={() => setSaleVisible(false)}
          onClickItem={(_id) => setCheckedId(_id)}
        />
      </Fragment>
    </PageHeaderWrapper>
  )
}
export default QualityManageDetail
