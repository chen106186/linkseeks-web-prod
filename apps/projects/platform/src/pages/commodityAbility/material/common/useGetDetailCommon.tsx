import StatusTag from '@/components/StatusTag'
import type { GetProductMaterielGetMaterielProcessDetailResponse } from '@apps/apis'
import { findLastIndexFlowState } from '@/utils'
import { formatTimeString } from '@/utils'
import { useMemo } from 'react'
import FileItem from '../components/fileItem'
import { useIntl } from '@linkseeks/i18n'
import { PENDING_SUBMIT_EXAM, PENDING_ADD_MATERIAL } from '@/constants/material'
import { changeIcon, wl_extraFn } from '../components/wl_extras'
import { useWebIntl } from '@apps/locales'

type Options<T> = {
  initialValue: T
  before_sx?: boolean
  before_dwhs?: boolean
}

/**
 * 该hook 作为获取详情页进本信息
 * @param options
 */
function useGetDetailCommon<T extends GetProductMaterielGetMaterielProcessDetailResponse>(options: Options<T>) {
  const { initialValue, before_sx, before_dwhs } = options
  const intl = useIntl()
  const { changeVal } = wl_extraFn(intl)
  const translate = useWebIntl()

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
          key: 'properties',
          label: intl.formatMessage({ id: 'material.props.title', defaultMessage: '属性信息' }),
        },
        {
          key: 'output',
          label: intl.formatMessage({ id: 'material.output.title', defaultMessage: '生产与配送' }),
        },
        {
          key: 'unitConversion',
          label: intl.formatMessage({
            id: 'material.unitConversion.title',
            defaultMessage: '单位换算',
          }),
        },
        {
          key: 'contactInfo',
          label: intl.formatMessage({ id: 'material.contact.title', defaultMessage: '联系信息' }),
        },
        {
          key: 'images',
          label: intl.formatMessage({ id: 'material.images.title', defaultMessage: '物料图片' }),
        },
        {
          key: 'files',
          label: intl.formatMessage({ id: 'material.enclosure.title', defaultMessage: '附件' }),
        },
        {
          key: 'log',
          label: intl.formatMessage({ id: 'material.log.title', defaultMessage: '流转记录' }),
        },
      ].filter(Boolean),
    [initialValue],
  )

  const basicInfoList = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'material.code', defaultMessage: '物料编号' }),
        value: initialValue?.code,
        old_value: initialValue?.materielVersionResponse?.materiel?.code,
        isChange: changeVal(initialValue?.materielVersionResponse?.materiel?.code, initialValue?.code),
      },
      {
        title: intl.formatMessage({ id: 'material.versionNo', defaultMessage: '物料版本' }),
        value: initialValue?.materielVersionResponse?.versionNo,
        old_value:
          typeof initialValue?.materielVersionResponse?.versionNo == 'number'
            ? initialValue?.materielVersionResponse?.versionNo - 1
            : '',
      },
      {
        title: intl.formatMessage({ id: 'material.unit', defaultMessage: '单位' }),
        value: initialValue?.unitName,
        old_value: initialValue?.materielVersionResponse?.materiel?.unitName,
        isChange: changeVal(initialValue?.materielVersionResponse?.materiel?.unitName, initialValue?.unitName),
      },
      {
        title: intl.formatMessage({ id: 'material.name', defaultMessage: '物料名称' }),
        value: initialValue?.name,
        old_value: initialValue?.materielVersionResponse?.materiel?.name,
        isChange: changeVal(initialValue?.materielVersionResponse?.materiel?.name, initialValue?.name),
      },
      {
        title: intl.formatMessage({ id: 'material.costPrice', defaultMessage: '目录价' }),
        value: initialValue?.costPrice,
        old_value: initialValue?.materielVersionResponse?.materiel?.costPrice,
        isChange: changeVal(initialValue?.materielVersionResponse?.materiel?.costPrice, initialValue?.costPrice),
      },
      {
        title: intl.formatMessage({ id: 'material.type', defaultMessage: '规格型号' }),
        value: initialValue?.type,
        old_value: initialValue?.materielVersionResponse?.materiel?.type,
        isChange: changeVal(initialValue?.materielVersionResponse?.materiel?.type, initialValue?.type),
      },
      {
        title: intl.formatMessage({ id: 'material.brand', defaultMessage: '品牌' }),
        value: initialValue?.brand?.name,
        old_value: initialValue?.materielVersionResponse?.materiel?.brand?.name,
        isChange: changeVal(initialValue?.materielVersionResponse?.materiel?.brand?.name, initialValue?.brand?.name),
      },
      {
        title: intl.formatMessage({
          id: 'material.belong.materialGroup',
          defaultMessage: '所属物料组',
        }),
        value: initialValue?.materialGroup?.name,
        old_value: initialValue?.materielVersionResponse?.materiel?.materialGroup?.name,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.materialGroup?.name,
          initialValue?.materialGroup?.name,
        ),
      },
      {
        title: intl.formatMessage({ id: 'material.remark', defaultMessage: '备注' }),
        value: initialValue?.remake || '',
        old_value: initialValue?.materielVersionResponse?.materiel?.remake || '',
        isChange: changeVal(initialValue?.materielVersionResponse?.materiel?.remake, initialValue?.remake),
      },
      {
        title: intl.formatMessage({ id: 'material.category', defaultMessage: '品类' }),
        value: initialValue?.customerCategory?.name,
        old_value: initialValue?.materielVersionResponse?.materiel?.customerCategory?.name,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.customerCategory?.name,
          initialValue?.customerCategory?.name,
        ),
      },
      {
        title: intl.formatMessage({ id: 'material.status', defaultMessage: '物料状态' }),
        value: <StatusTag title={initialValue?.interiorStateName} type="primary" />,
        old_value: (
          <StatusTag title={initialValue?.materielVersionResponse?.materiel?.interiorStateName} type="primary" />
        ),
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.interiorStateName,
          initialValue?.interiorStateName,
        ),
      },
    ]
  }, [initialValue])
  /*生产与配送*/
  const outputInfoList = useMemo(() => {
    return [
      {
        title: intl.formatMessage({
          id: 'material.materialsManufacturer',
          defaultMessage: '生产厂家',
        }),
        value: initialValue?.materialsManufacturer,
        old_value: initialValue?.materielVersionResponse?.materiel?.materialsManufacturer,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.materialsManufacturer,
          initialValue?.materialsManufacturer,
        ),
      },
      {
        title: intl.formatMessage({
          id: 'material.materialsDeliverPeriod',
          defaultMessage: '到货周期',
        }),
        value: initialValue?.materialsDeliverPeriod,
        old_value: initialValue?.materielVersionResponse?.materiel?.materialsDeliverPeriod,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.materialsDeliverPeriod,
          initialValue?.materialsDeliverPeriod,
        ),
      },
      {
        title: intl.formatMessage({ id: 'material.materialsOrigin', defaultMessage: '产地' }),
        value: initialValue?.materialsOrigin,
        old_value: initialValue?.materielVersionResponse?.materiel?.materialsOrigin,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.materialsOrigin,
          initialValue?.materialsOrigin,
        ),
      },
      {
        title: intl.formatMessage({
          id: 'material.materialsDeliveryMethod',
          defaultMessage: '交货方式',
        }),
        value: initialValue?.materialsDeliveryMethod,
        old_value: initialValue?.materielVersionResponse?.materiel?.materialsDeliveryMethod,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.materialsDeliveryMethod,
          initialValue?.materialsDeliveryMethod,
        ),
      },
      {
        title: intl.formatMessage({ id: 'material.materialsDeparture', defaultMessage: '起始地' }),
        value: initialValue?.materialsDeparture,
        old_value: initialValue?.materielVersionResponse?.materiel?.materialsDeparture,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.materialsDeparture,
          initialValue?.materialsDeparture,
        ),
      },
    ]
  }, [initialValue])
  /*动态单位换算*/
  const unitInfoList = useMemo(() => {
    if (!initialValue?.unitConversions) {
      return []
    }
    const unitname = initialValue?.unitConversions[0]?.unitName
    const old_unitname =
      initialValue?.materielVersionResponse?.materiel?.unitConversions &&
      initialValue?.materielVersionResponse?.materiel?.unitConversions[0]?.unitName
    const newValue = {
      title: translate('web.resource.commodity.zuixiaodanwei'),
      value: unitname,
      old_value: old_unitname,
      isChange: changeVal(old_unitname, unitname),
    }
    const subUnitConversionList = initialValue?.unitConversions[0]?.subUnitConversionList
    const old_subUnitConversionList =
      (initialValue?.materielVersionResponse?.materiel?.unitConversions &&
        initialValue?.materielVersionResponse?.materiel?.unitConversions[0]?.subUnitConversionList) ||
      []
    if (before_dwhs) {
      return old_subUnitConversionList?.map((item) => {
        return {
          title: item.unitName,
          value: item.nums,
        }
      })
    }
    if (subUnitConversionList) {
      const result: any[] = []
      const old_ = [...old_subUnitConversionList]
      subUnitConversionList.map((_item, i) => {
        if (old_subUnitConversionList) {
          const old_i = old_.findIndex((v) => v.unitId == _item.unitId)
          if (old_i !== -1) {
            const old_item = old_.splice(old_i, 1)[0]
            result.push({
              title: _item.unitName,
              value: _item.nums,
              old_value: old_item.nums,
              isChange: changeVal(old_item.nums, _item.nums),
            })
          } else {
            result.push({
              title: _item.unitName,
              value: _item.nums,
              isChange: 'add',
            })
          }
          if (i == subUnitConversionList.length - 1 && old_.length) {
            old_.forEach((e) => {
              result.push({
                title: e.unitName,
                value: e.nums,
                isChange: 'del',
              })
            })
          }
        } else {
          result.push({
            title: _item.unitName,
            value: _item.nums,
            isChange: 'add',
          })
        }
      })
      return [newValue, ...result]
    } else return [newValue]
  }, [initialValue?.unitConversions, before_dwhs])
  /*联系信息*/
  const contactInfoList = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'material.chargeName', defaultMessage: '负责人' }),
        value: initialValue?.chargeRoleName,
        old_value: initialValue?.materielVersionResponse?.materiel?.chargeRoleName,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.chargeRoleName,
          initialValue?.chargeRoleName,
        ),
      },
      {
        title: intl.formatMessage({
          id: 'material.contactMemberPhone',
          defaultMessage: '联系电话',
        }),
        value: initialValue?.contactMemberPhone,
        old_value: initialValue?.materielVersionResponse?.materiel?.contactMemberPhone,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.contactMemberPhone,
          initialValue?.contactMemberPhone,
        ),
      },
      {
        title: intl.formatMessage({ id: 'material.contactMemberName', defaultMessage: '联系人' }),
        value: initialValue?.contactMemberName,
        old_value: initialValue?.materielVersionResponse?.materiel?.contactMemberName,
        isChange: changeVal(
          initialValue?.materielVersionResponse?.materiel?.contactMemberName,
          initialValue?.contactMemberName,
        ),
      },
    ]
  }, [initialValue])

  /** 动态物料属性 */
  const properties = useMemo(() => {
    if (!initialValue?.materialAttributeList) {
      return []
    }
    const materialAttributeList = initialValue?.materialAttributeList
    const old_materialAttributeList = initialValue?.materielVersionResponse?.materiel?.materialAttributeList
    if (before_sx) {
      return old_materialAttributeList?.map((item) => {
        return {
          title: item.customerAttribute.name,
          value: item.customerAttributeValueList
            .map((_row) => {
              return _row.value
            })
            .join(''),
        }
      })
    }
    const result = []
    if (materialAttributeList) {
      const old_ = old_materialAttributeList ? [...old_materialAttributeList] : []
      materialAttributeList.map((_item, i) => {
        if (old_materialAttributeList) {
          const old_i = old_.findIndex((v) => v.customerAttribute.id == _item.customerAttribute.id)
          if (old_i !== -1) {
            const old_item = old_.splice(old_i, 1)[0]
            const v = _item.customerAttributeValueList
              .map((_row) => {
                return _row.value
              })
              .join('')
            const o_v = old_item.customerAttributeValueList
              .map((_row) => {
                return _row.value
              })
              .join('')
            result.push({
              title: _item.customerAttribute.name,
              value: v,
              old_value: o_v,
              isChange: changeVal(o_v, v),
            })
          } else {
            result.push({
              title: _item.customerAttribute.name,
              value: _item.customerAttributeValueList
                .map((_row) => {
                  return _row.value
                })
                .join(''),
              isChange: 'add',
            })
          }
          if (i == materialAttributeList.length - 1 && old_.length) {
            old_.forEach((e) => {
              result.push({
                title: e.customerAttribute.name,
                value: e.customerAttributeValueList
                  .map((_row) => {
                    return _row.value
                  })
                  .join(''),
                isChange: 'del',
              })
            })
          }
        } else {
          result.push({
            title: _item.customerAttribute.name,
            value: _item.customerAttributeValueList
              .map((_row) => {
                return _row.value
              })
              .join(''),
            isChange: 'add',
          })
        }
      })
    }
    // const result = initialValue?.materialAttributeList.map((_item) => {
    //   return {
    //     title: _item.customerAttribute.name,
    //     value: _item.customerAttributeValueList.map((_row) => {
    //       return _row.value
    //     }).join('')
    //   }
    // })
    return result
  }, [initialValue?.materialAttributeList, before_sx])

  /**
   * 获取当前工作流
   */
  const auditProcess = useMemo(() => {
    const innerVerifySteps: {
      step: number
      stepName: string
      roleName: string
      status: 'finish' | 'wait'
    }[] = initialValue?.simpleProcessDefVO
      ? initialValue?.simpleProcessDefVO?.tasks?.map((item) => ({
          step: item.taskStep,
          stepName: item.taskName,
          roleName: item.roleName,
          status:
            initialValue?.simpleProcessDefVO?.currentStep > item.taskStep ||
            (initialValue?.simpleProcessDefVO?.tasks.length == 1 &&
              initialValue?.simpleProcessDefVO?.currentStep == item.taskStep)
              ? 'finish'
              : 'wait',
        }))
      : []
    const innerVerifyCurrent = findLastIndexFlowState(initialValue?.simpleProcessDefVO.tasks)
    const outerVerifyCurrent = 0
    const outerVerifySteps = null
    return {
      innerVerifySteps,
      outerVerifySteps,
      innerVerifyCurrent,
      outerVerifyCurrent,
    }
  }, [initialValue])

  /** 附件column */
  const tableColumn = useMemo(() => {
    return (before?: boolean) => {
      return [
        {
          title: intl.formatMessage({ id: 'material.enclosure.title', defaultMessage: '附件' }),
          render: (_text, record) => {
            const value = { name: record.name, url: record.url }
            return <FileItem value={value} before={!before && record.change} />
          },
        },
        {
          title: intl.formatMessage({ id: 'material.columns.description', defaultMessage: '备注' }),
          dataIndex: 'description',
          render: (text, record) => (
            <div>
              {text}
              {!before && changeIcon(record.desChange, record.old_url)}
            </div>
          ),
        },
      ]
    }
  }, [intl])

  /**
   * 内部单据流转记录
   */

  const recordColumn = useMemo(() => {
    return [
      {
        title: intl.formatMessage({ id: 'material.log.title', defaultMessage: '流转记录' }),
        dataIndex: 'id',
        render: (_text, _record, index) => {
          return <div>{index}</div>
        },
      },
      {
        title: intl.formatMessage({ id: 'material.log.column.roleName', defaultMessage: '操作人' }),
        dataIndex: 'roleName',
      },
      {
        title: intl.formatMessage({ id: 'material.log.column.department', defaultMessage: '部门' }),
        dataIndex: 'department',
      },
      {
        title: intl.formatMessage({ id: 'material.log.column.position', defaultMessage: '职位' }),
        dataIndex: 'position',
      },
      {
        title: intl.formatMessage({ id: 'material.log.column.state', defaultMessage: '状态' }),
        dataIndex: 'state',
      },
      {
        title: intl.formatMessage({ id: 'material.operation', defaultMessage: '操作' }),
        dataIndex: 'operation',
      },
      {
        title: intl.formatMessage({
          id: 'material.log.column.createTime',
          defaultMessage: '操作时间',
        }),
        dataIndex: 'createTime',
        render: (text) => {
          return formatTimeString(text)
        },
      },
      {
        title: intl.formatMessage({ id: 'material.remark', defaultMessage: '备注' }),
        dataIndex: 'auditOpinion',
      },
    ]
  }, [])

  return {
    anchorHeader: anchorHeader,
    auditProcess,
    basicInfoList,
    outputInfoList,
    unitInfoList,
    contactInfoList,
    tableColumn,
    recordColumn,
    properties,
  }
}

export default useGetDetailCommon
