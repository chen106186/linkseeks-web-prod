import React, { useEffect, useState } from 'react'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { ArrayTable } from '@apps/formily'
import { addSchema } from './schemas'
import ProcessRadio from './components/processRadio'
import { Button } from 'antd'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { usePageStatus } from '@/hooks/usePageStatus'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl, getIntl } from '@linkseeks/i18n'
import { SaveOutlined } from '@ant-design/icons'
import {
  getContractCoordinationProcessBaseList,
  getContractCoordinationProcessGet,
  postContractCoordinationProcessSave,
  postContractCoordinationProcessUpdate,
} from '@apps/apis'
import { FormDetailContext } from '@/formSchema/context'
import FormDetailHeader from '@/components/FormDetailHeader'
import FormDetailWrapper from '@/components/FormDetailWrapper'
import { useFormDetail } from '@/formSchema/effects/useFormDetail'
import styles from './add.less'
import ApplicableMaterial from './components/applicableMaterials'

const formActions = createFormActions()
const intl1 = getIntl()

const { onFormInputChange$ } = FormEffectHooks

type SubmitDataType = {
  name: string
  /** 适用物料类型枚举值,1-所有物料,2-选择部分物料组,3-选择部分物料 */
  suitableMaterialType: string | number
  /** 基础物料流程id */
  baseProcessId: number
  /**
   * 选择部分物料,适用物料类型是3时，
   */
  materials?: {
    id: number
  }[]
  /** 选择部分物料分组,适用物料类型是2时 */
  materialGroups?: {
    id: number
  }[]
}

/**
 * 新增物料审核流程规则
 */

const contractHeader = [
  {
    name: intl1.formatMessage({
      id: 'contract.rules.header.info',
      defaultMessage: '基本信息',
    }),
    key: 'basic',
  },
  {
    name: intl1.formatMessage({
      id: 'contract.rules.header.flow',
      defaultMessage: '流程选择',
    }),
    key: 'type',
  },
  {
    name: intl1.formatMessage({
      id: 'contract.rules.header.contract',
      defaultMessage: '适用合同',
    }),
    key: 'apply',
  },
]

/** 全部物料 */
const ALL = 1

/** 选择部分物料组 */
const GROUP = 2

/** 选择部分物料 */
const MATERIAL_ITEM = 3

const Add = () => {
  const { id, lastTypeParams } = usePageStatus()
  const isAdd = lastTypeParams === '/add' && !id
  const isEdit = lastTypeParams === '/edit' && id
  const isEditable = isAdd || isEdit

  const [initialValue, setInitialValue] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(false)
  const intl = useIntl()
  const { formContext } = useFormDetail()

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const providerValue = {
    schemaActions: formActions,
    formContext,
  }

  useEffect(() => {
    if (isAdd) {
      setInitialValue({
        suitableMaterialType: ALL,
      })
      return
    }
    async function getInitialValue() {
      const { data, code } = await getContractCoordinationProcessGet({
        processId: id,
      })
      if (code === 1000) {
        /** 选择部分物料 */
        let materials = []
        let materialGroups = []

        setInitialValue({
          ...data,
          materials: materials,
          suitableMaterialType: 1,
          materialGroups: materialGroups,
        })
      }
    }
    getInitialValue()
  }, [])

  const fetchProcess = async () => {
    const { data, code } = await getContractCoordinationProcessBaseList()

    if (code === 1000) {
      return data
    }
    return []
  }

  const handleSubmit = async (values: SubmitDataType) => {
    console.log(values)
    if (formContext.innerFormErrors) {
      throw new Error(
        intl.formatMessage({
          id: 'purchaseRequisition.qingwanshandingdan',
          defaultMessage: '请完善订单物料数据',
        }),
      )
    }

    setLoading(true)
    let tempData = {}

    const { materials, name, baseProcessId, materialGroups, ...rest } = values
    const defaultPostData = {
      baseProcessId: baseProcessId,
      allContract: true,
      name: name,
      // ...rest,
      // ...tempData,
    }
    const postData = isAdd
      ? defaultPostData
      : {
          ...defaultPostData,
          processId: id,
        }

    const service = isAdd ? postContractCoordinationProcessSave : postContractCoordinationProcessUpdate

    const { data, code } = await service(postData)
    setLoading(false)
    if (code === 1000) {
      setUnsaved(false)
      setTimeout(() => {
        history.back()
      }, 100)
    }
  }

  const renderTitle = () => {
    if (isAdd) {
      return intl.formatMessage({
        id: 'contract.together.rules.isAdd',
        defaultMessage: '新增合同协同流程规则',
      })
    }
    if (isEdit) {
      return intl.formatMessage({
        id: 'contract.together.rules.isEdit',
        defaultMessage: '编辑合同协同流程规则',
      })
    }
    return intl.formatMessage({
      id: 'contract.together.rules.isView',
      defaultMessage: '查看合同协同流程规则',
    })
  }

  return (
    <div className={styles['mian']}>
      <FormDetailContext.Provider value={providerValue}>
        <FormDetailHeader
          title={renderTitle()}
          schema={addSchema}
          extraRight={[
            isEditable && (
              <Button
                key="1"
                onClick={() => formActions.submit()}
                loading={loading}
                type="primary"
                icon={<SaveOutlined />}
              >
                {intl.formatMessage({
                  id: 'purchaseRequisition.baocun',
                  defaultMessage: '保存',
                })}
              </Button>
            ),
          ]}
        />
        <FormDetailWrapper>
          <NiceForm
            onSubmit={handleSubmit}
            schema={addSchema}
            actions={formActions}
            value={initialValue}
            editable={isEditable as boolean}
            components={{
              ProcessRadio,
              ApplicableMaterial,
              ArrayTable,
              // SelectMaterial,
            }}
            effects={($, actions) => {
              useAsyncSelect('baseProcessId', fetchProcess)
              $('onFieldInputChange', 'baseProcessId').subscribe((fieldState) => {
                actions.setFieldState('selectMaterials', (state) => {
                  FormPath.setIn(state, 'props.x-component-props', {
                    processId: fieldState.value,
                  })
                })
              })

              // 注入表单完成进度
              formContext.useAttachmentChangeForContext(actions)
              onFormInputChange$().subscribe(() => {
                if (!unsaved) {
                  setUnsaved(true)
                }
              })
            }}
          />
        </FormDetailWrapper>
      </FormDetailContext.Provider>
    </div>
  )
}

export default Add
