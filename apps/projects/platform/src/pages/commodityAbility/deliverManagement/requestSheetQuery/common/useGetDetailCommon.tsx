import { findLastIndexFlowState } from '@/utils'
import { useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { PENDING_SUBMIT_EXAM, PENDING_ADD_MATERIAL } from '@/constants/material'
import { Tag } from 'antd'
import { MEMBER_OUTER_COLUMNS } from '@/pages/customerAbility/constant'
import { tagStatus } from '../view'

/**
 * 该hook 作为获取详情页进本信息
 * @param options
 */
function useGetDetailCommon(options: any) {
  const { initialValue } = options
  const intl = useIntl()

  const anchorHeader = useMemo(
    () =>
      [
        initialValue?.interiorState !== PENDING_SUBMIT_EXAM && initialValue?.interiorState !== PENDING_ADD_MATERIAL
          ? {
              key: 'process',
              label: intl.formatMessage({
                id: 'material.process.title',
                defaultMessage: '流转状态',
              }),
            }
          : null,
        {
          key: 'basic',
          label: intl.formatMessage({ id: 'material.basic.title', defaultMessage: '基本信息' }),
        },
        {
          key: 'giveSample',
          label: '送样信息',
        },
        {
          key: 'giveSampleMaterial',
          label: initialValue?.scenes == 2 ? '送样物料' : '送样商品',
        },
        {
          key: 'sendSample',
          label: '寄样信息',
        },
        {
          key: 'returnSample',
          label: '退样信息',
        },
      ].filter(Boolean),
    [initialValue],
  )

  /* 基本信息 */
  const basicInfoList = useMemo(() => {
    return [
      {
        title: '送样需求单摘要',
        value: initialValue?.summary,
      },
      {
        title: '需求日期',
        value: initialValue?.demandDate,
      },
      {
        title: '送样需求单编号',
        value: initialValue?.deliveryNo,
      },
      {
        title: '供应商',
        value: initialValue?.vendorMemberName,
      },
      {
        title: '送样类型',
        value: initialValue?.typeName,
      },
      {
        title: '紧急程度',
        value: initialValue?.emergencyLevelName,
      },
      {
        title: '外部状态',
        value: (
          <Tag color={tagStatus.getTagStyle(initialValue?.outerStatus).bgColor}>
            <span style={{ color: tagStatus.getTagStyle(initialValue?.outerStatus).fontColor }}>
              {initialValue?.outerStatusName}
            </span>
          </Tag>
        ),
      },
    ]
  }, [initialValue])
  /* 送样 */
  const giveSampleInfoList = useMemo(() => {
    return [
      {
        title: '接收人',
        value: initialValue?.receiver,
      },
      {
        title: '送样地址',
        value: initialValue?.receiverName ? (
          <div>
            <div>{`${initialValue?.receiverName}/${initialValue?.receiverPhone}`}</div>
            <div>{initialValue?.address}</div>
          </div>
        ) : (
          ''
        ),
      },
      {
        title: '接收部门',
        value: initialValue?.receiveDepartment,
      },
      {
        title: '备注',
        value: initialValue?.remark,
      },
      {
        title: '联系电话',
        value: initialValue?.phone,
      },
    ]
  }, [initialValue])
  /* 寄样 */
  const sendSampleInfoList = useMemo(() => {
    const logisticsInfo = initialValue?.logisticsInfos?.find((val) => val.type === 1)
    return [
      {
        title: '寄样人',
        value: logisticsInfo?.name,
      },
      {
        title: '退样地址',
        value: logisticsInfo?.receiverName ? (
          <div>
            <div>{`${logisticsInfo?.receiverName}/${logisticsInfo?.receiverPhone}`}</div>
            <div>{logisticsInfo?.fullAddress}</div>
          </div>
        ) : (
          ''
        ),
      },
      {
        title: '联系电话',
        value: logisticsInfo?.phone,
      },
      {
        title: '备注',
        value: logisticsInfo?.remark,
      },
      {
        title: '预计送达时间',
        value: logisticsInfo?.estimatedDeliveryTime,
      },
      {
        title: '附件',
        value: logisticsInfo?.attachments ? (
          <a href={logisticsInfo?.attachments[0]?.url} target="_blank" rel="noreferrer">
            <span> {logisticsInfo?.attachments[0]?.name}</span>
          </a>
        ) : (
          ''
        ),
      },
      {
        title: '物流单号',
        value: logisticsInfo?.logisticsNo,
      },
    ]
  }, [initialValue?.logisticsInfos])
  /* 退样 */
  const returnSampleInfoList = useMemo(() => {
    const logisticsInfo = initialValue?.logisticsInfos?.find((val) => val.type === 2)
    return [
      {
        title: '退样人',
        value: logisticsInfo?.name,
      },
      {
        title: '物流单号',
        value: logisticsInfo?.logisticsNo,
      },
      {
        title: '联系电话',
        value: logisticsInfo?.phone,
      },
      {
        title: '备注',
        value: logisticsInfo?.remark,
      },
      {
        title: '预计送达时间',
        value: logisticsInfo?.estimatedDeliveryTime,
      },
      {
        title: '附件',
        value: logisticsInfo?.attachments ? (
          <a href={logisticsInfo?.attachments[0]?.url} target="_blank" rel="noreferrer">
            <span> {logisticsInfo?.attachments[0]?.name}</span>
          </a>
        ) : (
          ''
        ),
      },
    ]
  }, [initialValue?.logisticsInfos])

  /**
   * 获取当前工作流
   */
  const auditProcess = useMemo(() => {
    const outerVerifySteps: {
      step: number
      stepName: string
      roleName: string
      status: 'finish' | 'wait'
    }[] = initialValue?.simpleProcessDefVO
      ? initialValue?.simpleProcessDefVO?.tasks?.map((item) => {
          const currentStep = initialValue?.simpleProcessDefVO?.currentStep
          const tasks_l = initialValue?.simpleProcessDefVO?.tasks.length
          return {
            step: item.taskStep,
            stepName: item.properties.oper,
            roleName: item.roleName,
            status:
              currentStep === 0 || currentStep > item.taskStep || (tasks_l === 1 && currentStep === item.taskStep)
                ? 'finish'
                : 'wait',
          }
        })
      : []
    const outerVerifyCurrent = findLastIndexFlowState(initialValue?.simpleProcessDefVO.tasks)
    const innerVerifyCurrent = 0
    const innerVerifySteps = null
    const radioValue_: 'outer' | 'inner' = 'outer'
    const new_MEMBER_OUTER_COLUMNS = MEMBER_OUTER_COLUMNS.map((item) => {
      if (item.dataIndex === 'outerStatusName') {
        return {
          title: intl.formatMessage({ id: 'customerAbility.zhuangtai' }),
          dataIndex: 'statusName',
          render: (text) => {
            const styles = tagStatus.getTagStyle(text)
            return (
              <Tag color={styles.bgColor}>
                <span style={{ color: styles.fontColor }}>{text}</span>
              </Tag>
            )
          },
        }
      }
      return item
    })
    return {
      innerVerifySteps,
      outerVerifySteps,
      innerVerifyCurrent,
      outerVerifyCurrent,
      outerColumns: new_MEMBER_OUTER_COLUMNS,
      outerDataSource: initialValue?.outerHistories,
      circulationIcon: true,
      noTab: true,
      radioValue_,
    }
  }, [initialValue])

  /**
   * 送样商品
   */

  const recordColumn = useMemo(() => {
    const columns = [
      {
        title: '品类',
        dataIndex: 'category',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
      },
      {
        title: '单位',
        dataIndex: 'unit',
      },
      {
        title: '需求数量',
        dataIndex: 'demandQuantity',
      },
      {
        title: '批次判定',
        dataIndex: 'batchJudgmentTypeName',
      },
      {
        title: '允收数量',
        dataIndex: 'acceptanceCount',
      },
      {
        title: '让步接收数量',
        dataIndex: 'concessionToReceiveCount',
      },
      {
        title: '拒收数量',
        dataIndex: 'rejectCount',
      },
      {
        title: '需求时间',
        dataIndex: 'demandTime',
      },
      {
        title: '需求人',
        dataIndex: 'demandPerson',
      },
      {
        title: '需求部门',
        dataIndex: 'demandDepartment',
      },
      {
        title: '附件',
        dataIndex: 'attachment',
        render: (item) => (
          <a href={item?.url} target="_blank" rel="noreferrer">
            <span> {item?.name}</span>
          </a>
        ),
      },
    ]
    return initialValue?.scenes == 2
      ? [
          {
            title: '物料编号',
            dataIndex: 'skuId',
          },
          {
            title: '物料名称',
            dataIndex: 'name',
          },
          {
            title: '规格型号',
            dataIndex: 'spec',
          },
        ].concat(columns)
      : [
          {
            title: '商品ID',
            dataIndex: 'skuId',
          },
          {
            title: '商品名称',
            dataIndex: 'name',
          },
        ].concat(columns)
  }, [initialValue])

  return {
    anchorHeader: anchorHeader,
    auditProcess,
    basicInfoList,
    giveSampleInfoList,
    sendSampleInfoList,
    returnSampleInfoList,
    recordColumn,
  }
}

export default useGetDetailCommon
