import React, { useCallback, useEffect, useRef, useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, message, Spin } from 'antd'
import { FormDetailContext } from '@/formSchema/context'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import FormDetailHeader from '@/components/FormDetailHeader'
import { Radio, Checkbox, ArrayTable } from '@apps/formily'
import StatusTag from '@/components/StatusTag'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { addSchema } from './schema'
import styles from './index.less'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import {
  getMemberSupplierAbilitySubGet,
  getMemberSupplierAbilitySubPageitemsBasic,
  getMemberSupplierAbilitySubPageitemsDetail,
  getMemberSupplierAbilitySubPageitemsLevel,
  getMemberSupplierAbilitySubPageitemsRole,
  getMemberMainpageDetailGet,
  postMemberSupplierAbilitySubAdd,
  postMemberSupplierAbilitySubUpdate,
  postMemberMainpageDetailUpdate,
} from '@apps/apis'
import NiceForm from '@/components/NiceForm'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import AreaSelect from '../components/AreaSelect'
import { authService, useTelCode } from '@apps/services'
import { convertFilesToNamesArr } from '../utils'
import { encryptedByAES } from '@linkseeks/crypto'
import defaultHomePath from '@/utils/defaultHomePath'
import { MEMBER_INNER_COLUMNS, MEMBER_OUTER_COLUMNS, MEMBER_OUTER_STATUS_TYPE } from '../constant'
import AuditProcess from '@/components/AuditProcess'
import FlowRecords from '@/components/FlowRecords'
import { getTelCodeOptions } from '@apps/services'

const formActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInputChange$ } = FormEffectHooks

type MemberInfoType = {
  memberType: number
  roleId: number
  level: number
  telCode: number
  phone: string | number
  email: string
  upperRelationId?: number
  channelLevel?: string
  areas?: {
    /**
     * 省编码
     */
    provinceCode: string
    /**
     * 市编码
     */
    cityCode: string
  }[]
  remark?: string
} & { [key: string]: any }

/** 页面操作类型 */
export enum OperateType {
  add = 'add',
  edit = 'edit',
  detail = 'detail',
  myself = 'myself',
}

interface SupplierFormProps {
  validateId: number
  id: number
  type: OperateType
  title: string
}

const SupplierForm: React.FC<SupplierFormProps> = (props) => {
  const intl = useIntl()
  const { validateId, id, type, title } = props
  const { formContext } = useFormDetail()
  const [memberItems, setMemberItems] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [memberInfo, setMemberInfo] = useState<MemberInfoType>()
  const [unsaved, setUnsaved] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()
  const { getTelPattern } = useTelCode()
  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  const getDetailedInfo = async () => {
    let infoRes: {
      code: number
      data: MemberInfoType
    } | null = null
    setInfoLoading(true)
    if (type === OperateType.myself && !id && !validateId) {
      infoRes = await getMemberMainpageDetailGet()
    }
    if (id && validateId) {
      infoRes = await getMemberSupplierAbilitySubGet({
        memberId: `${id}`,
        validateId: `${validateId}`,
      })
    }
    if (infoRes?.code !== 1000) {
      setInfoLoading(false)
      return
    }
    const {
      memberTypeEnum,
      groups = [],
      areaCodes,
      upperMemberId,
      channelLevelTag,
      countryCode,
      currentStep,
      levelId,
      levelTag,
      memberTypeName,
      name,
      outerHistory,
      innerHistory,
      roleName,
      verifySteps,
      level,
      outerStatus,
      outerStatusName,
      ...rest
    } = infoRes.data

    if (type === OperateType.detail) {
      formActions.setFieldState('*(outerStatusName,level,outerStatusName,auditData,flowData)', (state) => {
        if (state.name === 'level') {
          if (!level || !levelTag) {
            state.visible = false
          }
        }
        if (state.name === 'outerStatusName') {
          state['props']['x-component-props'] = {
            type: MEMBER_OUTER_STATUS_TYPE[outerStatus],
            title: outerStatusName,
            className: 'statusTag',
          }
        }
        if (state.name === 'auditData') {
          state['props']['x-component-props'] = {
            initRadioValue: 'outer',
            outerVerifySteps: verifySteps,
            outerVerifyCurrent: verifySteps?.findIndex((item) => item.step === currentStep),
          }
        }
        if (state.name === 'flowData') {
          state['props']['x-component-props'] = {
            outerColumns: MEMBER_OUTER_COLUMNS,
            innerColumns: MEMBER_INNER_COLUMNS,
            outerRowkey: 'id',
            innerRowkey: 'id',
            outerDataSource: outerHistory,
            innerDataSource: innerHistory,
          }
        }
      })
    }

    // 注册资料处理
    const detail = {}
    for (let i = 0; i < groups.length; i++) {
      const item = groups[i]

      if (item.elements) {
        for (let j = 0; j < item.elements.length; j++) {
          const ele = item.elements[j]
          if (ele.fieldType !== 'list') {
            detail[ele.fieldName] = ele.fieldValue
          }
          if (ele.fieldType === 'list') {
            detail[ele.fieldName] = ele.registers?.map((element) => {
              let obj = {}
              element.forEach((val) => {
                obj[val.fieldName] = val.fieldValue
              })
              return obj
            })
          }
        }
      }
    }

    // 编辑的时候判断获取等级下拉数据
    if (type === OperateType.edit) {
      if (infoRes.data.memberType && infoRes.data.roleId) {
        getMemberSupplierAbilitySubPageitemsLevel(
          {
            memberType: infoRes.data.memberType,
            roleId: infoRes.data.roleId,
          } as any,
          {
            useCache: true,
          },
        )
          .then((res) => {
            if (res.code === 1000) {
              const { data = [] } = res
              const options = data
                .map((item) => ({ label: item.levelTag, value: item.level }))
                .filter((item) => item.value)
              formActions.setFieldState('level', (state) => {
                FormPath.setIn(state, 'props.enum', options)
              })
            }
          })
          .catch((err) => {
            console.warn(err)
          })
      }
    }

    setMemberInfo({
      ...rest,
      memberType: memberTypeEnum,
      areas: areaCodes,
      channelLevel: channelLevelTag,
      upperRelationId: upperMemberId,
      level: type === OperateType.detail ? levelTag : level || undefined,
      ...detail,
    })

    setInfoLoading(false)
  }

  useEffect(() => {
    getDetailedInfo()
  }, [])

  const providerValue = {
    schemaActions: formActions,
    formContext,
  }

  const handleSubmit = (values: any) => {
    const {
      memberType,
      roleId,
      level,
      levelId,
      telCode,
      phone,
      email,
      channelLevel,
      channelTypeId,
      areas = [],
      remark,
      upperRelationId,
      password,
      outerStatus,
      status,
      statusName,
      ...rest
    } = values
    const registerNames = convertFilesToNamesArr(memberItems)
    const registerDetails: Record<string, any> = {}

    // 由于注册资料是schema是动态的
    // 当选择完一个角色，并且编辑了动态生成的字段
    // 此时 form 是已经收集到值了
    // 这个是否如果切换角色并生成不同的注册资料，最终提交上个角色生成并编辑过的注册资料并没有移除
    // 所以这里再做一层判断
    for (const key in rest) {
      if (Object.prototype.hasOwnProperty.call(rest, key) && registerNames.includes(key)) {
        const value = rest[key]
        registerDetails[key] = value
      }
    }

    const filtered = areas.filter((item) => item.provinceCode || item.cityCode)

    const payload = {
      memberType,
      roleId,
      level,
      telCode,
      phone: encryptedByAES(phone),
      email: email ? encryptedByAES(email, false) : '',
      channelTypeId,
      areas: filtered,
      remark,
      password: encryptedByAES(password),
      upperRelationId: upperRelationId || 0,
      detail: registerDetails,
    }

    if (Object.keys(payload.detail).length === 0) {
      const temp = {}
      if (memberItems && memberItems.length > 0) {
        for (const memberItem of memberItems) {
          for (const element of memberItem.elements) {
            temp[element.fieldName] = ''
          }
        }
      }
      payload.detail = temp
    }

    // 编辑自己信息
    if (type === OperateType.myself) {
      setSubmitLoading(true)
      const msg = message.loading({
        content: intl.formatMessage({ id: 'member.management.import.query.form.saving' }),
        duration: 0,
      })
      postMemberMainpageDetailUpdate({
        email,
        detail: rest,
      })
        .then(({ code }) => {
          if (code !== 1000) {
            return
          }
          const auth = authService.getAuth()
          authService.setAuth({
            ...auth,
            company: rest.company_name,
            validateMsg: null,
            validateStatus: 1,
            validateStatusDesc: intl.formatMessage({ id: 'member.status.notAaudit' }), // 待审核
          } as any)
          setUnsaved(false)
          setTimeout(() => {
            history.push(defaultHomePath())
          }, 800)
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
      return
    }

    if (!id && type === OperateType.add) {
      setSubmitLoading(true)
      const msg = message.loading({
        content: intl.formatMessage({ id: 'member.management.import.query.form.creating' }),
        duration: 0,
      })
      postMemberSupplierAbilitySubAdd(payload, {
        timeout: 0,
      })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 800)
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
      return
    }
    if (id && validateId && type === OperateType.edit) {
      setSubmitLoading(true)
      const msg = message.loading({
        content: intl.formatMessage({ id: 'member.management.import.query.form.saving' }),
        duration: 0,
      })
      postMemberSupplierAbilitySubUpdate(
        {
          ...payload,
          memberId: id,
          validateId,
        },
        {
          timeout: 0,
        },
      )
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)
          setTimeout(() => {
            history.goBack()
          }, 800)
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
      return
    }
  }

  const updateMemberCustomDetail = (roleId: string) => {
    try {
      if (!roleId) {
        setMemberItems([])
        return
      }
      timerRef.current = setTimeout(async () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = undefined
        }
        const res = await getMemberSupplierAbilitySubPageitemsDetail({ roleId })
        if (res.code === 1000) {
          const { data = [] } = res
          setMemberItems(data)
        }
      }, 200)
    } catch (error) {
      console.warn(error)
    }
  }

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()

    // 根据国家区号调整交易手机号
    onFieldValueChange$('telCode').subscribe((fieldState) => {
      const current = fieldState.props.enum?.find((_item) => _item.value === fieldState.value)
      if (current) {
        formActions.setFieldState('phone', (state) => {
          state.props['x-rules'] = [
            {
              required: true,
              message: intl.formatMessage({
                id: 'member.management.import.query.form.basic.phone.placeholder',
              }),
            },
            {
              pattern: getTelPattern(fieldState.value, fieldState.props.enum),
              message: intl.formatMessage({
                id: 'member.management.import.query.form.basic.phone.rules-fact',
              }),
            },
          ]
        })
      }
    })

    // 手动触发改变的话重置等级下拉框
    onFieldInputChange$('roleId').subscribe(() => {
      linkage.value('level', undefined)
      linkage.enum('level', [])
    })

    // 根据会员类型和角色，查询等级下拉
    onFieldValueChange$('roleId').subscribe((fieldState) => {
      const memberType = fieldState?.values[1]?.memberType

      setTimeout(async () => {
        // 根据会员角色，查询其他注册资料
        updateMemberCustomDetail(fieldState.value)

        if (fieldState.value && memberType) {
          formActions.setFieldValue('memberType', memberType)
          formActions.setFieldValue('level', undefined)
          linkage.loading('level')

          getMemberSupplierAbilitySubPageitemsLevel(
            {
              memberType,
              roleId: fieldState.value,
            },
            {
              useCache: true,
            },
          )
            .then((res) => {
              if (res.code === 1000) {
                const { data = [] } = res
                const options = data
                  .map((item) => ({ label: item.levelTag, value: item.level }))
                  .filter((item) => item.value)
                formActions.setFieldState('level', (state) => {
                  state.props.enum = options
                })
              }
            })
            .catch((err) => {
              console.warn(err)
            })
            .finally(() => {
              linkage.loaded('level')
            })
        }
      }, 0)
    })

    // 渠道上级改变时，请求出对应的省级数据
    onFieldInputChange$('upperRelationId').subscribe((fieldState) => {
      // 清空渠道原来数据
      linkage.value('areas', [])
    })

    // 省级改变时，，请求出对应的市级数据
    onFieldInputChange$('areas.*.provinceCode').subscribe((fieldState) => {
      formActions.setFieldState(
        FormPath.transform(fieldState.name, /\d/, ($1) => `areas.${$1}.cityCode`),
        (state) => {
          FormPath.setIn(state, 'value', undefined)
        },
      )
    })

    // 省级改变时，，请求出对应的市级数据
    // onFieldValueChange$('areas.*.provinceCode').subscribe((fieldState) => {
    //   if (fieldState.value === undefined) {
    //     return
    //   }
    //   const upperRelationValue = formActions.getFieldValue('upperRelationId')

    //   formActions.setFieldState(
    //     FormPath.transform(fieldState.name, /\d/, ($1) => `areas.${$1}.cityCode`),
    //     (state) => {
    //       FormPath.setIn(state, 'props.x-props.hasFeedback', true)
    //       FormPath.setIn(state, 'loading', true)
    //     },
    //   )

    //   getMemberSupplierAbilitySubPageitemsCity({
    //     upperRelationId: upperRelationValue,
    //     provinceCode: fieldState.value,
    //   })
    //     .then((res) => {
    //       if (res.code === 1000) {
    //         const { data = [] } = res
    //         const options = data.map((item) => ({ label: item.name, value: item.code }))
    //         formActions.setFieldState(
    //           FormPath.transform(fieldState.name, /\d/, ($1) => `areas.${$1}.cityCode`),
    //           (state) => {
    //             FormPath.setIn(state, 'props.enum', options)
    //           },
    //         )
    //       }
    //     })
    //     .catch((err) => {
    //       console.warn(err)
    //     })
    //     .finally(() => {
    //       formActions.setFieldState(
    //         FormPath.transform(fieldState.name, /\d/, ($1) => `areas.${$1}.cityCode`),
    //         (state) => {
    //           FormPath.setIn(state, 'loading', false)
    //         },
    //       )
    //     })
    // })
  }

  const getPageitemscountryRoles = async () => {
    const res = await getMemberSupplierAbilitySubPageitemsRole()

    if (res.code === 1000) {
      const roleList = res?.data || []
      return {
        roleId: roleList.map((item) => ({ label: item.roleName, value: item.roleId, memberType: item.memberType })),
      }
    }
    return {
      roleId: [],
    }
  }

  // 会员角色、注册手机下拉框
  const getPageitemscountryCodes = async () => {
    const res = await getMemberSupplierAbilitySubPageitemsBasic()
    if (res.code === 1000) {
      const { data = {} }: any = res
      const { countryCodes = [] } = data
      return {
        telCode: countryCodes.map((item) => ({ label: item.text, value: item.id })),
      }
    }
    return {}
  }

  const getMemberItemsScheme = useCallback(() => {
    return addSchema(memberItems, type)
  }, [memberItems])

  return (
    <Spin spinning={infoLoading} className={styles['mian']}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={title}
          schema={getMemberItemsScheme()}
          showProcess={type !== OperateType.detail}
          extraRight={
            type !== OperateType.detail
              ? [
                  <Button
                    key="1"
                    onClick={() => formActions.submit()}
                    loading={submitLoading}
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    {intl.formatMessage({
                      id: 'common.button.save',
                      defaultMessage: '保存',
                    })}
                  </Button>,
                ]
              : []
          }
        />
        <FormDetailWrapper>
          <div className={styles.restContainer}>
            <NiceForm
              previewPlaceholder=" "
              initialValues={memberInfo || {}}
              actions={formActions}
              schema={getMemberItemsScheme()}
              onSubmit={handleSubmit}
              components={{
                RadioGroup: Radio.Group,
                CheckboxGroup: Checkbox.Group,
                AreaSelect,
                ArrayTable,
                StatusTag,
                AuditProcess,
                FlowRecords,
              }}
              editable={type !== OperateType.detail}
              effects={($, ctx) => {
                formContext.useAttachmentChangeForContext(ctx)

                useAsyncInitSelect(['telCode'], async () => ({
                  telCode: await getTelCodeOptions(),
                }))

                useAsyncInitSelect(['roleId'], getPageitemscountryRoles)

                useBusinessEffects()
                // 注入锚点标题数量同步
                // formContext.useAnchorCountChangeForContext(ctx, ['rows'])
                onFormInputChange$().subscribe(() => {
                  if (!unsaved) {
                    setUnsaved(true)
                  }
                })
              }}
              expressionScope={{}}
            />
          </div>
        </FormDetailWrapper>
      </FormDetailContext.Provider>
    </Spin>
  )
}

export default SupplierForm
