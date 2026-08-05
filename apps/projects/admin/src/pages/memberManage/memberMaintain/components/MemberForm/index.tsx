/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-26 15:45:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-08 10:18:46
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { usePrompt } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
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
import { encryptedByAES } from '@linkseeks/crypto'
import {
  GetMemberAbilitySubGetResponse,
  getMemberMaintenanceAddpageitems,
  getMemberMaintenanceAddpageitemsDetail,
  getMemberMaintenanceAddpageitemsLevel,
  getMemberMaintenanceAddpageitemsRole,
  getMemberMaintenanceGetmember,
  postMemberMaintenanceAddmember,
  postMemberMaintenanceUpdatemember,
  getMemberMemberRoleConfigGetMemberRoleListByMemberType,
} from '@apps/apis'
import { initDetailSchema } from './schema'
import AreaSelect from '../../../components/AreaSelect'
import { getTelCodeOptions } from '@apps/services'

const formActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$, onFormInputChange$ } = FormEffectHooks

interface MemberFormProps {
  /**
   * 数据id
   */
  id?: string
  /**
   * 记录id
   */
  validateId?: string
  /**
   * 是否是编辑的
   */
  isEdit?: boolean
}

const MemberForm: React.FC<MemberFormProps> = ({ id, validateId, isEdit = false }) => {
  const [memberItems, setMemberItems] = useState<any>({})
  const [memberInfo, setMemberInfo] = useState<GetMemberAbilitySubGetResponse>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({ when: unsaved, message: '您还有未保存的内容，是否确定要离开？' })

  const getDetailedInfo = async () => {
    if (id && validateId) {
      setInfoLoading(true)
      const infoRes = await getMemberMaintenanceGetmember({
        memberId: id,
        validateId,
      })

      if (infoRes.code !== 1000) {
        return
      }
      const {
        memberTypeEnum,
        groups = [],

        account,
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
      }: any = infoRes.data
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

      setMemberInfo({
        memberType: memberTypeEnum,
        ...rest,
        ...detail,
        level: level || undefined,
      })

      setInfoLoading(false)
    }
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

      outerStatus,
      status,
      statusName,

      currentOuterStep,
      outerVerifySteps,
      validateId,
      ...rest
    } = values

    const payload = {
      memberType,
      roleId,
      level,
      telCode,
      phone: encryptedByAES(phone),
      email: email ? encryptedByAES(email, false) : '',
      detail: rest,
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

    if (!id) {
      if (isEdit) {
        return
      }
      setSubmitLoading(true)
      const msg = message.loading({
        content: '正在添加，请稍候...',
        duration: 0,
      })
      postMemberMaintenanceAddmember(payload, {
        timeout: 0,
      })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)
          setTimeout(() => {
            history.back()
          }, 800)
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
    } else {
      if (!isEdit) {
        return
      }
      setSubmitLoading(true)
      const msg = message.loading({
        content: '正在保存，请稍候...',
        duration: 0,
      })
      postMemberMaintenanceUpdatemember(
        {
          ...payload,
          memberId: +id,
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
            history.back()
          }, 800)
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
    }
  }

  // 会员类型、注册手机下拉框
  const getPageitemsBasic = async () => {
    const res = await getMemberMaintenanceAddpageitems()

    if (res.code === 1000) {
      const { data } = res
      const { memberTypes, countryCodes } = data

      return {
        memberType: memberTypes?.map((item) => ({
          label: item.memberTypeName,
          value: item.memberType,
        })),
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
      getMemberMemberRoleConfigGetMemberRoleListByMemberType({
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
    })

    // 根据会员角色，查询其他注册资料
    onFieldValueChange$('roleId').subscribe((fieldState) => {
      if (!fieldState.value) {
        return
      }
      getMemberMaintenanceAddpageitemsDetail({
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

          getMemberMaintenanceAddpageitemsLevel(
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
              message: '请输入你的手机号码',
            },
            {
              validator: (value) => {
                return value?.length > current.phoneLength ? `注册手机号超出${current.phoneLength}位数` : ''
              },
            },
          ]
        })
      }
    })

    // 订阅 telCode 选项初始化
    $('requestAsyncSelect').subscribe(({ name: names, payload }) => {
      const countryCodeIdValue = formActions.getFieldValue('telCode')
      if (names.includes('telCode') && payload.countryCodeId?.length && countryCodeIdValue) {
        formActions.setFieldValue('telCode', countryCodeIdValue)
      }
    })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={!id ? '新建会员' : '编辑会员'}
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<SaveOutlined />}
            loading={submitLoading}
            onClick={() => formActions.submit()}
          >
            保存
          </Button>,
        ]}
      >
        <Card>
          <NiceForm
            onSubmit={handleSubmit}
            actions={formActions}
            initialValues={memberInfo || {}}
            components={{
              RadioGroup: Radio.Group,
              CheckboxGroup: Checkbox.Group,
              AreaSelect,
              ArrayTable,
            }}
            effects={($, actions) => {
              useAsyncInitSelect(['memberType'], getPageitemsBasic)

              useAsyncInitSelect(['telCode'], async () => {
                return {
                  telCode: await getTelCodeOptions(),
                }
              })

              useBusinessEffects($)

              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={initDetailSchema(memberItems)}
          />
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberForm
