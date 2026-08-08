/**
 * 系统能力 - 规则引擎 - 规则引擎配置
 * @author: Crayon
 */
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { useQuery } from '@linkseeks/router-core'
import type { RefHandleType } from '@/components/FlowChart'
import FlowChart from '@/components/FlowChart'
import ConfigDrawer from './components/ConfigDrawer'
import type { HandleType } from '@/components/CommonDrawer'
import { Spin } from 'antd'
import { getProductMaterialProcessEngineGet } from '@apps/apis'
import {
  getOrderPurchaseProcessEngineGet,
  getOrderQualityProcessEngineDetail,
  getOrderTradeRuleEngineGetAfterSaleB2bInternal,
} from '@apps/apis'
import { getPurchaseRequisitionProcessEngineGet } from '@apps/apis'
import { getContractRuleEngineCoordinationProcess, getContractRuleEngineProcess } from '@apps/apis'
import { getSettlementApplyAmountProcessGet } from '@apps/apis'
import { getEngineConfigGetRuleEngineInfo } from '@apps/apis'
import { getMemberLifeCycleProcessEngineGet } from '@apps/apis'
import { RULE_ENR_TYPE, RULE_TYPE } from '@/components/EngConfigComponent/constant'

const getFetchDetailApi = async (type: RULE_TYPE, params: any) => {
  switch (type) {
    case RULE_TYPE.MATERIAL_MANAGE:
      return await getProductMaterialProcessEngineGet(params) // 查询物料流程规则引擎详情

    case RULE_TYPE.BUYING_REQUISITION:
      return await getPurchaseRequisitionProcessEngineGet(params) // 查询请购单管理规则引擎详情

    case RULE_TYPE.PURCHASE_PROCESS:
      return await getOrderPurchaseProcessEngineGet(params) // 查询采购流程规则引擎详情

    case RULE_TYPE.CONTRACT_MANAGE:
      return await getContractRuleEngineProcess(params) // 查询合同管理规则引擎详情

    case RULE_TYPE.CONTRACT_COORDINATION:
      return await getContractRuleEngineCoordinationProcess(params) // 查询合同协同规则引擎详情

    case RULE_TYPE.REQUEST_FUNDS_MANAGE:
      return await getSettlementApplyAmountProcessGet(params) // 查询请款单管理规则引擎详情

    case RULE_TYPE.PURCHASE_PROCESS_SRM:
      return await getOrderPurchaseProcessEngineGet(params) // 查询采购订单(SRM)规则引擎详情

    case RULE_TYPE.AFTER_SALES_B2B:
      return await getOrderTradeRuleEngineGetAfterSaleB2bInternal(params) // 查询售后管理(B2B)规则引擎详情

    case RULE_TYPE.QUALITY_MANAGE:
      return await getOrderQualityProcessEngineDetail(params) // 查询质量管理规则引擎详情

    case RULE_TYPE.LIFECYCLE_CHANGE:
      return await getMemberLifeCycleProcessEngineGet(params) // 查询生命周期变更规则引擎详情

    default:
      return { code: 1102, data: null }
  }
}

const RuleEngConfig: React.FC = () => {
  const { type, processId } = useQuery()

  const [flowOptions, setFlowOptions] = useState<any[]>()
  const [spinning, setSpinning] = useState<boolean>(false)

  const flowRef = useRef<RefHandleType>()
  const drawRef = useRef<HandleType>()

  /**
   * 通过列表ID获取流程规则详情
   * 这里请求详情的ID的字段名为processId
   */
  const getProcessEngineDetail = async () => {
    if (type && processId) {
      setSpinning(true)
      const { code, data } = await getFetchDetailApi(type, { processId })
      if (code === 1000) {
        // 这里把步骤key（processKey）存放进名为processId的属性中
        // 只因为下面查询/新增/编辑流程步骤对应的规则配置信息的时候，其请求的字段名也为processId
        // 但是它取的却是processKey的值

        // 把外部传进来的列表ID(即processId)存放进名为ruleId的属性中
        // 只因为下面查询/新增/编辑流程步骤对应的规则配置信息的时候，其请求的字段名为ruleId
        // 但是它取的值是外部传进来的列表ID(即processId)

        // 要问为什么，只能说后端字段名称没区分好
        const newOptions =
          data.responses?.map((item) => ({
            ruleId: processId,
            processStepName: item.taskName,
            processStep: item.taskStep,
            processId: data.processKey,
            processName: data.processName,
            processType: data.processType,
          })) || []
        setFlowOptions(newOptions)
        setSpinning(false)
      }
    }
  }

  const handleDrawer = useCallback(() => {
    flowRef?.current?.setActive('')
    drawRef?.current?.show(false)
  }, [])

  /**
   * 点击流程步骤之后获取步骤对应的规则配置信息
   */
  const onFlowChartChange = useCallback(async (processStep: string, optionItem: any) => {
    setSpinning(true)
    // 正如上面所说，后端字段名称没区分好
    // 这里ruleId参数取的是列表ID，即列表传进来的processId
    // 这里processId参数取的是步骤的processKey，即flowOptions里的processId
    const { code, data } = await getEngineConfigGetRuleEngineInfo({
      ruleId: optionItem.ruleId,
      processId: optionItem.processId,
      processStep,
    })
    setSpinning(false)
    if (code === 1000) {
      const params = { process: { ...optionItem, type: RULE_ENR_TYPE[type] }, formData: data }
      drawRef?.current?.show(true, params)
    }
  }, [])

  useEffect(() => {
    getProcessEngineDetail()
  }, [])

  return (
    <PageHeaderWrapper title="规则引擎配置" onBack={() => history.goBack()}>
      <Spin spinning={spinning}>
        <FlowChart
          ref={flowRef}
          options={flowOptions}
          onChange={onFlowChartChange}
          fieldNames={{ label: 'processStepName', value: 'processStep' }}
        />
        <ConfigDrawer ref={drawRef} onChange={handleDrawer} />
      </Spin>
    </PageHeaderWrapper>
  )
}

export default RuleEngConfig
