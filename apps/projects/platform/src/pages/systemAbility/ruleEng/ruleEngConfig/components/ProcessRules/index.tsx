/**
 * 规则引擎 - 流程规则组件
 * @author: Crayon
 * @description: 规则引擎跟流程引擎的这两个配置组件目前虽然相似（有一丢丢差异），但考虑到后续的迭代可能导致两者的差异变大（产品的脑回路反正你永 远跟不上）
 * 所以还是决定分开来写。该页面还有些渲染优化没来得及处理，后面找时间搞
 */
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, memo, useCallback } from 'react'
import type { FormInstance } from 'antd'
import { Button, Form, Input, Radio, Row, Col, Select, Modal } from 'antd'
import { DeleteOutlined, CaretRightFilled, PlusOutlined } from '@ant-design/icons'
import ConfigFieldCard from '@/components/ConfigFieldCard'
import cs from 'classnames'
import styles from './index.less'
import SelectRoles from '../SelectRoles'
import { getMemberRoleMemberRoleList, getMemberManageCustomerList } from '@apps/apis'
import {
  conditionOptions,
  interrelationOptions,
  Fields_Type,
  Select_Content_Type,
  CONDITION_VALUE,
  TABLE_SELECT_TYPE,
  TREE_SELECT_TYPE,
  CHECKBOX_SELECT_TYPE,
  RADIO_SELECT_TYPE,
} from '@/components/EngConfigComponent/constant'
import StringDatePicker from '@/components/StringDatePicker'
import moment from 'moment'
import CustomLastSelect from '@/components/CustomLastSelect'
import { useIntl } from '@linkseeks/i18n'
import CommonTableSelect from '@/components/EngConfigComponent/CommonTableSelect'
import CommonTreeSelect from '@/components/EngConfigComponent/CommonTreeSelect'
import CommonCheckboxSelect from '@/components/EngConfigComponent/CommonCheckboxSelect'
import CommonRadioSelect from '@/components/EngConfigComponent/CommonRadioSelect'

type PropsType = {
  form?: FormInstance
  fieldsTypeOption?: any
  onFormFieldsChange?: (_?: any, _all?: any) => void
}

const getRuleAndFieldKey = (
  ruleEngineConfigFieldRelations: any[],
  ruleKey: string,
  ruleIndex: number,
  fieldKey?: number,
  fieldIndex?: number,
) => {
  const ruleFieldId = ruleEngineConfigFieldRelations?.[ruleIndex]?.id
  // 这里补上id后缀或者key后缀，是为了区分规格或字段的唯一标识是后端生成的还是前端生成的
  // 而且原先的id或key都为自增长的数字，这里补上后缀是为了防止标识重复，下面同理
  const ruleFieldKey = ruleFieldId ? `${ruleFieldId}id` : `${ruleKey}key`

  const fieldFieldId = ruleEngineConfigFieldRelations?.[ruleIndex]?.ruleEngineConfigFields?.[fieldIndex]?.id
  const fieldFieldKey = fieldFieldId ? `${fieldFieldId}id` : `${fieldKey}key`

  const fieldFieldCode = ruleEngineConfigFieldRelations?.[ruleIndex]?.ruleEngineConfigFields?.[fieldIndex]?.code
  return {
    ruleFieldKey,
    fieldFieldKey,
    fieldFieldCode,
  }
}

const getKey = (code: string, ruleFieldKey: string, fieldFieldKey: string) => {
  return `-${code}-RULE-${ruleFieldKey}-FIELD-${fieldFieldKey}`
}

const ProcessRules = ({ form, fieldsTypeOption, onFormFieldsChange }: PropsType, ref) => {
  const intl = useIntl()
  const [ruleShowConfig, setRuleShowConfig] = useState<Record<string, unknown>>({})
  const [rolesOptions, setRolesOptions] = useState<any[]>([])
  const [, setHandleRender] = useState<boolean>(false)
  const [drawerFetchParams, setDrawerFetchParams] = useState<any>({})
  const [islifeCycle, setIslifeCycle] = useState<boolean>(false)

  // 存放流程规则已选的处理角色
  const cacheSelectRolesRef = useRef<any>({})
  // 存放流程规则已选的弹窗数据 - 属性格式: -code-RULE-ruleFieldKey-FIELD-fieldFieldKey
  const cacheSelectRef = useRef<any>({})
  // 存放流程规则表格结构弹窗数据是否勾选全部 - 属性格式: -code-RULE-ruleFieldKey-FIELD-fieldFieldKey
  const cacheIsQueryAllRef = useRef<any>({})

  // 获取角色拉下数据
  const getMemberRoleData = async () => {
    const { code, data } = await getMemberRoleMemberRoleList({ status: '1', typeEnum: 0 } as any)
    if (code === 1000) {
      const ruleEngineConfigFieldRelations = form.getFieldValue('ruleEngineConfigFieldRelations')
      const selectRoles: any = {}
      ruleEngineConfigFieldRelations?.forEach((item) => {
        selectRoles[`${item.id}id`] = item.handleMemberRoleId
      })
      // 在编辑的情况下，需找出已被选择的的角色数据，并赋予不可选属性
      const newOptions = data?.map((item) => ({
        label: item.roleName,
        value: item.id,
        disabled: Object.values(selectRoles).includes(item.id),
      }))
      cacheSelectRolesRef.current = selectRoles
      setRolesOptions(newOptions)
    }
  }

  // 获取具体的字段配置数据
  const getFieldsTypeItem = (fieldCode: string) => {
    return fieldsTypeOption.find((item) => item.code === fieldCode) || {}
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

  // 选择处理角色处理下拉数据
  // 因为若已被某条流程规则选择的角色，其他流程规则不可选
  const onRoleChange = (key: string, value: string, isDelete?: boolean) => {
    const selectRoles = cacheSelectRolesRef.current
    selectRoles[key] = value
    if (isDelete) delete selectRoles[key]
    const newOptions = rolesOptions.map((item) => ({
      ...item,
      disabled: Object.values(selectRoles).includes(item.value),
    }))
    cacheSelectRolesRef.current = selectRoles
    setRolesOptions(newOptions)
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
    resetCache() {
      form.resetFields()
      cacheSelectRolesRef.current = {}
      cacheSelectRef.current = {}
      cacheIsQueryAllRef.current = {}
    },
    setDrawerFetchParams,
    setIslifeCycle,
  }))

  useEffect(() => {
    getMemberRoleData()
  }, [])

  return (
    <Form
      form={form}
      onFieldsChange={(_, _all) => {
        onFormFieldsChange?.(_, _all)

        const ruleEngineConfigFieldRelations = form.getFieldValue('ruleEngineConfigFieldRelations')
        // 当字段类型改变的时候，需要重置一下对应的code/value/condition/isQueryAll
        if (_[0]?.name?.[4] === 'code') {
          const fieldsTypeItem = getFieldsTypeItem(_[0].value)
          ruleEngineConfigFieldRelations[_[0].name[1]].ruleEngineConfigFields[_[0].name[3]].type = fieldsTypeItem?.type
          // 日期格式给予'今天'的默认值
          ruleEngineConfigFieldRelations[_[0].name[1]].ruleEngineConfigFields[_[0].name[3]].value =
            fieldsTypeItem?.type === Fields_Type.DATE ? moment().format('YYYY-MM-DD') : undefined
          ruleEngineConfigFieldRelations[_[0].name[1]].ruleEngineConfigFields[_[0].name[3]].condition =
            conditionOptions[fieldsTypeItem?.type][0].value
          // 是否勾选所有物料也需要重置
          ruleEngineConfigFieldRelations[_[0].name[1]].ruleEngineConfigFields[_[0].name[3]].isQueryAll = 0
          form.setFieldsValue({ ruleEngineConfigFieldRelations })
        }

        // 当字段条件改变的时候，需要重置一下对应的value
        if (_[0]?.name?.[4] === 'condition') {
          const fieldsTypeItem = getFieldsTypeItem(
            ruleEngineConfigFieldRelations[_[0].name[1]].ruleEngineConfigFields[_[0].name[3]].code,
          )
          // 字符格式切换条件的时候值的格式可能会变化，所以这里需要重置
          if (fieldsTypeItem?.type === Fields_Type.STRING) {
            ruleEngineConfigFieldRelations[_[0].name[1]].ruleEngineConfigFields[_[0].name[3]].isQueryAll = 0
            ruleEngineConfigFieldRelations[_[0].name[1]].ruleEngineConfigFields[_[0].name[3]].value = undefined
          }
          form.setFieldsValue({ ruleEngineConfigFieldRelations })
        }
      }}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.List name="ruleEngineConfigFieldRelations">
        {(ruleFields, { add: ruleAdd, remove: ruleRemove }) => {
          return (
            <div className={styles.rules}>
              {ruleFields.map((ruleField: any, ruleIndex) => (
                <div
                  className={cs(styles['rules-item'], !ruleShowConfig[ruleField.key] && styles['rules-item-hidden'])}
                  key={ruleField.key}
                >
                  <div className={styles['rule-wrap']} onClick={() => onRuleWrap(ruleField.key)}>
                    <CaretRightFilled rotate={ruleShowConfig[ruleField.key] ? 90 : 0} style={{ fontSize: 12 }} />
                    {`${intl.formatMessage({
                      id: 'processRuleSetting.liuchengguize',
                      defaultMessage: '流程规则',
                    })} ${ruleIndex + 1}`}

                    <div
                      className={styles['rule-delete']}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteRuleWrap(form.getFieldsValue().ruleEngineConfigFieldRelations[ruleIndex]?.id, () => {
                          const { ruleFieldKey } = getRuleAndFieldKey(
                            form.getFieldValue('ruleEngineConfigFieldRelations'),
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

                          const newIsQueryAll: any = {}
                          for (const key in cacheIsQueryAllRef.current) {
                            if (!key.includes(`RULE-${ruleFieldKey}`)) {
                              newIsQueryAll[key] = cacheIsQueryAllRef.current[key]
                            }
                          }
                          cacheIsQueryAllRef.current = newIsQueryAll

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
                  <Form.List name={[ruleField.name, 'ruleEngineConfigFields']}>
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
                                onClick={() => {
                                  // 移除掉字段的同时，需将对应的存储已选的物料或品类数据一并移除
                                  const { ruleFieldKey, fieldFieldKey, fieldFieldCode } = getRuleAndFieldKey(
                                    form.getFieldValue('ruleEngineConfigFieldRelations'),
                                    ruleField.key,
                                    ruleIndex,
                                    field.key,
                                    index,
                                  )
                                  onDrawerChange(getKey(fieldFieldCode, ruleFieldKey, fieldFieldKey), [], true)
                                  onQueryAllChange(getKey(fieldFieldCode, ruleFieldKey, fieldFieldKey), 0, true)
                                  fieldRemove(index)
                                }}
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
                                  <Col span={12}>
                                    <Form.Item name={[field.name, 'code']} fieldKey={[field.fieldKey, 'code']}>
                                      <CustomLastSelect
                                        options={fieldsTypeOption}
                                        onLastValueChange={(prevValue) => {
                                          // 字段类型改变时，通过此方法拿到上一次选择的字段，进而删除掉对应的缓存数据
                                          const ruleEngineConfigFields = form.getFieldValue(
                                            'ruleEngineConfigFieldRelations',
                                          )?.[ruleIndex]?.ruleEngineConfigFields?.[index]
                                          const fieldsTypeItem = getFieldsTypeItem(ruleEngineConfigFields?.code)
                                          if (fieldsTypeItem?.select_content) {
                                            const { ruleFieldKey, fieldFieldKey } = getRuleAndFieldKey(
                                              form.getFieldValue('ruleEngineConfigFieldRelations'),
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
                                  <Col span={12}>
                                    <Form.Item
                                      noStyle
                                      shouldUpdate={(prevValues, currentValues) => {
                                        return (
                                          prevValues.ruleEngineConfigFieldRelations?.[ruleIndex]
                                            ?.ruleEngineConfigFields?.[index]?.code !==
                                          currentValues.ruleEngineConfigFieldRelations?.[ruleIndex]
                                            ?.ruleEngineConfigFields?.[index]?.code
                                        )
                                      }}
                                    >
                                      {({ getFieldValue }) => {
                                        // 根据字段类型展示对应的条件下拉框
                                        const type = getFieldValue('ruleEngineConfigFieldRelations')?.[ruleIndex]
                                          ?.ruleEngineConfigFields?.[index]?.type
                                        return (
                                          <Form.Item
                                            name={[field.name, 'condition']}
                                            fieldKey={[field.fieldKey, 'condition']}
                                          >
                                            <Select options={conditionOptions[type]} />
                                          </Form.Item>
                                        )
                                      }}
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Form.Item noStyle shouldUpdate={true}>
                                  {/* <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => {
                                  return prevValues.ruleEngineConfigFieldRelations?.[ruleIndex]?.ruleEngineConfigFields?.[index]?.type !== currentValues.ruleEngineConfigFieldRelations?.[ruleIndex]?.ruleEngineConfigFields?.[index]?.type
                                }}> */}
                                  {({ getFieldValue, setFieldsValue }) => {
                                    const ruleEngineConfigFields = getFieldValue('ruleEngineConfigFieldRelations')?.[
                                      ruleIndex
                                    ]?.ruleEngineConfigFields?.[index]
                                    const fieldsTypeItem = getFieldsTypeItem(ruleEngineConfigFields?.code)
                                    const condition = ruleEngineConfigFields?.condition
                                    const { ruleFieldKey, fieldFieldKey } = getRuleAndFieldKey(
                                      getFieldValue('ruleEngineConfigFieldRelations'),
                                      ruleField.key,
                                      ruleIndex,
                                      field.key,
                                      index,
                                    )
                                    const inputDisabled =
                                      fieldsTypeItem?.select_content === Select_Content_Type.SelectMaterial &&
                                      getIsQueryAll(ruleEngineConfigFields?.code, ruleFieldKey, fieldFieldKey)
                                    const fetchTableExtensionApi: any = {}
                                    if (islifeCycle && fieldsTypeItem?.select_content == 9) {
                                      fetchTableExtensionApi.fetchTableApi = getMemberManageCustomerList
                                    }
                                    return (
                                      <Form.Item name={[field.name, 'value']} fieldKey={[field.fieldKey, 'value']}>
                                        {fieldsTypeItem?.type === Fields_Type.NUMBER ? ( // 字段类型为数字
                                          <Input
                                            type="number"
                                            placeholder={intl.formatMessage({
                                              id: 'common.form.input.placeholder',
                                              defaultMessage: '请输入',
                                            })}
                                          />
                                        ) : fieldsTypeItem?.type === Fields_Type.DATE ? ( // 字段类型为日期
                                          <StringDatePicker
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
                                                    getKey(ruleEngineConfigFields?.code, ruleFieldKey, fieldFieldKey),
                                                    value,
                                                  )
                                                }}
                                                fieldCode={fieldsTypeItem?.code_alias}
                                                fieldLabel={fieldsTypeItem?.name}
                                                selectCache={getSelectCache(
                                                  ruleEngineConfigFields?.code,
                                                  ruleFieldKey,
                                                  fieldFieldKey,
                                                )}
                                                isAll={ruleEngineConfigFields?.isQueryAll === 1}
                                                disabled={getIsQueryAll(
                                                  ruleEngineConfigFields?.code,
                                                  ruleFieldKey,
                                                  fieldFieldKey,
                                                )}
                                                isSomeQueryAll={getIsQueryAll(
                                                  ruleEngineConfigFields?.code,
                                                  ruleFieldKey,
                                                  fieldFieldKey,
                                                )}
                                                onQueryAll={(value) => {
                                                  const ruleEngineConfigData = getFieldValue(
                                                    'ruleEngineConfigFieldRelations',
                                                  )
                                                  ruleEngineConfigData[ruleIndex].ruleEngineConfigFields[
                                                    index
                                                  ].isQueryAll = value ? 1 : 0
                                                  setFieldsValue({
                                                    ruleEngineConfigFieldRelations: ruleEngineConfigData,
                                                  })
                                                  onQueryAllChange(
                                                    getKey(ruleEngineConfigFields?.code, ruleFieldKey, fieldFieldKey),
                                                    value ? 1 : 0,
                                                  )
                                                }}
                                                {...fetchTableExtensionApi}
                                              />
                                            ) : // 树结构的弹窗（目前有品类）
                                            TREE_SELECT_TYPE.includes(fieldsTypeItem?.select_content) ? (
                                              <CommonTreeSelect
                                                fetchParams={drawerFetchParams}
                                                selectType={fieldsTypeItem?.select_content}
                                                onValueChange={(value) => {
                                                  onDrawerChange(
                                                    getKey(ruleEngineConfigFields?.code, ruleFieldKey, fieldFieldKey),
                                                    value,
                                                  )
                                                }}
                                                fieldCode={fieldsTypeItem?.code_alias}
                                                selectCache={getSelectCache(
                                                  ruleEngineConfigFields?.code,
                                                  ruleFieldKey,
                                                  fieldFieldKey,
                                                )}
                                              />
                                            ) : // 多选框结构的弹窗（目前有来源商城/请款类型）
                                            CHECKBOX_SELECT_TYPE.includes(fieldsTypeItem?.select_content) ? (
                                              <CommonCheckboxSelect
                                                fetchParams={drawerFetchParams}
                                                selectType={fieldsTypeItem?.select_content}
                                                onValueChange={(value) => {
                                                  onDrawerChange(
                                                    getKey(ruleEngineConfigFields?.code, ruleFieldKey, fieldFieldKey),
                                                    value,
                                                  )
                                                }}
                                                fieldCode={fieldsTypeItem?.code_alias}
                                                selectCache={getSelectCache(
                                                  ruleEngineConfigFields?.code,
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
                                                  ruleEngineConfigFields?.code,
                                                  ruleFieldKey,
                                                  fieldFieldKey,
                                                )}
                                                ruleFieldCode={ruleEngineConfigFields?.code}
                                                ruleFieldKey={ruleFieldKey}
                                                fieldFieldKey={fieldFieldKey}
                                                labelKey={'label'}
                                              />
                                            ) : null
                                          ) : (
                                            // 非 是/不是 类条件的话显示输入框
                                            <Input
                                              maxLength={200}
                                              disabled={inputDisabled}
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
                              </ConfigFieldCard>
                            </div>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => {
                                fieldAdd({
                                  type: fieldsTypeOption[0]?.type,
                                  code: fieldsTypeOption[0]?.code,
                                  isQueryAll: 0,
                                  condition: conditionOptions[fieldsTypeOption[0]?.type][0].value,
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
                      <Radio.Group className="use-radio-button">
                        {interrelationOptions.map((_item) => (
                          <Radio key={_item.value} value={_item.value}>
                            {_item.label}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  </ConfigFieldCard>
                  <ConfigFieldCard
                    title={intl.formatMessage({
                      id: 'processRuleSetting.chulijuese',
                      defaultMessage: '处理角色',
                    })}
                  >
                    <Form.Item
                      name={[ruleField.name, 'handleMemberRoleId']}
                      fieldKey={[ruleField.fieldKey, 'handleMemberRoleId']}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'processRuleSetting.qingxuanzechulijuese',
                            defaultMessage: '请选择处理角色',
                          }),
                        },
                      ]}
                    >
                      <SelectRoles
                        options={rolesOptions}
                        onValueChange={(value) =>
                          onRoleChange(
                            getRuleAndFieldKey(
                              form.getFieldValue('ruleEngineConfigFieldRelations'),
                              ruleField.key,
                              ruleIndex,
                            )?.ruleFieldKey,
                            value,
                          )
                        }
                      />
                    </Form.Item>
                  </ConfigFieldCard>
                </div>
              ))}
              {
                // 限制3个流程规则
                ruleFields.length < 3 && (
                  <div className={styles.add}>
                    <Form.Item>
                      <Button
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
    </Form>
  )
}

export default memo(forwardRef(ProcessRules))
