/*
 * @Description: 填写申请入库资料 (原申请供应商)
 */
import React, { useState, useEffect, useRef } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Spin, Space, message } from 'antd'
import { ArrayTable, Checkbox, DatePicker, Radio } from '@apps/formily'
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions, FormEffectHooks, createEffectHook } from '@apps/formily'
import { FormStep } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import MellowCard from '@/components/MellowCard'
import NoData from '@/components/NoData'
import {
  getMemberCustomerAbilityInfoApplyDepositDetail,
  getMemberCustomerAbilityInfoDepositDetail,
  postMemberCustomerAbilityInfoApply,
  postMemberCustomerAbilityInfoDepositDetailUpdate,
} from '@apps/apis'
import { getManageMemberNoticeFindByColumnTypeMemberInfo } from '@apps/apis'
import { normalizeFiledata, FileData } from '@/utils'
import schema, { GroupItem } from './schema'
import { useBusinessEffects } from '../../components/QualitiesUploadFormItem/effects'
import ComingAgreement from './components/ComingAgreement'
import RegisterInfo from './components/RegisterInfo'
import SubmitSuccess from './components/SubmitSuccess'
import QualitiesUpload from '../../components/QualitiesUpload'
import QualitiesUploadFormItem from '../../components/QualitiesUploadFormItem'
import AreaSelect from '../../components/AreaSelect'

type ValueType = {
  step3: { [key: string]: any }
  step4: {
    /**
     * 资质文件
     */
    qualities: {
      /**
       * 到期时间
       */
      expireDay: string
      /**
       * 是否长期有限
       */
      permanent: number[]
      /**
       * 文件
       */
      file: {
        /**
         * 文件名
         */
        name: string
        /**
         * 路径
         */
        url: string
        /**
         * 状态
         */
        status: string
      }
    }[]
  }
}

interface MemberInfo {
  step4: {
    qualities: {
      file: FileData[]
      expireDay: string
      permanent: number[]
    }[]
  }
}

let countDownLen = 10

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks
const onStepNext$ = createEffectHook('onStepNext')
const onStepPrevious$ = createEffectHook('onStepPrevious')

const MemberQueryApplyMember: React.FC<{}> = (props: any) => {
  const { upperMemberId, upperRoleId, validateId } = usePageStatus()
  const [ticktack, setTicktack] = useState(countDownLen)
  const [currenStep, setCurrenStep] = useState(!validateId ? 0 : 2)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  const [depositInfo, setDepositInfo] = useState<GroupItem[]>([])
  const [loading, setLoading] = useState(false)
  const [agreement, setAgreement] = useState('')
  const [agreementLoading, setAgreementLoading] = useState(false)
  const [memberInfo, setMemberInfo] = useState<MemberInfo>()

  const stepRef = useRef(!validateId ? 0 : 2)

  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  // eslint-disable-next-line no-undef
  let timer: NodeJS.Timeout | null = null

  const countDown = () => {
    timer = setInterval(() => {
      countDownLen -= 1
      if (countDownLen < 0) {
        clearTimeout(timer)
        return
      }
      setTicktack(countDownLen)
    }, 1000)
  }

  // 新增操作
  // 根据上级会员id 角色id 获取入库资料相关
  const getDepositInfo = async () => {
    if (!upperMemberId || !upperRoleId || validateId) {
      return
    }
    setLoading(true)
    const res = await getMemberCustomerAbilityInfoApplyDepositDetail({
      upperMemberId: `${upperMemberId}`,
      upperRoleId: `${upperRoleId}`,
    })
    if (res.code === 1000) {
      setDepositInfo(res.data.depositDetails)
      if (!res.data.depositDetails || !res.data.depositDetails.length) {
        formActions.setFieldState('step3.NO_DEPOSIT', (state) => {
          state.visible = true
        })
      }
    }
    setLoading(false)
  }

  // 变更、修改操作
  // 根据审核id 获取入库资料
  const getDepositInfoByValidateId = async () => {
    if (!validateId) {
      return
    }
    setLoading(true)
    const res = await getMemberCustomerAbilityInfoDepositDetail({
      validateId: `${validateId}`,
    })
    if (res.code === 1000) {
      const qualities = res.data.qualities || []
      setDepositInfo(res.data.groups)
      setMemberInfo({
        step4: {
          qualities: qualities.map((item) => ({
            file: item.url ? [normalizeFiledata(item.url)] : [],
            expireDay: item.expireDay,
            permanent: item.permanent === 1 ? [item.permanent] : [],
          })),
        },
      })
      if (!res.data.groups || !res.data.groups.length) {
        formActions.setFieldState('step3.NO_DEPOSIT', (state) => {
          state.visible = true
        })
      }
    }
    setLoading(false)
  }

  // 获取入库协议
  const getDepositAgreement = async () => {
    if (validateId) {
      return
    }
    setAgreementLoading(true)
    const res = await getManageMemberNoticeFindByColumnTypeMemberInfo({
      columnType: `${3}`,
      memberId: `${upperMemberId}`,
      roleId: `${upperRoleId}`,
    })
    if (res.code === 1000) {
      setAgreement(res.data && res.data.length ? res.data[0].content : '')
    }
    setAgreementLoading(false)
    countDown()
  }

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  useEffect(() => {
    getDepositInfo()
    getDepositInfoByValidateId()
    getDepositAgreement()
  }, [])

  const handleSubmit = (values: ValueType) => {
    const step3 = values.step3 || {}
    // 没有触发 step4 下的表单元素改变的话，step4 为 undefined
    const { qualities = [] } = values.step4 || {}
    setSubmitLoading(true)
    const msg = message.loading({
      content: intl.formatMessage({
        id: 'customerAbility.invitationInfo.inventoryData.save.message',
        defaultMessage: '正在保存，请稍候...',
      }),
      duration: 0,
    })

    const commonPayload = {
      qualities: qualities.map((item) => ({
        expireDay: item.expireDay || '',
        permanent: (item.permanent && item.permanent[0]) || 0,
        url: item.file && item.file[0] ? item.file[0].url : '',
        name: item.file && item.file[0] ? item.file[0].name : '',
      })),
    }

    if (!validateId) {
      if (!upperMemberId || !upperRoleId) {
        return
      }
      postMemberCustomerAbilityInfoApply({
        upperMemberId: upperMemberId as number,
        upperRoleId: upperRoleId as number,
        depositDetails: step3,
        ...commonPayload,
      })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)
          formActions.dispatch('onStepNext', {})
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
    } else {
      postMemberCustomerAbilityInfoDepositDetailUpdate({
        validateId: validateId as number,
        detail: step3,
        ...commonPayload,
      })
        .then((res) => {
          if (res.code !== 1000) {
            return
          }
          setUnsaved(false)
          formActions.dispatch('onStepNext', {})
        })
        .finally(() => {
          msg()
          setSubmitLoading(false)
        })
    }
  }

  return (
    <Spin spinning={loading || agreementLoading}>
      <PageHeaderWrapper
        title={`${
          !validateId
            ? intl.formatMessage({
                id: 'customerAbility.invitationInfo.inventoryData.invitation.message',
                defaultMessage: '我收到的邀请信息',
              })
            : intl.formatMessage({
                id: 'customerAbility.customerAbilityQuery.applycustomerAbility.change',
                defaultMessage: '变更客户',
              })
        }`}
        extra={
          <Space>
            {currenStep === 0 && !validateId ? (
              <Button
                type="primary"
                disabled={ticktack > 0}
                onClick={() => {
                  formActions.dispatch('onStepNext', {})
                }}
              >
                {`${intl.formatMessage({
                  id: 'customerAbility.invitationInfo.inventoryData.agress',
                  defaultMessage: '同意用户协议',
                })} ${ticktack > 0 ? '(' + ticktack + 's)' : ''}`}
              </Button>
            ) : null}
            {currenStep === 1 ? (
              <>
                {!validateId && (
                  <Button
                    onClick={() => {
                      formActions.dispatch('onStepPrevious', {})
                    }}
                  >
                    {intl.formatMessage({
                      id: 'customerAbility.invitationInfo.inventoryData.step1.prev',
                      defaultMessage: '上一步：客户入库协议',
                    })}
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={() => {
                    formActions.dispatch('onStepNext', {})
                  }}
                >
                  {intl.formatMessage({
                    id: 'customerAbility.invitationInfo.inventoryData.step1.next',
                    defaultMessage: '下一步：填写入库信息',
                  })}
                </Button>
              </>
            ) : null}
            {currenStep === 2 ? (
              <>
                {/* <Button
                  onClick={() => {}}
                >
                  保存为草稿
                </Button> */}
                {!validateId && (
                  <Button
                    onClick={() => {
                      formActions.dispatch('onStepPrevious', {})
                    }}
                  >
                    {intl.formatMessage({
                      id: 'customerAbility.invitationInfo.inventoryData.step2.prev',
                      defaultMessage: '上一步：确认注册信息',
                    })}
                  </Button>
                )}
                <Button
                  type="primary"
                  onClick={async () => {
                    await formActions.validate('step3.*')
                    formActions.dispatch('onStepNext', {})
                  }}
                >
                  {intl.formatMessage({
                    id: 'customerAbility.invitationInfo.inventoryData.step2.next',
                    defaultMessage: '下一步：上传资质证明',
                  })}
                </Button>
              </>
            ) : null}
            {currenStep === 3 ? (
              <>
                {/* <Button
                  onClick={() => {}}
                >
                  保存为草稿
                </Button> */}
                <Button
                  onClick={() => {
                    formActions.dispatch('onStepPrevious', {})
                  }}
                >
                  {intl.formatMessage({
                    id: 'customerAbility.invitationInfo.inventoryData.step3.prev',
                    defaultMessage: '上一步：填写入库信息',
                  })}
                </Button>
                <Button
                  type="primary"
                  loading={submitLoading}
                  onClick={() => {
                    formActions.submit()
                  }}
                >
                  {intl.formatMessage({
                    id: 'customerAbility.invitationInfo.inventoryData.step3.next',
                    defaultMessage: '确认提交',
                  })}
                </Button>
              </>
            ) : null}
          </Space>
        }
      >
        <MellowCard bodyStyle={{ padding: 0 }}>
          <NiceForm
            previewPlaceholder=" "
            onSubmit={handleSubmit}
            actions={formActions}
            initialValues={memberInfo}
            components={{
              Checkbox,
              CheckboxGroup: Checkbox.Group,
              DatePicker,
              RadioGroup: Radio.Group,
              AreaSelect,
              QualitiesUpload,
              QualitiesUploadFormItem,
              NoData,
              ArrayTable,
            }}
            expressionScope={{
              currenStep,
              ComingAgreement: <ComingAgreement richText={agreement} />,
              RegisterInfo: (
                <RegisterInfo upperMemberId={upperMemberId as number} upperRoleId={upperRoleId as number} />
              ),
              SubmitSuccess: <SubmitSuccess />,
            }}
            effects={($, actions) => {
              onStepNext$().subscribe(() => {
                stepRef.current += 1
                setCurrenStep(stepRef.current)
                formActions.dispatch(FormStep['ON_FORM_STEP_NEXT'], {})
              })
              onStepPrevious$().subscribe(() => {
                stepRef.current -= 1
                setCurrenStep(stepRef.current)
                formActions.dispatch(FormStep['ON_FORM_STEP_PREVIOUS'], {})
              })

              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })

              useBusinessEffects($, actions, 'step4.qualities')
            }}
            schema={schema(depositInfo, validateId as number)}
          />
        </MellowCard>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberQueryApplyMember
