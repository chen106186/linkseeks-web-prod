import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Card, Spin, Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { Link, usePrompt, useQuery, useLocation } from '@linkseeks/router-core'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import ReturnEle from '@/components/ReturnEle'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { LinkOutlined, SaveOutlined } from '@ant-design/icons'
import { formSchema, logisticsSchema } from './schema'
import TableModal from '@/pages/transaction/components/tableModal'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ColumnType } from 'antd/lib/table/interface'
import {
  getLogisticsCompanyGet,
  getLogisticsSelectListMemberCompanySelected,
  postLogisticsCompanyAdd,
  postLogisticsCompanyUpdate,
} from '@apps/apis'
import { postMemberManageLogisticsPage } from '@apps/apis'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getEnableMultiTenancy } from '@/utils/auth'
const intl = getIntl()
const formActions = createFormActions()
const { onFormMount$, onFieldChange$, onFormInputChange$ } = FormEffectHooks

const COOPERATE = {
  /** 平台物流服务商 */
  PLATFORM: 1,
  /** 商户合作物流公司 */
  MERCHANTS: 2,
}

const LogisticsCompanyManageAdded = (props: any) => {
  const { id } = useQuery()
  const { pathname } = useLocation()
  const [path] = useState(pathname.split('/')[pathname.split('/').length - 1])
  const [excludeList, setExcludeList] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [unsaved, setUnsaved] = useState(false)
  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })
  const [infoLoading, setInfoLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [initialValue, setInitialValue] = useState(null)

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({ id: 'logistics.huiyuanID' }),
      key: 'memberId',
      dataIndex: 'memberId',
    },
    {
      title: intl.formatMessage({ id: 'logistics.huiyuanmingcheng' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({ id: 'logistics.huiyuanjuese' }),
      key: 'roleName',
      dataIndex: 'roleName',
    },
    {
      title: intl.formatMessage({ id: 'logistics.huiyuandengji' }),
      key: 'levelTag',
      dataIndex: 'levelTag',
    },
  ]

  const useFormEffects = () => {
    onFieldChange$('cooperateType').subscribe(({ value }) => {
      if (value === COOPERATE.PLATFORM) {
        formActions.setFieldState('code', (state) => (state.visible = false))
        formActions.setFieldState('companyMemberId', (state) => (state.visible = true))
        formActions.setFieldState('name', (state) => (state.props['x-component-props'].disabled = true))
      } else if (value === COOPERATE.MERCHANTS) {
        formActions.setFieldState('code', (state) => (state.visible = true))
        formActions.setFieldState('companyMemberId', (state) => (state.visible = false))
        formActions.setFieldState('name', (state) => (state.props['x-component-props'].disabled = false))
      }
    })
  }

  const handleFetchData = useCallback((params: any) => {
    return new Promise((resolve) => {
      getLogisticsSelectListMemberCompanySelected()
        .then((r) => {
          if (r.code !== 1000) {
            return
          }
          postMemberManageLogisticsPage({ ...params, excludeList: r.data }, { ctlType: 'none' })
            .then((res) => {
              if (res.code !== 1000) {
                return
              }
              resolve(res.data)
            })
            .catch((error) => {
              console.warn(error)
            })
        })
        .catch((error) => {
          console.warn(error)
        })
    })
  }, [])

  const toggle = (flag: boolean) => {
    setVisible(flag)
  }

  const handleLogisticOnOk = (selectRowKeys: string[] | number[], selectRowRecord: any) => {
    const target = selectRowRecord[0]
    formActions.setFieldValue('name', target.name)
    formActions.setFieldValue('companyMemberId', target.memberId)
    setExcludeList(selectRowRecord)
    toggle(false)
  }

  const handleOnSubmit = async (values: any) => {
    setSubmitLoading(true)
    const params: any = {
      name: values.name,
      cooperateType: values.cooperateType,
      remark: values.remark,
    }
    if (values.cooperateType === COOPERATE.PLATFORM) {
      params.companyMemberId = values.companyMemberId
      params.companyRoleId = values.companyRoleId || excludeList[0].roleId
    } else {
      params.code = values.code
    }
    path === 'edit' && (params.id = id)
    const servie = path === 'add' ? postLogisticsCompanyAdd : postLogisticsCompanyUpdate
    servie({ ...params })
      .then((res) => {
        setUnsaved(false)
        setSubmitLoading(false)
        if (res.code !== 1000) {
          return
        }
        setTimeout(() => {
          history.goBack()
        }, 200)
      })
      .catch((_error) => {
        setSubmitLoading(false)
      })
  }

  useEffect(() => {
    if (path !== 'add') {
      setInfoLoading(true)
      getLogisticsCompanyGet({ id })
        .then((res) => {
          setInfoLoading(false)
          if (res.code !== 1000) {
            return
          }
          setInitialValue(res.data)
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }, [])

  const formatedValue = useMemo(() => {
    if (!initialValue) {
      return {}
    }
    return initialValue
  }, [initialValue])

  const useBusinessEffects = () => {
    const linkage = useLinkageUtils()
    const enableMultiTenancy = getEnableMultiTenancy()
    const _enum = [
      {
        label: intl.formatMessage({ id: 'logistics.shanghuhezuowuliugongsi' }),
        value: 2,
      },
    ]
    !enableMultiTenancy &&
      _enum.push({ label: intl.formatMessage({ id: 'logistics.pingtaiwuliufuwushang' }), value: 1 })
    onFormMount$().subscribe(() => {
      linkage.enum('cooperateType', _enum)
    })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={
          !id
            ? intl.formatMessage({ id: 'logistics.xinzengwuliugongsi' })
            : path === 'edit'
            ? intl.formatMessage({ id: 'logistics.bianjiwuliugongsi' })
            : intl.formatMessage({ id: 'logistics.zhakanwuliugongsi' })
        }
        extra={[
          path !== 'preview' && (
            <Button
              key="1"
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => formActions.submit()}
            >
              {intl.formatMessage({ id: 'logistics.baocun' })}
            </Button>
          ),
        ]}
      >
        <Card>
          <NiceForm
            previewPlaceholder="-"
            initialValues={formatedValue}
            actions={formActions}
            onSubmit={handleOnSubmit}
            expressionScope={{
              connectMember:
                path !== 'preview' ? (
                  <div onClick={() => toggle(true)}>
                    <LinkOutlined style={{ marginRight: 4 }} />
                    {intl.formatMessage({ id: 'logistics.xuanze' })}
                  </div>
                ) : null,
            }}
            effects={() => {
              useFormEffects()
              useBusinessEffects()
              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
            schema={formSchema}
            editable={path === 'preview' ? false : true}
          />
        </Card>
      </PageHeaderWrapper>
      <TableModal
        title={intl.formatMessage({ id: 'logistics.xuanzepingtaiwuliufuwu' })}
        mode="radio"
        modalType="Drawer"
        customKey="memberId"
        columns={columns}
        schema={logisticsSchema}
        fetchData={handleFetchData}
        visible={visible}
        effects={($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'name', FORM_FILTER_PATH)
        }}
        tableProps={{
          rowKey: 'memberId',
        }}
        onClose={() => toggle(false)}
        onOk={handleLogisticOnOk}
      />
    </Spin>
  )
}

LogisticsCompanyManageAdded.defaultProps = {
  id: 0,
  isEdit: false,
}

export default LogisticsCompanyManageAdded
