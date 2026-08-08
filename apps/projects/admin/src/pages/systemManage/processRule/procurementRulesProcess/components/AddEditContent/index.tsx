import React, { useRef, useEffect, useState } from 'react'
import { Form, Space } from 'antd'
import { history } from '@linkseeks/router-manager'
import ContentLayout from '@/components/ContentLayout'
import ProcessEngLayout from '@/pages/systemManage/components/ProcessEng'
import ProcessSelectLayout from '@/pages/systemManage/components/ProcessSelect'
import ApplyMemberLayout from '@/pages/systemManage/components/ApplyMember'
import { getMemberManageLowerConsumerMemberPage } from '@apps/apis'
import {
  getOrderPlatformPurchaseProcessBaseList,
  getOrderPlatformPurchaseProcessGet,
  getOrderPlatformPurchaseProcessMemberPage,
  postOrderPlatformPurchaseProcessCreate,
  postOrderPlatformPurchaseProcessSaveDefault,
  postOrderPlatformPurchaseProcessUpdate,
} from '@apps/apis'
import { VISIT_TYPE } from '@/constants'

type PropsType = {
  type: 'add' | 'edit' | 'view'
  id?: string
  btnCode?: string
  title?: string | React.ReactNode
}

const AddEditContent: React.FC<PropsType> = ({ id: processId, title, type }) => {
  const [form] = Form.useForm()

  // 流程规则是否为默认，以默认的情况初始化
  const [isDefault, setIsDefault] = useState<boolean>(true)
  // 编辑情况下且流程规则为默认才视为修改默认
  const isEditDefault = !!(type === VISIT_TYPE.EDIT && isDefault)

  const ref = useRef<any>()
  const processSelectRef = useRef<any>()

  const handleSubmit = (setLoading: Function, handleLeave: Function) => {
    form.validateFields().then((values) => {
      setLoading?.(true)
      if (isEditDefault) {
        const params = {
          processId: values.baseProcessId,
        }
        postOrderPlatformPurchaseProcessSaveDefault(params).then((res) => {
          if (res.code !== 1000) {
            setLoading?.(false)
            return
          }
          handleLeave?.(false)
          history.goBack()
        })
      } else {
        const params = {
          processId,
          ...values,
          allMembers: values.allMembers === 1 ? true : false,
          members:
            values.allMembers === 2
              ? values.members?.map((_item) => {
                  return {
                    memberId: _item.memberId,
                    roleId: _item.roleId,
                  }
                })
              : undefined,
        }
        const fetchApi = processId ? postOrderPlatformPurchaseProcessUpdate : postOrderPlatformPurchaseProcessCreate
        fetchApi({ ...params }).then((res) => {
          if (res.code !== 1000) {
            setLoading?.(false)
            return
          }
          handleLeave?.(false)
          history.goBack()
        })
      }
    })
  }

  const getDetail = async () => {
    if (processId) {
      Promise.all([
        getOrderPlatformPurchaseProcessMemberPage({ processId, current: 1, pageSize: 100 } as any),
        getOrderPlatformPurchaseProcessGet({ processId }),
      ]).then((resArr) => {
        if (resArr.every((item) => item && item.code === 1000)) {
          const members = resArr[0]?.data?.data?.map((_item) => ({
            ..._item,
            mrId: `${_item.memberId}_${_item.roleId}`,
          }))
          const detail = resArr[1]?.data
          form.setFieldsValue({
            name: detail?.name,
            baseProcessId: detail?.baseProcessId,
            allMembers: detail?.allMembers ? 1 : 2,
            members,
          })
          setIsDefault(detail?.isDefault === 1)
          processSelectRef.current?.getDataSource(
            detail?.isDefault === 1 ? { processType: detail?.baseProcess?.processType } : {},
          )
          ref?.current?.setProgress()
        }
      })
    } else {
      processSelectRef.current?.getDataSource()
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <ContentLayout ref={ref} form={form} title={title} type={type} onSubmit={handleSubmit}>
      <Space direction="vertical" size={16} style={{ display: 'flex', width: '100%' }}>
        <ProcessEngLayout disabled={type === VISIT_TYPE.VIEW || isEditDefault} />
        <ProcessSelectLayout
          ref={processSelectRef}
          disabled={type === VISIT_TYPE.VIEW}
          processKey="baseProcessid"
          fetchApi={getOrderPlatformPurchaseProcessBaseList}
        />
        <ApplyMemberLayout
          disabled={type === VISIT_TYPE.VIEW || isEditDefault}
          fetchMemberApi={getMemberManageLowerConsumerMemberPage}
          showAdvancedFilter={false}
        />
      </Space>
    </ContentLayout>
  )
}
export default AddEditContent
