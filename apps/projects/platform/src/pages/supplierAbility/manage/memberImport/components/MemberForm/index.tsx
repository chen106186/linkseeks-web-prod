import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, Spin, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import {
  createFormActions,
  FormEffectHooks,
  FormPath,
  IFormExtendsEffectSelector,
  ISchemaFormActions,
  ISchemaFormAsyncActions,
} from '@apps/formily'
import { Radio, Checkbox, ArrayTable } from '@apps/formily'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { authService, getTelCodeOptions } from '@apps/services'
import defaultHomePath from '@/utils/defaultHomePath'
import PasswordInput from '@/pages/user/components/PasswordInput'
import { initDetailSchema } from './schema'
import { convertFilesToNamesArr } from '../../../../utils'
import AreaSelect from '../../../../components/AreaSelect'
import {
  getMemberSupplierAbilitySubGet,
  getMemberSupplierAbilitySubPageitemsBasic,
  // getMemberSupplierAbilitySubPageitemsChannel,
  // getMemberSupplierAbilitySubPageitemsCity,
  getMemberSupplierAbilitySubPageitemsDetail,
  getMemberSupplierAbilitySubPageitemsLevel,
  // getMemberSupplierAbilitySubPageitemsProvince,
  getMemberSupplierAbilitySubPageitemsRole,
  getMemberMainpageDetailGet,
  postMemberSupplierAbilitySubAdd,
  postMemberSupplierAbilitySubUpdate,
  postMemberMainpageDetailUpdate,
} from '@apps/apis'
import { encryptedByAES } from '@linkseeks/crypto'

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

interface MemberFormProps {
  /**
   * 数据id
   */
  id?: number
  /**
   * 数据审核id
   */
  validateId?: number
  /**
   * 是否是可编辑的
   */
  isEdit?: boolean
  /**
   * 当前模式 myself 表示自己修改自己的信息，一般用于会员注册时被拒绝之后
   */
  mode?: 'myself' | 'any'
}

const MemberForm: React.FC<MemberFormProps> = ({ id, validateId, mode, isEdit = false }) => {
  const [memberItems, setMemberItems] = useState<any>({})
  const [memberInfo, setMemberInfo] = useState<MemberInfoType>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)

  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  const getDetailedInfo = async () => {
    let infoRes: {
      code: number
      data: MemberInfoType
    } = null
    setInfoLoading(true)
    if (mode === 'myself' && !id && !validateId) {
      infoRes = await getMemberMainpageDetailGet()

      formActions.setFieldState('tabs.tab-1.MEGA_LAYOUT1.*(!email)', (state) => {
        state.editable = false
      })
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

      account,
      channelLevelTag,
      countryCode,
      createTime,
      currentStep,
      levelTag,
      memberId,
      memberTypeName,
      name,
      outerHistory,
      outerStatusName,
      roleName,
      verifySteps,
      level,
      ...rest
    } = infoRes.data
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

    formActions.setFieldState('tabs', (state) => {
      state.props['x-component-props'] = state.props['x-component-props'] || {}
      state.props['x-component-props'].hiddenKeys = !channelLevelTag ? ['tab-2'] : []
    })

    setMemberInfo({
      memberType: memberTypeEnum,
      ...rest,
      areas: areaCodes,
      channelLevel: channelLevelTag,
      upperRelationId: upperMemberId,
      level: level || undefined,
      ...detail,
    })

    setInfoLoading(false)
  }

  useEffect(() => {
    getDetailedInfo()
  }, [])

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

      outerStatus,
      status,
      statusName,
      password,
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
      upperRelationId: upperRelationId || 0,
      detail: registerDetails,
      password: encryptedByAES(password),
    }

    // 编辑自己信息
    if (mode === 'myself') {
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

    if (!id && isEdit) {
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
    if (id && validateId && isEdit) {
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

  // 会员类型、注册手机下拉框
  const getPageitemsBasic = async () => {
    const res = await getMemberSupplierAbilitySubPageitemsBasic()

    if (res.code === 1000) {
      const { data } = res
      const { memberTypes } = data

      return {
        memberType: memberTypes?.map((item) => ({ label: item.memberTypeName, value: item.memberType })),
      }
    }
    return {}
  }

  const useBusinessEffects = ($: IFormExtendsEffectSelector<any, ISchemaFormActions | ISchemaFormAsyncActions>) => {
    const linkage = useLinkageUtils()

    // 间接触发根据会员类型
    onFieldValueChange$('memberType').subscribe((fieldState) => {
      if (!fieldState.value) {
        return
      }
      // 查询角色下拉
      linkage.loading('roleId')
      getMemberSupplierAbilitySubPageitemsRole({
        memberType: fieldState.value,
      })
        .then((res) => {
          if (res.code === 1000) {
            const { data = [] } = res
            const options = data.map((item) => ({ label: item.roleName, value: item.roleId }))
            linkage.enum('roleId', options)
          }
        })
        .catch((err) => {
          console.warn(err)
        })
        .finally(() => {
          linkage.loaded('roleId')
        })
    })

    // 根据会员类型
    onFieldInputChange$('memberType').subscribe((fieldState) => {
      if (!fieldState.value) {
        return
      }

      linkage.value('roleId', undefined)
      linkage.enum('roleId', [])
      linkage.value('level', undefined)
      linkage.enum('level', [])

      // 清空渠道原来数据
      linkage.value('channelTypeId', undefined)
      linkage.value('areas', [])
      linkage.value('remark', '')
      linkage.value('upperRelationId', undefined)
    })

    // 根据会员角色，查询其他注册资料
    onFieldValueChange$('roleId').subscribe((fieldState) => {
      if (!fieldState.value) {
        setMemberItems([])
        return
      }
      getMemberSupplierAbilitySubPageitemsDetail({
        roleId: fieldState.value,
      })
        .then((res) => {
          if (res.code === 1000) {
            const { data = [] } = res
            setMemberItems(data)
          }
        })
        .catch((err) => {
          console.warn(err)
        })
    })

    // 手动触发改变的话重置等级下拉框
    onFieldInputChange$('*(memberType,roleId)').subscribe(() => {
      linkage.value('level', undefined)
      linkage.enum('level', [])
    })

    // 根据会员类型和角色，查询等级下拉
    onFieldValueChange$('*(memberType,roleId)').subscribe((fieldState) => {
      const selfName = fieldState.name
      const selfValue = fieldState.value
      const otherName = selfName == 'memberType' ? 'roleId' : 'memberType'

      setTimeout(() => {
        const otherValue = formActions.getFieldState(otherName, (state) => state.value)

        if (selfValue && otherValue) {
          linkage.loading('level')

          getMemberSupplierAbilitySubPageitemsLevel(
            {
              memberType: selfName == 'memberType' ? selfValue : otherValue,
              roleId: selfName == 'memberType' ? otherValue : selfValue,
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
                linkage.enum('level', options)
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

    // 国家区号改变，触发电话号码校验
    onFieldInputChange$('telCode').subscribe(() => {
      const phoneValue = formActions.getFieldValue('phone')
      if (phoneValue) {
        formActions.setFieldState('phone', (state) => {
          state.value = ''
        })
      }
    })

    // 国家区号改变，触发电话号码校验
    onFieldValueChange$('telCode').subscribe((fieldState) => {
      const current = fieldState.props.enum?.find((item) => item.value === fieldState.value)
      if (current && current.phoneLength) {
        formActions.setFieldState('phone', (state) => {
          state.rules = [
            {
              required: true,
              message: intl.formatMessage({ id: 'supplier.management.import.query.form.basic.phone.placeholder' }),
            },
            {
              validator: (value) => {
                return value?.length !== current.phoneLength
                  ? intl.formatMessage({
                      id: 'supplier.management.import.query.form.basic.phone.max',
                      len: current.phoneLength,
                    })
                  : ''
              },
            },
          ]
        })
      }
    })

    // 订阅 telCode 选项初始化
    $('requestAsyncSelect').subscribe(({ name: names, payload }) => {
      const telCodeValue = formActions.getFieldValue('telCode')
      if (names.includes('telCode') && payload.telCode?.length && telCodeValue) {
        formActions.setFieldValue('telCode', telCodeValue)
      }
    })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={
          !id && mode === 'any'
            ? intl.formatMessage({ id: 'supplier.management.import.query.form.create' })
            : intl.formatMessage({ id: 'supplier.management.import.query.form.edit' })
        }
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<SaveOutlined />}
            loading={submitLoading}
            onClick={() => formActions.submit()}
          >
            {intl.formatMessage({ id: 'common.button.save' })}
          </Button>,
        ]}
      >
        <Card>
          <NiceForm
            previewPlaceholder=" "
            onSubmit={handleSubmit}
            actions={formActions}
            initialValues={memberInfo || {}}
            components={{
              RadioGroup: Radio.Group,
              CheckboxGroup: Checkbox.Group,
              AreaSelect,
              ArrayTable,
              PasswordInput,
            }}
            effects={($, actions) => {
              useAsyncInitSelect(['memberType'], getPageitemsBasic)

              useAsyncInitSelect(['telCode'], async () => ({
                telCode: await getTelCodeOptions(),
              }))

              useBusinessEffects($)

              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={initDetailSchema(memberItems)}
            editable={isEdit}
          />
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}

MemberForm.defaultProps = {
  id: 0,
  validateId: 0,
  isEdit: false,
  mode: 'any',
}

export default MemberForm
