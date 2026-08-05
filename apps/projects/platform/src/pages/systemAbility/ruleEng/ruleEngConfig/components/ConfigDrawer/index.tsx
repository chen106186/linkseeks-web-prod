import React, { useState, forwardRef, memo, useCallback, useRef } from 'react'
import { Form, Modal } from 'antd'
import CommonDrawer from '@/components/CommonDrawer'
import ProcessRules from '../ProcessRules'
import { getEngineProcessRuleConfigGetProcessRuleConfig, postEngineConfigBatchSaveOrUpdate } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { RULE_ENR_TYPE, Select_Content_Type } from '@/components/EngConfigComponent/constant'

interface PropsType {
  onChange?: () => void
}

const ConfigDrawer = (props: PropsType, ref) => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const { onChange } = props

  const [fieldsTypeOption, setFieldsTypeOptions] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const paramsRef = useRef<any>({})
  const isValuesChangeRef = useRef<boolean>(false)
  const processRulesRef = useRef<any>()

  // 获取字段类型下拉数据
  const getFiledTypeData = async (params: any, type: number, processType: number) => {
    const { code, data } = await getEngineProcessRuleConfigGetProcessRuleConfig(params)
    if (code === 1000) {
      // Select组件options参数字段不支持驼峰法，这里处理一下
      let newData = data.map(({ selectContent, codeAlias, ...rest }) => ({
        ...rest,
        code_alias: codeAlias,
        select_content: selectContent,
      }))
      //是生命周期规则的话 processType 1表示供应商、2表示客户
      if (type === RULE_ENR_TYPE.LIFECYCLE_CHANGE && (processType == 1 || processType == 2)) {
        // processType是供应商就过滤掉客户（9），否则就过滤掉供应商（4）
        newData = newData.filter((item) => item.select_content !== (processType == 1 ? 9 : 4))
      }

      // mock
      // newData.push({
      //   code: "lifeId",
      //   code_alias: 'id',
      //   id: 13033,
      //   name: "生命周期阶段",
      //   remark: null,
      //   select_content: 11,
      //   type: 1,
      // })
      setFieldsTypeOptions(newData)
    }
  }

  const handleOk = useCallback(() => {
    form.validateFields().then((values) => {
      const { id, ruleEngineConfigFieldRelations } = values
      const params = {
        ...paramsRef.current,
        id,
        ruleEngineConfigFieldRelations: ruleEngineConfigFieldRelations?.map((item) => {
          const temp = item.ruleEngineConfigFields || []
          // 过滤出字段值不为空的字段数据和选择了'所有物料'(isQueryAll)的字段数据
          const ruleEngineConfigFields: any[] = temp?.filter(
            (i) => !['', undefined, null].includes(i.value) || i.isQueryAll === 1,
          )
          return {
            ...item,
            // 若字段配置列表数据的长度为0，则将其置为undefined
            ruleEngineConfigFields: ruleEngineConfigFields.length ? ruleEngineConfigFields : undefined,
          }
        }),
      }
      setLoading(true)
      postEngineConfigBatchSaveOrUpdate(params)
        .then(({ code }) => {
          if (code === 1000) {
            processRulesRef.current?.resetCache()
            onChange?.()
            isValuesChangeRef.current = false
            ref.current.show(false)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }, [loading])

  const handleCancel = useCallback((fnClose) => {
    if (isValuesChangeRef.current) {
      Modal.confirm({
        content: intl.formatMessage({
          id: 'common.close.tips',
          defaultMessage: '您还有未保存的内容，是否确定要关闭？',
        }),
        onOk: () => {
          processRulesRef.current?.resetCache()
          isValuesChangeRef.current = false
          onChange?.()
          fnClose()
        },
      })
    } else {
      processRulesRef.current?.resetCache()
      onChange?.()
      fnClose()
    }
  }, [])

  const handleShow = useCallback(async ({ process, formData }: any, flag: boolean) => {
    if (flag) {
      form.resetFields()
      paramsRef.current = process
      // 若为生命周期变更规则引擎
      // 为选择生命周期弹窗设置好接口基本参数
      if (process.type === RULE_ENR_TYPE.LIFECYCLE_CHANGE) {
        processRulesRef.current?.setDrawerFetchParams({
          [Select_Content_Type.SelectLifeCycle]: { processType: process.processType },
        })
        processRulesRef.current?.setIslifeCycle(true)
      }
      await getFiledTypeData(
        { processId: process?.processId, processStep: process?.processStep },
        process?.type,
        process?.processType,
      )
      if (formData) {
        form.setFieldsValue(formData)
      }
    }
  }, [])

  const onFormFieldsChange = useCallback(() => {
    isValuesChangeRef.current = true
  }, [])

  return (
    <CommonDrawer
      ref={ref}
      title={intl.formatMessage({ id: 'common.button.edit', defaultMessage: '编辑' })}
      width={400}
      onOk={handleOk}
      onCancel={handleCancel}
      onShow={handleShow}
      confirmLoading={loading}
      destroyOnClose
    >
      <ProcessRules
        ref={processRulesRef}
        form={form}
        fieldsTypeOption={fieldsTypeOption}
        onFormFieldsChange={onFormFieldsChange}
      />
    </CommonDrawer>
  )
}

export default memo(forwardRef(ConfigDrawer))
