/*
 * @Description: 新增会员角色
 */
import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { Button, Card, Spin, message } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { SaveOutlined } from '@ant-design/icons'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Radio, Checkbox, ArrayTable } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'
import ReturnEle from '@/components/ReturnEle'
import NiceForm from '@/components/NiceForm'
import { getMemberCustomerAbilityInfoDetailByrole, postMemberCustomerAbilityInfoAddrole } from '@apps/apis'
import { schema } from './schema/createRole'
import AreaSelect from '../components/AreaSelect'

const formActions = createFormActions()
const { onFormInputChange$ } = FormEffectHooks

const AddSubRole: React.FC<any> = () => {
  const { memberType, roleId } = usePageStatus()
  const [memberItems, setMemberItems] = useState<any[]>([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)

  const intl = useIntl()

  usePrompt({ when: unsaved, message: intl.formatMessage({ id: 'common.tip.save.confirm' }) })

  const getDetailedInfo = async () => {
    if (memberType && roleId) {
      setInfoLoading(true)
      const infoRes = await getMemberCustomerAbilityInfoDetailByrole({
        roleId,
      })

      setInfoLoading(false)
      if (infoRes.code !== 1000) {
        return
      }
      const { groups = [] } = infoRes.data

      setMemberItems(groups)
    }
  }

  useEffect(() => {
    getDetailedInfo()
  }, [])

  const handleSubmit = (values: any) => {
    if (!memberType || !roleId) {
      return
    }
    setSubmitLoading(true)
    const msg = message.loading({
      content: intl.formatMessage({ id: 'member.memberQuery.addSubRole.save.message' }),
      duration: 0,
    })
    postMemberCustomerAbilityInfoAddrole({
      memberType,
      roleId,
      detail: values,
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
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        style={{
          padding: 24,
        }}
        title={intl.formatMessage({ id: 'supplier.supplierQuery.addSubRole.title' })}
        extra={[
          <Button
            key="1"
            type="primary"
            icon={<SaveOutlined />}
            loading={submitLoading}
            onClick={() => formActions.submit()}
          >
            {intl.formatMessage({ id: 'member.memberQuery.addSubRole.save' })}
          </Button>,
        ]}
      >
        <Card>
          <NiceForm
            onSubmit={handleSubmit}
            actions={formActions}
            components={{
              RadioGroup: Radio.Group,
              CheckboxGroup: Checkbox.Group,
              AreaSelect,
              ArrayTable,
            }}
            effects={() => {
              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={schema(memberItems, true)}
          />
        </Card>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default AddSubRole
