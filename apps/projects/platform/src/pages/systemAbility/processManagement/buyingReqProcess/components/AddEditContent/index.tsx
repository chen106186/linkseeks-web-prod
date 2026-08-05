/**
 * 系统能力 - 流程引擎 - 请购单流程规则配置 新增/编辑/详情公共组件
 * @author: Crayon
 */
import React, { useEffect, useState, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import BaseInfo from '@/components/BaseInfo/BaseInfo'
import { Form } from 'antd'
import { commonProgressProps, getCommonTabLink } from '../../../constants'
import {
  getPurchaseRequisitionProcessBaseList,
  postPurchaseRequisitionProcessSave,
  postPurchaseRequisitionProcessUpdate,
  getPurchaseRequisitionProcessGet,
  postPurchaseRequisitionProcessSaveDefault,
} from '@apps/apis'
import ProcessImage from '../../../components/ProcessImage'
import ProcessRules from '../../../components/ProcessRuleConfig/ProcessRules'
import ContentLayout from '@/components/ContentLayout'
import { PAGE_TYPE } from '@/constants'
import ProcessName from '../../../components/ProcessName'
import ProcessBaseRadio from '../../../components/ProcessBaseRadio'

type PropsType = {
  pageType: 'add' | 'edit' | 'view'
  id?: string
  btnCode?: string
  title?: string | React.ReactNode
}

const AddEditContent: React.FC<PropsType> = ({ id: processId, btnCode, title, pageType }) => {
  const [form] = Form.useForm()
  const [processBaseList, setProcessBaseList] = useState<any[]>([])
  const [isDefault, setIsDefault] = useState<boolean>(false)

  const ref = useRef<any>()
  const processRulesRef = useRef<any>()

  const disabled = pageType === PAGE_TYPE.VIEW

  /** 提交 */
  const handleSubmit = (setLoading: Function, handleLeave: Function) => {
    form.validateFields().then((values) => {
      let params: any = {
        processId,
        ...values,
      }
      // 基本的流程规则修改或新增
      let requestApi =
        pageType === PAGE_TYPE.EDIT ? postPurchaseRequisitionProcessUpdate : postPurchaseRequisitionProcessSave
      // 修改默认流程规则比较特殊，需要调整参数以及特定的接口
      if (isDefault) {
        params = { processId: values.baseProcessId }
        requestApi = postPurchaseRequisitionProcessSaveDefault
      }
      setLoading?.(true)
      requestApi(params)
        .then(({ code, data }) => {
          if (code === 1000) {
            handleLeave?.(false)
            history.goBack()
          }
        })
        .finally(() => {
          setLoading?.(false)
        })
    })
  }

  /** 获取基础流程数据 */
  const getProcessBaseList = async (params: any = {}) => {
    const { code, data } = await getPurchaseRequisitionProcessBaseList(params)
    if (code === 1000) {
      setProcessBaseList(data)
    }
  }

  /** 获取详情 */
  const getDetail = async () => {
    if (processId) {
      const { code, data } = await getPurchaseRequisitionProcessGet({ processId })
      if (code === 1000) {
        form.setFieldsValue(data)
        // 设置是否为修改默认
        setIsDefault(data.isDefault === 1)
        // 修改默认的情况下获取基础流程数据需要传类型参数
        getProcessBaseList(data.isDefault === 1 ? { processType: data.baseProcess?.processType } : {})
        // 设置信息完整度
        ref?.current?.setProgress()
      }
    } else {
      getProcessBaseList()
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <ContentLayout
      ref={ref}
      form={form}
      title={title}
      pageType={pageType}
      tabLink={getCommonTabLink(isDefault)}
      btnCode={btnCode}
      onSubmit={handleSubmit}
      onFieldsChange={(_, _all) => {
        processRulesRef?.current?.setFieldsChange(_, _all)
      }}
      {...commonProgressProps}
    >
      <BaseInfo className="mt-0">
        <ProcessName pageType={pageType} disabled={disabled || isDefault} isDefault={isDefault} />
      </BaseInfo>
      <BaseInfo cols={1}>
        <ProcessBaseRadio
          disabled={disabled}
          dataSource={processBaseList}
          onValueChange={(v, item, lastValue) => {
            // 更改基础流程需要重新获取并设置字段数据
            processRulesRef?.current?.setFieldsType({ engineId: item?.engineId })
            // 由于字段数据变化，流程规则配置需要重置
            // lastValue 表示流程选择的上一个值，lastValue 存在才重置
            if (!!lastValue) {
              processRulesRef?.current?.resetCache()
            }
          }}
        />
      </BaseInfo>
      <BaseInfo cols={1}>
        <ProcessImage dataSource={processBaseList} />
      </BaseInfo>
      {!isDefault && (
        <BaseInfo cols={1}>
          <ProcessRules ref={processRulesRef} form={form} disabled={disabled || isDefault} />
        </BaseInfo>
      )}
    </ContentLayout>
  )
}

export default AddEditContent
