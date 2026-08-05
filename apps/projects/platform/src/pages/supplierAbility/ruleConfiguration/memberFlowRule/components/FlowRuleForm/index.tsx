/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 16:13:05
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 17:12:53
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, Spin, Tooltip, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { Checkbox } from '@apps/formily'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import {
  getMemberSupplierProcessRuleGet,
  GetMemberProcessRuleGetResponse,
  postMemberSupplierProcessRuleAdd,
  postMemberSupplierProcessRuleUpdate,
} from '@apps/apis'
import formSchema from './schema'
import { createEffects } from './effects'
import MemberRoleFormItem from './components/MemberRoleFormItem'
import FlowListFormItem from './components/FlowListFormItem'
import Search from './components/Search'
import PlatformConfigTable from './components/PlatformConfigTable'
import ComingConfigTable from './components/ComingConfigTable'

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

interface MemberFormProps {
  /**
   * 数据id
   */
  id?: number
  /**
   * 是否可编辑的
   */
  isEdit?: boolean
}

type RuleInfoType = Omit<GetMemberProcessRuleGetResponse, 'roleName' | 'memberTypeName' | 'roleId' | 'roleTypeName'> & {
  memberRole: {
    roleName: string
    memberTypeName: string
    roleId: number
    roleTypeName: string
  }
  configIds: any[]
}

const FlowRuleForm: React.FC<MemberFormProps> = ({ id, isEdit = false }) => {
  const [ruleInfo, setRuleInfo] = useState<RuleInfoType>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)

  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  const getDetailedInfo = async () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    const res = await getMemberSupplierProcessRuleGet({
      id: `${id}`,
    })

    if (res.code !== 1000) {
      return
    }
    const { roleId, roleName, roleTypeName, memberTypeName, details, ...rest } = res.data as any
    setRuleInfo({
      memberRole: {
        roleName,
        memberTypeName,
        roleId,
        roleTypeName,
      },
      configIds: details,
      ...rest,
    })

    setInfoLoading(false)
  }

  useEffect(() => {
    getDetailedInfo()
  }, [])

  const handleSubmit = (values: any) => {
    const { memberRole, configIds, usePlatformConfig, ...rest } = values

    if (!id && isEdit) {
      setSubmitLoading(true)
      const msg = message.loading({
        content: intl.formatMessage({ id: 'member.memberFlowRule.components.FlowRuleForm.add.message' }),
        duration: 0,
      })
      postMemberSupplierProcessRuleAdd(
        {
          roleId: memberRole.roleId,
          configIds: configIds.map((item) => item.id),
          ...rest,
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
    if (id && isEdit) {
      setSubmitLoading(true)
      const msg = message.loading({
        content: intl.formatMessage({ id: 'member.memberFlowRule.components.FlowRuleForm.save.message' }),
        duration: 0,
      })
      postMemberSupplierProcessRuleUpdate(
        {
          id,
          roleId: memberRole.roleId,
          configIds: configIds.map((item) => item.id),
          ...rest,
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
    }
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        style={{
          padding: 24,
        }}
        title={
          !id
            ? intl.formatMessage({ id: 'supplier.supplierFlowRule.components.FlowRuleForm.title-add' })
            : isEdit
            ? intl.formatMessage({ id: 'supplier.supplierFlowRule.components.FlowRuleForm.title-edit' })
            : intl.formatMessage({ id: 'supplier.supplierFlowRule.components.FlowRuleForm.title-info' })
        }
        extra={[
          isEdit ? (
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => formActions.submit()}
            >
              {intl.formatMessage({ id: 'member.memberFlowRule.components.FlowRuleForm.save' })}
            </Button>
          ) : null,
        ]}
      >
        <Card>
          <NiceForm
            onSubmit={handleSubmit}
            actions={formActions}
            initialValues={ruleInfo}
            components={{
              MemberRoleFormItem,
              FlowListFormItem,
              MySearch: Search,
              Checkbox,
              CheckboxGroup: Checkbox.Group,
              PlatformConfigTable,
              ComingConfigTable,
            }}
            effects={($, actions) => {
              createEffects($, actions)
              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={formSchema}
            editable={isEdit}
          />
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}

FlowRuleForm.defaultProps = {
  id: 0,
  isEdit: false,
}

export default FlowRuleForm
