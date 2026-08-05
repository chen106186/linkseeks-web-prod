/**
 * 流程引擎 - 流程规则组件
 * @author: Crayon
 * @description: 规则引擎跟流程引擎的这两个配置组件目前虽然相似（有一丢丢差异），但考虑到后续的迭代可能导致两者的差异变大（产品的脑回路反正你永 远跟不上）
 * 所以还是决定分开来写。该页面还有些渲染优化没来得及处理，后面找时间搞
 */
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react'
import type { FormInstance } from 'antd'
import { Button, Form, Input, Radio, Row, Col, Select, Modal } from 'antd'
import { DeleteOutlined, CaretRightFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import type { FieldData } from 'rc-field-form/lib/interface'
import ConfigFieldCard from '@/components/ConfigFieldCard'
import cs from 'classnames'
import styles from './index.less'
import {
  conditionOptions,
  interrelationOptions,
  Fields_Type,
  CONDITION_VALUE,
  TABLE_SELECT_TYPE,
  TREE_SELECT_TYPE,
  CHECKBOX_SELECT_TYPE,
  RADIO_SELECT_TYPE,
} from '@/components/EngConfigComponent/constant'
import StringDatePicker from '@/components/StringDatePicker'
import moment from 'moment'
import CustomLastSelect from '@/components/CustomLastSelect'
import type { fetchTableParamsType } from '@/components/EngConfigComponent/CommonTableSelect'
import CommonTableSelect from '@/components/EngConfigComponent/CommonTableSelect'
import type { fetchTreeParamsType } from '@/components/EngConfigComponent/CommonTreeSelect'
import CommonTreeSelect from '@/components/EngConfigComponent/CommonTreeSelect'
import type { fetchCheckboxParamsType } from '@/components/EngConfigComponent/CommonCheckboxSelect'
import CommonCheckboxSelect from '@/components/EngConfigComponent/CommonCheckboxSelect'
import type { fetchRadioParamsType } from '@/components/EngConfigComponent/CommonRadioSelect'
import CommonRadioSelect from '@/components/EngConfigComponent/CommonRadioSelect'
import { getEngineProcessEngineGetProcessEngineInfo } from '@apps/apis'
import { getMemberManageCustomerList } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

type PropsType = {
  form?: FormInstance
  fetchFieldsTypeApi?: (params?: any) => Promise<any>
  fieldsTypeOption?: any
  disabled?: boolean
}

const getRuleAndFieldKey = (
  engineRuleList: any[],
  ruleKey: string,
  ruleIndex: number,
  fieldKey?: number,
  fieldIndex?: number,
) => {
  const ruleFieldId = engineRuleList?.[ruleIndex]?.id
  // 带key后缀表示是前端生成的id
  // 而且原先的id或key都为自增长的数字，这里补上后缀是为了防止标识重复，下面同理
  const ruleFieldKey = ruleFieldId || `${ruleKey}key`

  const fieldFieldId = engineRuleList?.[ruleIndex]?.ruleFieldList?.[fieldIndex]?.id
  const fieldFieldKey = fieldFieldId || `${fieldKey}key`

  const fieldFieldCode = engineRuleList?.[ruleIndex]?.ruleFieldList?.[fieldIndex]?.code
  return {
    ruleFieldKey,
    fieldFieldKey,
    fieldFieldCode,
  }
}

const getKey = (code: string, ruleFieldKey: string, fieldFieldKey: string) => {
  return `-${code}-RULE-${ruleFieldKey}-FIELD-${fieldFieldKey}`
}

const ProcessRules = (props: PropsType, ref) => {
  const intl = useIntl()
  const { form, fetchFieldsTypeApi = getEngineProcessEngineGetProcessEngineInfo, fieldsTypeOption, disabled } = props
  const [ruleShowConfig, setRuleShowConfig] = useState<any>({})
  const [fieldsTypeData, setFieldsTypeData] = useState<any[]>([])
  const [, setHandleRender] = useState<boolean>(false)
  const [drawerFetchParams, setDrawerFetchParams] = useState<any>({})
  const [islifeCycle, setIslifeCycle] = useState<boolean>(false)
  const [processType, setProcessType] = useState<string | number>('false')

  // 存放流程规则已选的弹窗数据 - 属性格式: -code-RULE-ruleFieldKey-FIELD-fieldFieldKey
  const cacheSelectRef = useRef<any>({})
  // 存放流程规则表格结构弹窗数据是否勾选全部 - 属性格式: -code-RULE-ruleFieldKey-FIELD-fieldFieldKey
  const cacheIsQueryAllRef = useRef<any>({})

  // 获取具体的字段配置数据
  const getFieldsTypeItem = (fieldCode: string) => {
    return fieldsTypeData.find((item) => item.code === fieldCode) || {}
  }

  /** 点击规则流程 x */
  const onRuleWrap = (key: string) => {
    const newConfig = { ...ruleShowConfig }
    newConfig[key] = !!!newConfig[key]
    setRuleShowConfig(newConfig)
  }

  // 删除流程规则
  const onDeleteRuleWrap = (id: any, callback: () => void) => {
    Modal.confirm({
      content: intl.formatMessage({
        id: 'processRuleSetting.deleteRuleTips',
        defaultMessage: '确认要删除该流程规则吗?',
      }),
      okText: intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' }),
      onOk: async () => {
        callback()
      },
    })
  }

  // 若某表格/树/多选框结构弹窗字段已选的数据，其他相同字段则不可选
  // -code-RULE-ruleFieldKey-FIELD-fieldFieldKey
  const onDrawerChange = (key: string, value: any, isDelete?: boolean) => {
    const newCacheSelectRef = { ...cacheSelectRef.current }
    newCacheSelectRef[key] = value
    if (isDelete) delete newCacheSelectRef[key]
    cacheSelectRef.current = newCacheSelectRef
    setHandleRender((val) => !val)
  }

  // 若某表格结构弹窗字段已选全部，其他相同字段不可操作
  // -code-RULE-ruleFieldKey-FIELD-fieldFieldKey
  const onQueryAllChange = (key: string, value: any, isDelete?: boolean) => {
    const newIsQueryAll = { ...cacheIsQueryAllRef.current }
    newIsQueryAll[key] = value
    if (isDelete) delete newIsQueryAll[key]
    cacheIsQueryAllRef.current = newIsQueryAll
    setHandleRender((val) => !val)
  }

  // 获取除去自身之后选择的弹窗数据
  const getSelectCache = (code: string, ruleFieldKey: string, fieldFieldKey: string) => {
    if (!!Object.keys(cacheSelectRef.current).length) {
      let cache: any[] = []
      for (const key in cacheSelectRef.current) {
        // 排除掉自身以及获取同一字段下的数据
        if (key !== getKey(code, ruleFieldKey, fieldFieldKey) && key.includes(`-${code}-`)) {
          cache = [...cache, ...cacheSelectRef.current[key]]
        }
      }
      return cache.map((item) => item.id)
    }
    return []
  }

  // 获取某字段是否已选全部
  const getIsQueryAll = (code: string, ruleFieldKey: string, fieldFieldKey: string) => {
    if (!!Object.keys(cacheIsQueryAllRef.current).length) {
      for (const key in cacheIsQueryAllRef.current) {
        if (
          key !== getKey(code, ruleFieldKey, fieldFieldKey) &&
          key.includes(`-${code}-`) &&
          cacheIsQueryAllRef.current[key] === 1
        ) {
          return true
        }
      }
    }
    return false
  }

  const onCommonValueChange = useCallback(
    (value, setCache, ruleFieldCode, ruleFieldKey, fieldFieldKey) => {
      if (setCache) {
        onDrawerChange(getKey(ruleFieldCode, ruleFieldKey, fieldFieldKey), value)
      }
    },
    [cacheSelectRef.current],
  )

  useImperativeHandle(ref, () => ({
    setFieldsChange(_: FieldData[]) {
      const engineRuleList = form.getFieldValue('engineRuleList')
      // 当字段类型改变的时候，需要重置一下对应的code/value/condition/isQueryAll
      if (_[0]?.name?.[4] === 'code') {
        const fieldsTypeItem = getFieldsTypeItem(_[0].value)
        const theRule = engineRuleList[_[0].name[1]]
        const theFields = theRule.ruleFieldList[_[0].name[3]]
        theFields.type = fieldsTypeItem?.type
        // 日期格式给予'今天'的默认值
        theFields.value = fieldsTypeItem?.type === Fields_Type.DATE ? moment().format('YYYY-MM-DD') : undefined
        theFields.condition = conditionOptions[fieldsTypeItem?.type][0].value
        // 是否勾选所有物料也需要重置
        theFields.isQueryAll = 0
        form.setFieldsValue({ engineRuleList })
      }

      // 当字段条件改变的时候，需要重置一下对应的value
      if (_[0]?.name?.[4] === 'condition') {
        const theRule = engineRuleList[_[0].name[1]]
        const theFields = theRule.ruleFieldList[_[0].name[3]]
        const fieldsTypeItem = getFieldsTypeItem(theFields.code)
        // 字符格式切换条件的时候值的格式可能会变化，所以这里需要重置
        if (fieldsTypeItem?.type === Fields_Type.STRING) {
          theFields.isQueryAll = 0
          theFields.value = undefined
        }
        form.setFieldsValue({ engineRuleList })
      }
    },
    setFieldsType(params: any = {}) {
      fetchFieldsTypeApi(params).then(({ code, data }) => {
        if (code === 1000) {
          // Select组件options参数字段使用驼峰法会报警告，这里处理一下
          const newData =
            data?.fieldList?.map(({ selectContent, codeAlias, ...rest }) => ({
              ...rest,
              select_content: selectContent,
              code_alias: codeAlias,
            })) || []
          setFieldsTypeData(newData)
        }
      })
    },
    setDrawerSelectFetchParams(
      params: fetchTableParamsType | fetchTreeParamsType | fetchCheckboxParamsType | fetchRadioParamsType = {},
    ) {
      setDrawerFetchParams(params)
    },
    resetCache() {
      form.setFieldsValue({ engineRuleList: [] })
      cacheSelectRef.current = {}
      cacheIsQueryAllRef.current = {}
    },
    setIslifeCycle,
    setProcessType,
  }))

  useEffect(() => {
    if (fieldsTypeOption) {
      setFieldsTypeData(fieldsTypeOption)
    }
  }, [fieldsTypeOption])

  return (
    <>
      <Form.List name="engineRuleList">
        {(ruleFields, { add: ruleAdd, remove: ruleRemove }) => {
          return (
            <div className={styles.rules}>
              {ruleFields.map((ruleField: any, ruleIndex) => (
                <div
                  className={cs(styles['rules-item'], ruleShowConfig[ruleField.key] && styles['rules-item-hidden'])}
                  key={ruleField.key}
                >
                  <div className={styles['rule-wrap']} onClick={() => onRuleWrap(ruleField.key)}>
                    <CaretRightFilled rotate={!ruleShowConfig[ruleField.key] ? 90 : 0} style={{ fontSize: 12 }} />
                    {`${intl.formatMessage({
                      id: 'processRuleSetting.liuchengguize',
                      defaultMessage: '流程规则',
                    })} ${ruleIndex + 1}`}

                    <div
                      className={styles['rule-delete']}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (disabled) return
                        onDeleteRuleWrap(form.getFieldsValue().engineRuleList[ruleIndex]?.id, () => {
                          const { ruleFieldKey } = getRuleAndFieldKey(
                            form.getFieldValue('engineRuleList'),
                            ruleField.key,
                            ruleIndex,
                          )

                          // 已选的弹窗数据一并移除
                          const newCacheSelectRef: any = {}
                          for (const key in cacheSelectRef.current) {
                            if (!key.includes(`RULE-${ruleFieldKey}`)) {
                              newCacheSelectRef[key] = cacheSelectRef.current[key]
                            }
                          }
                          cacheSelectRef.current = newCacheSelectRef
                          ruleRemove(ruleIndex)
                        })
                      }}
                      title={intl.formatMessage({
                        id: 'common.button.delete',
                        defaultMessage: '删除',
                      })}
                    >
                      <DeleteOutlined />
                    </div>
                  </div>
                  <Form.Item name={[ruleField.name, 'id']} fieldKey={[ruleField.fieldKey, 'id']} hidden>
                    <Input />
                  </Form.Item>
                  <Form.List name={[ruleField.name, 'ruleFieldList']}>
                    {(fields, { add: fieldAdd, remove: fieldRemove }) => {
                      return (
                        <div className={styles.fields}>
                          {fields.map((field: any, index) => (
                            <div key={field.key}>
                              <ConfigFieldCard
                                title={`${intl.formatMessage({
                                  id: 'processRuleSetting.condition',
                                  defaultMessage: '条件',
                                })} ${index + 1}`}
                              >
                                <Form.Item name={[field.name, 'id']} fieldKey={[field.fieldKey, 'id']} hidden>
                                  <Input />
                                </Form.Item>
                                <Form.Item name={[field.name, 'type']} fieldKey={[field.fieldKey, 'type']} hidden>
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  name={[field.name, 'isQueryAll']}
                                  fieldKey={[field.fieldKey, 'isQueryAll']}
                                  hidden
                                >
                                  <Input />
                                </Form.Item>
                                <Row gutter={16}>
                                  <Col style={{ width: 192 }}>
                                    <Form.Item
                                      name={[field.name, 'code']}
                                      fieldKey={[field.fieldKey, 'code']}
                                      rules={[
                                        {
                                          required: !disabled,
                                          message: intl.formatMessage({
                                            id: 'common.select',
                                            defaultMessage: '请选择',
                                          }),
                                        },
                                      ]}
                                    >
                                      <CustomLastSelect
                                        disabled={disabled}
                                        options={fieldsTypeData}
                                        onLastValueChange={(prevValue) => {
                                          // 字段类型改变时，通过此方法拿到上一次选择的字段，进而删除掉对应的缓存数据
                                          const ruleFieldList =
                                            form.getFieldValue('engineRuleList')?.[ruleIndex]?.ruleFieldList?.[index]
                                          const fieldsTypeItem = getFieldsTypeItem(ruleFieldList?.code)
                                          if (fieldsTypeItem?.select_content) {
                                            const { ruleFieldKey, fieldFieldKey } = getRuleAndFieldKey(
                                              form.getFieldValue('engineRuleList'),
                                              ruleField.key,
                                              ruleIndex,
                                              field.key,
                                              index,
                                            )
                                            onDrawerChange(getKey(prevValue, ruleFieldKey, fieldFieldKey), [], true)
                                            onQueryAllChange(getKey(prevValue, ruleFieldKey, fieldFieldKey), 0, true)
                                          }
                                        }}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col style={{ width: 192 }}>
                                    <Form.Item
                                      noStyle
                                      shouldUpdate={(prevValues, currentValues) => {
                                        return (
                                          prevValues.engineRuleList?.[ruleIndex]?.ruleFieldList?.[index]?.code !==
                                          currentValues.engineRuleList?.[ruleIndex]?.ruleFieldList?.[index]?.code
                                        )
                                      }}
                                    >
                                      {({ getFieldValue }) => {
                                        // 根据字段类型展示对应的条件下拉框
                                        const type =
                                          getFieldValue('engineRuleList')?.[ruleIndex]?.ruleFieldList?.[index]?.type
                                        return (
                                          <Form.Item
                                            name={[field.name, 'condition']}
                                            fieldKey={[field.fieldKey, 'condition']}
                                            rules={[
                                              {
                                                required: !disabled,
                                                message: intl.formatMessage({
                                                  id: 'common.select',
                                                  defaultMessage: '请选择',
                                                }),
                                              },
                                            ]}
                                          >
                                            <Select disabled={disabled} options={conditionOptions[type]} />
                                          </Form.Item>
                                        )
                                      }}
                                    </Form.Item>
                                  </Col>
                                  <Col style={{ flex: 1 }}>
                                    <Row>
                                      <Col style={{ flex: 1 }}>
                                        <Form.Item noStyle shouldUpdate={true}>
                                          {({ getFieldValue, setFieldsValue }) => {
                                            const ruleFieldList =
                                              getFieldValue('engineRuleList')?.[ruleIndex]?.ruleFieldList?.[index]
                                            const fieldsTypeItem = getFieldsTypeItem(ruleFieldList?.code)
                                            const condition = ruleFieldList?.condition
                                            const { ruleFieldKey, fieldFieldKey } = getRuleAndFieldKey(
                                              getFieldValue('engineRuleList'),
                                              ruleField.key,
                                              ruleIndex,
                                              field.key,
                                              index,
                                            )
                                            const inputDisabled =
                                              fieldsTypeItem?.select_content ===
                                                TABLE_SELECT_TYPE.includes(fieldsTypeItem?.select_content) &&
                                              getIsQueryAll(ruleFieldList?.code, ruleFieldKey, fieldFieldKey)
                                            const fetchTableExtensionApi: any = {}
                                            if (islifeCycle && processType == 2) {
                                              fetchTableExtensionApi.fetchTableApi = getMemberManageCustomerList
                                            }
                                            return (
                                              <Form.Item
                                                name={[field.name, 'value']}
                                                fieldKey={[field.fieldKey, 'value']}
                                                rules={[
                                                  {
                                                    required: !disabled,
                                                    message: intl.formatMessage({
                                                      id: 'common.bitian',
                                                      defaultMessage: '该字段是必填字段',
                                                    }),
                                                  },
                                                ]}
                                              >
                                                {fieldsTypeItem?.type === Fields_Type.NUMBER ? ( // 字段类型为数字
                                                  <Input
                                                    maxLength={10}
                                                    disabled={disabled}
                                                    type="number"
                                                    placeholder={intl.formatMessage({
                                                      id: 'common.form.input.placeholder',
                                                      defaultMessage: '请输入',
                                                    })}
                                                  />
                                                ) : fieldsTypeItem?.type === Fields_Type.DATE ? ( // 字段类型为日期
                                                  <StringDatePicker
                                                    disabled={disabled}
                                                    style={{ width: '100%' }}
                                                    placeholder={intl.formatMessage({
                                                      id: 'common.select',
                                                      defaultMessage: '请选择',
                                                    })}
                                                  />
                                                ) : fieldsTypeItem?.type === Fields_Type.STRING &&
                                                  fieldsTypeItem?.select_content ? ( // 字段类型为字符且存在选择弹窗
                                                  condition === CONDITION_VALUE.EQUAL ||
                                                  condition === CONDITION_VALUE.UNEQUAL ? ( // 条件为是或不是的情况才显示弹窗
                                                    // 表格结构的弹窗（目前有物料/供应商/商品/合同/客户）
                                                    TABLE_SELECT_TYPE.includes(fieldsTypeItem?.select_content) ? (
                                                      <CommonTableSelect
                                                        fetchParams={drawerFetchParams}
                                                        selectType={fieldsTypeItem?.select_content}
                                                        onValueChange={(value) => {
                                                          onDrawerChange(
                                                            getKey(ruleFieldList?.code, ruleFieldKey, fieldFieldKey),
                                                            value,
                                                          )
                                                        }}
                                                        fieldCode={fieldsTypeItem?.code_alias}
                                                        fieldLabel={fieldsTypeItem?.name}
                                                        selectCache={getSelectCache(
                                                          ruleFieldList?.code,
                                                          ruleFieldKey,
                                                          fieldFieldKey,
                                                        )}
                                                        isAll={ruleFieldList?.isQueryAll === 1}
                                                        disabled={
                                                          getIsQueryAll(
                                                            ruleFieldList?.code,
                                                            ruleFieldKey,
                                                            fieldFieldKey,
                                                          ) || disabled
                                                        }
                                                        isSomeQueryAll={getIsQueryAll(
                                                          ruleFieldList?.code,
                                                          ruleFieldKey,
                                                          fieldFieldKey,
                                                        )}
                                                        onQueryAll={(value) => {
                                                          const ruleEngineConfigData = getFieldValue('engineRuleList')
                                                          ruleEngineConfigData[ruleIndex].ruleFieldList[
                                                            index
                                                          ].isQueryAll = value ? 1 : 0
                                                          setFieldsValue({
                                                            engineRuleList: ruleEngineConfigData,
                                                          })
                                                          onQueryAllChange(
                                                            getKey(ruleFieldList?.code, ruleFieldKey, fieldFieldKey),
                                                            value ? 1 : 0,
                                                          )
                                                        }}
                                                        {...fetchTableExtensionApi}
                                                      />
                                                    ) : // 树结构的弹窗（目前有品类）
                                                    TREE_SELECT_TYPE.includes(fieldsTypeItem?.select_content) ? (
                                                      <CommonTreeSelect
                                                        fetchParams={drawerFetchParams}
                                                        disabled={disabled}
                                                        selectType={fieldsTypeItem?.select_content}
                                                        onValueChange={(value) => {
                                                          onDrawerChange(
                                                            getKey(ruleFieldList?.code, ruleFieldKey, fieldFieldKey),
                                                            value,
                                                          )
                                                        }}
                                                        fieldCode={fieldsTypeItem?.code_alias}
                                                        selectCache={getSelectCache(
                                                          ruleFieldList?.code,
                                                          ruleFieldKey,
                                                          fieldFieldKey,
                                                        )}
                                                      />
                                                    ) : // 多选框结构的弹窗（目前有来源商城/请款类型）
                                                    CHECKBOX_SELECT_TYPE.includes(fieldsTypeItem?.select_content) ? (
                                                      <CommonCheckboxSelect
                                                        fetchParams={drawerFetchParams}
                                                        disabled={disabled}
                                                        selectType={fieldsTypeItem?.select_content}
                                                        onValueChange={(value) => {
                                                          onDrawerChange(
                                                            getKey(ruleFieldList?.code, ruleFieldKey, fieldFieldKey),
                                                            value,
                                                          )
                                                        }}
                                                        fieldCode={fieldsTypeItem?.code_alias}
                                                        selectCache={getSelectCache(
                                                          ruleFieldList?.code,
                                                          ruleFieldKey,
                                                          fieldFieldKey,
                                                        )}
                                                      />
                                                    ) : // 单选框结构的弹窗（目前有生命周期阶段）
                                                    RADIO_SELECT_TYPE.includes(fieldsTypeItem?.select_content) ? (
                                                      <CommonRadioSelect
                                                        fetchParams={drawerFetchParams}
                                                        selectType={fieldsTypeItem?.select_content}
                                                        onValueChange={onCommonValueChange}
                                                        fieldCode={fieldsTypeItem?.code_alias}
                                                        selectCache={getSelectCache(
                                                          ruleFieldList?.code,
                                                          ruleFieldKey,
                                                          fieldFieldKey,
                                                        )}
                                                        ruleFieldCode={ruleFieldList?.code}
                                                        ruleFieldKey={ruleFieldKey}
                                                        fieldFieldKey={fieldFieldKey}
                                                        labelKey={'label'}
                                                      />
                                                    ) : null
                                                  ) : (
                                                    // 非 是/不是 类条件的话显示输入框
                                                    <Input
                                                      maxLength={200}
                                                      disabled={inputDisabled || disabled}
                                                      placeholder={
                                                        inputDisabled
                                                          ? intl.formatMessage({
                                                              id: 'processRuleSetting.selectAllTips',
                                                              defaultMessage: '已存在相关字段选择了全部',
                                                            })
                                                          : intl.formatMessage({
                                                              id: 'common.form.input.placeholder',
                                                              defaultMessage: '请输入',
                                                            })
                                                      }
                                                    />
                                                  )
                                                ) : (
                                                  // 目前仅有字符/数字/日期三种类型 所以这里是字符+无弹窗的情况
                                                  <Input
                                                    maxLength={200}
                                                    disabled={disabled}
                                                    placeholder={intl.formatMessage({
                                                      id: 'common.form.input.placeholder',
                                                      defaultMessage: '请输入',
                                                    })}
                                                  />
                                                )}
                                              </Form.Item>
                                            )
                                          }}
                                        </Form.Item>
                                      </Col>
                                      {!disabled && (
                                        <Col
                                          className={styles['minus-icon']}
                                          onClick={() => {
                                            // 移除掉字段的同时，需将对应的存储已选的物料或品类数据一并移除
                                            const { ruleFieldKey, fieldFieldKey, fieldFieldCode } = getRuleAndFieldKey(
                                              form.getFieldValue('engineRuleList'),
                                              ruleField.key,
                                              ruleIndex,
                                              field.key,
                                              index,
                                            )
                                            onDrawerChange(
                                              getKey(fieldFieldCode, ruleFieldKey, fieldFieldKey),
                                              [],
                                              true,
                                            )
                                            onQueryAllChange(
                                              getKey(fieldFieldCode, ruleFieldKey, fieldFieldKey),
                                              0,
                                              true,
                                            )
                                            fieldRemove(index)
                                          }}
                                        >
                                          <MinusOutlined />
                                        </Col>
                                      )}
                                    </Row>
                                  </Col>
                                </Row>
                              </ConfigFieldCard>
                            </div>
                          ))}
                          {!disabled && (
                            <Form.Item>
                              <Button
                                type="dashed"
                                disabled={disabled}
                                onClick={() => {
                                  fieldAdd({
                                    type: fieldsTypeData[0]?.type,
                                    code: fieldsTypeData[0]?.code,
                                    isQueryAll: 0,
                                    condition: conditionOptions[fieldsTypeData[0]?.type]?.[0]?.value,
                                  })
                                }}
                                style={{ width: '100%' }}
                              >
                                <PlusOutlined />{' '}
                                {intl.formatMessage({
                                  id: 'processRuleSetting.tianjiaziduan',
                                  defaultMessage: '添加字段',
                                })}
                              </Button>
                            </Form.Item>
                          )}
                        </div>
                      )
                    }}
                  </Form.List>
                  <ConfigFieldCard
                    title={intl.formatMessage({
                      id: 'processRuleSetting.xianghuguanxi',
                      defaultMessage: '相互关系',
                    })}
                  >
                    <Form.Item name={[ruleField.name, 'relation']} fieldKey={[ruleField.fieldKey, 'relation']}>
                      <Radio.Group disabled={disabled} className="use-radio-button">
                        {interrelationOptions.map((_item) => (
                          <Radio key={_item.value} value={_item.value}>
                            {_item.label}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </ConfigFieldCard>
                </div>
              ))}
              {
                // 限制3个流程规则
                ruleFields.length < 3 && !disabled && (
                  <div>
                    <Form.Item>
                      <Button
                        disabled={disabled}
                        type="primary"
                        onClick={() => {
                          ruleAdd({ relation: interrelationOptions[0].value })
                        }}
                      >
                        {intl.formatMessage({
                          id: 'processRuleSetting.tianjiaguize',
                          defaultMessage: '添加规则',
                        })}
                      </Button>
                    </Form.Item>
                  </div>
                )
              }
            </div>
          )
        }}
      </Form.List>
    </>
  )
}

export default forwardRef(ProcessRules)
